import mongoose from "mongoose";
import { ChatEventEnum } from "../constants.js";
import { Notification } from "../models/notification.model.js";
import { emitNotification } from "../socket.js";

export const createNotification = async (
  req,
  userId,
  sender,
  preview,
  type,
  referenceId,
  referenceModel
) => {
  try {
    if (type === "message") {
      // Check if there's an existing notification for messages from the same sender
      const existingNotification = await Notification.findOne({
        user: userId,
        sender: sender._id.toString(),
        type: "message",
        isRead: false,
      });

      if (existingNotification) {
        // Update the preview with the latest message
        existingNotification.preview = [
          ...(existingNotification.preview || []), // Keep existing messages
          preview,
        ].slice(-2); // Keep only the last 2 messages
        existingNotification.referenceId = referenceId;
        existingNotification.repetitionCount =
          existingNotification.repetitionCount + 1;
        await existingNotification.save();

        // Emit the updated notification via Socket.IO
        emitNotification(req, userId, ChatEventEnum.NOTIFICATION_UPDATE_EVENT, {
          ...existingNotification.toObject(),
          sender,
        });
        return existingNotification;
      }
    }

    // Create a new notification if no existing one is found
    const notification = new Notification({
      user: userId,
      sender: sender._id.toString(),
      type,
      preview,
      referenceId,
      referenceModel,
      repetitionCount: 1,
    });

    await notification.save();

    // Emit the notification via Socket.IO
    emitNotification(req, userId, ChatEventEnum.NOTIFICATION_EVENT, {
      ...notification.toObject(),
      sender,
    });

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw new Error("Server error while creating notification");
  }
};

export const getNotifications = async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    // Query notifications for the user, sorted by createdAt desc
    const notifications = await Notification.find({ user: userId })
      .populate("sender", "username avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean() // Use lean() for better performance
      .exec();

    // Populate the referenceId for each notification
    const populatedNotifications = await Promise.all(
      notifications.map(async (notification) => {
        const populatedNotification = { ...notification };
        if (notification.referenceId && notification.referenceModel) {
          const RefModel = mongoose.model(notification.referenceModel);
          populatedNotification.referenceId = await RefModel.findById(
            notification.referenceId
          ).lean();
        }
        return populatedNotification;
      })
    );

    const totalCount = await Notification.countDocuments({ user: userId });
    res.status(200).json({
      notifications: populatedNotifications,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res
      .status(500)
      .json({ error: "Server error while fetching notifications" });
  }
};

export const markNotificationAsRead = async (req, res) => {
  const { notificationId } = req.params;
  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    if (notification.type === "message") {
      // Delete the notification if it's a message type
      await Notification.findByIdAndDelete(notificationId);
      res
        .status(200)
        .json({ message: "Message notification deleted", notification });
    } else {
      // Mark other types of notifications as read
      notification.isRead = true;
      await notification.save();
      res.status(200).json(notification);
    }
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ error: "Server error while updating notification" });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  const userId = req.user._id;

  try {
    // Find all unread notifications for the user
    const unreadNotifications = await Notification.find({
      user: userId,
      isRead: false,
    });

    // Mark all notifications as read and delete message-type notifications
    const markAsReadPromises = unreadNotifications.map(async (notification) => {
      if (notification.type === "message") {
        await Notification.findByIdAndDelete(notification._id);
      } else {
        notification.isRead = true;
        await notification.save();
      }
    });

    // Wait for all notifications to be processed
    await Promise.all(markAsReadPromises);

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res
      .status(500)
      .json({ error: "Server error while marking all notifications as read" });
  }
};
