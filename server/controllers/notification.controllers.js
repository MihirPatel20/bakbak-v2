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
    let existingNotification;

    // Common query base
    const baseQuery = {
      user: userId,
      sender: sender._id.toString(),
      type,
      isRead: false,
    };

    // Only add referenceId if it exists
    if (referenceId) baseQuery.referenceId = referenceId;

    existingNotification = await Notification.findOne(baseQuery);

    let isUpdate = false;
    let notification;

    if (existingNotification) {
      // If message, append preview (as array); else, replace preview
      if (type === "message") {
        existingNotification.preview = [
          ...(existingNotification.preview || []),
          preview,
        ].slice(-2);
      } else {
        existingNotification.preview = preview;
      }

      existingNotification.referenceId =
        referenceId || existingNotification.referenceId;
      existingNotification.referenceModel =
        referenceModel || existingNotification.referenceModel;
      existingNotification.repetitionCount =
        (existingNotification.repetitionCount || 1) + 1;
      existingNotification.updatedAt = new Date();

      notification = await existingNotification.save();
      isUpdate = true;
    } else {
      notification = new Notification({
        user: userId,
        sender: sender._id.toString(),
        type,
        preview: type === "message" ? [preview] : preview,
        referenceId,
        referenceModel,
        repetitionCount: 1,
      });
      await notification.save();
    }

    const populatedNotification = notification.toObject();

    // Populate referenceDoc if applicable
    if (notification.referenceId && notification.referenceModel) {
      try {
        const RefModel = mongoose.model(notification.referenceModel);
        populatedNotification.referenceDoc = await RefModel.findById(
          notification.referenceId
        ).lean();
      } catch (err) {
        console.warn("Failed to populate referenceDoc:", err.message);
        populatedNotification.referenceDoc = null;
      }
    }

    populatedNotification.sender = { ...(sender.toObject?.() || sender) };

    emitNotification(
      req,
      userId,
      isUpdate
        ? ChatEventEnum.NOTIFICATION_UPDATE_EVENT
        : ChatEventEnum.NOTIFICATION_EVENT,
      populatedNotification
    );

    return populatedNotification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw new Error("Server error while creating notification");
  }
};

const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const {
    readStatus = "all", // 'unread' | 'read' | 'all'
    type = "all", // 'message', 'like', "follow" etc.
    sortBy = "newest", // 'newest', 'oldest', 'mostFrequent'
    page = 1,
    limit = 10,
  } = req.query;

  const query = { user: userId };

  // Read status filter
  if (readStatus === "unread") query.isRead = false;
  else if (readStatus === "read") query.isRead = true;

  // Type / referenceModel filter
  if (type !== "all") {
    query.type = type; // or `referenceModel` if that's what you use
  }

  // Sort logic
  let sortOption = { updatedAt: -1 };
  if (sortBy === "oldest") sortOption = { updatedAt: 1 };
  else if (sortBy === "mostFrequent") sortOption = { repetitionCount: -1 };

  const notifications = await Notification.find(query)
    .populate("sender", "username avatar")
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  const totalCount = await Notification.countDocuments(query);

  // Optional: Populate referenceDoc
  const populatedNotifications = await Promise.all(
    notifications.map(async (notif) => {
      const populated = { ...notif };
      if (notif.referenceId && notif.referenceModel) {
        try {
          const RefModel = mongoose.model(notif.referenceModel);
          populated.referenceDoc = await RefModel.findById(
            notif.referenceId
          ).lean();
        } catch (err) {
          populated.referenceDoc = null;
        }
      }
      return populated;
    })
  );

  res.status(200).json(
    new ApiResponse(
      200,
      {
        notifications: populatedNotifications,
        totalCount,
        currentPage: Number(page),
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
