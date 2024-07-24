import webPush from "web-push";
import { NotificationSubscription } from "../models/notificationSubscription.models.js";
import { USER_ACTIVITY_TYPES } from "../constants.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getAllSubscriptions = asyncHandler(async (req, res) => {
  const subscriptions = await NotificationSubscription.find().populate("user");

  return res.json(
    new ApiResponse(
      200,
      { subscriptions },
      "Subscriptions retrieved successfully",
      USER_ACTIVITY_TYPES.RETRIEVE_DATA
    )
  );
});

// Controller to save a subscription
const subscribeNotifications = asyncHandler(async (req, res) => {
  const { endpoint, keys } = req.body;
  const user = req.user;

  const subscription = await NotificationSubscription.create({
    user,
    endpoint,
    keys,
  });

  res
    .status(201)
    .json(
      new ApiResponse(
        200,
        subscription,
        "Subscription saved successfully",
        USER_ACTIVITY_TYPES.SUBSCRIBE_TO_NOTIFICATIONS
      )
    );
});

// Controller to remove a subscription
const unsubscribeNotifications = asyncHandler(async (req, res) => {
  const { endpoint } = req.body;

  const subscription = await NotificationSubscription.findOneAndDelete({
    endpoint,
  });

  if (!subscription) {
    throw new ApiError(404, "Subscription not found");
  }

  return res.json(
    new ApiResponse(
      200,
      { subscription },
      "Subscription removed successfully",
      USER_ACTIVITY_TYPES.UNSUBSCRIBE_FROM_NOTIFICATIONS
    )
  );
});

// Controller to send a push notification
// It is called from the other controller
// It does not have a route
const sendPushNotification = async (recipientId, options) => {
  if (!recipientId || !options) {
    console.error("Recipient ID and options are required");
    return;
  }

  try {
    const subscriptions = await NotificationSubscription.find({
      user: recipientId,
      active: true,
    });

    if (subscriptions.length === 0) {
      console.error("No active subscriptions found");
      return;
    }

    const notifications = subscriptions.map(async (subscription) => {
      try {
        await webPush.sendNotification(subscription, JSON.stringify(options));
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    });

    await Promise.all(notifications);
  } catch (error) {
    console.error("An error occurred while sending the notification:", error);
  }
};

const updatePushSubscriptionStatus = asyncHandler(async (req, res) => {
  const { endpoint, keys } = req.body;
  const { status } = req.params; // "activate" or "deactivate"

  if (!endpoint || (status === "activate" && !keys)) {
    throw new ApiError(400, "Endpoint and keys are required for activation");
  }

  let subscription;

  switch (status) {
    case "activate":
      // Attempt to update an existing subscription or create a new one if it doesn't exist
      subscription = await NotificationSubscription.findOneAndUpdate(
        { user: req.user, endpoint },
        { $set: { active: true, ...(keys && { keys }) } },
        { new: true, upsert: true } // upsert option creates a new document if no document matches the query
      );
      break;

    case "deactivate":
      // Attempt to deactivate an existing subscription
      subscription = await NotificationSubscription.findOneAndUpdate(
        { user: req.user, endpoint },
        { $set: { active: false } },
        { new: true }
      );

      if (!subscription) {
        throw new ApiError(404, "Subscription not found");
      }
      break;

    default:
      throw new ApiError(400, "Invalid status");
  }

  const resType =
    status === "activate"
      ? USER_ACTIVITY_TYPES.ACTIVATE_PUSH_SUBSCRIPTION
      : status === "deactivate"
      ? USER_ACTIVITY_TYPES.DEACTIVATE_PUSH_SUBSCRIPTION
      : null;

  return res.json(
    new ApiResponse(
      200,
      { subscription },
      `Subscription ${status}d successfully`,
      resType
    )
  );
});

export {
  subscribeNotifications,
  unsubscribeNotifications,
  sendPushNotification,
  getAllSubscriptions,
  updatePushSubscriptionStatus,
};
