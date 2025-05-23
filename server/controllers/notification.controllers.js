import mongoose from "mongoose";
import { ChatEventEnum, USER_ACTIVITY_TYPES } from "../constants.js";
import { Notification } from "../models/notification.model.js";
import { emitNotification } from "../socket.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

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

const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  // Build the query based on the isRead parameter
  const query = { user: userId };
  if (req.query.isRead !== undefined) {
    query.isRead = req.query.isRead === "true";
  }

  // Query notifications for the user
  const notifications = await Notification.find(query)
    .populate("sender", "username avatar")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  // Populate the referenceId for each notification
  const populatedNotifications = await Promise.all(
    notifications.map(async (notification) => {
      const populatedNotification = { ...notification };

      if (notification.referenceId && notification.referenceModel) {
        const RefModel = mongoose.model(notification.referenceModel);
        populatedNotification.referenceDoc = await RefModel.findById(
          notification.referenceId
        ).lean();
      }

      return populatedNotification;
    })
  );

  const totalCount = await Notification.countDocuments(query);
  res.status(200).json(
    new ApiResponse(
      200,
      {
        notifications: populatedNotifications,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      },
      "Notifications fetched successfully",
      USER_ACTIVITY_TYPES.RETRIEVE_DATA
    )
  );
});

const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notificationId = req.query.notificationId || req.body.notificationId;
  const chatId = req.query.chatId || req.body.chatId;

  if (!notificationId && !chatId) {
    throw new ApiError(400, "notificationId or chatId is required");
  }

  let notification;

  if (notificationId) {
    notification = await Notification.findById(notificationId);
  } else if (chatId) {
    notification = await Notification.findOne({
      referenceId: chatId,
      type: "message",
      user: req.user._id,
      isRead: false,
    });
  }

  if (!notification) {
    return res.status(204).end(); // Nothing to mark
  }

  // If it's a message-type, just delete it
  if (notification.type === "message") {
    await Notification.deleteOne({ _id: notification._id });
    console.log("Message-type notification deleted:", notification._id);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          notification,
          "Message notification deleted after marking as read",
          USER_ACTIVITY_TYPES.READ_NOTIFICATION
        )
      );
  }

  // Otherwise mark as read and update readAt
  notification.isRead = true;
  notification.readAt = new Date();
  await notification.save();

  console.log("Notification marked as read:", notification);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        notification,
        "Notification marked as read",
        USER_ACTIVITY_TYPES.READ_NOTIFICATION
      )
    );
});

const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find all unread notifications for the user
  const unreadNotifications = await Notification.find({
    user: userId,
    isRead: false,
  });

  // Process each notification
  const markAsReadPromises = unreadNotifications.map(async (notification) => {
    if (notification.type === "message") {
      // Delete message-type notifications
      await Notification.findByIdAndDelete(notification._id);
    } else {
      // Mark other notifications as read
      notification.isRead = true;
      await notification.save();
    }
  });

  // Wait for all notifications to be processed
  await Promise.all(markAsReadPromises);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "All notifications marked as read",
        USER_ACTIVITY_TYPES.READ_ALL_NOTIFICATIONS
      )
    );
});

export { getNotifications, markNotificationAsRead, markAllNotificationsAsRead };
