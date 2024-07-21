import webPush from "web-push";
import { NotificationSubscription } from "../models/notificationSubscription.models.js";

const getAllSubscriptions = async (req, res) => {
  const subscriptions = await NotificationSubscription.find().populate("user");
  res.json(subscriptions);
};

// Controller to save a subscription
const subscribeNotifications = async (req, res) => {
  const { endpoint, keys } = req.body;
  const user = req.user;

  try {
    const subscription = await NotificationSubscription.create({
      user,
      endpoint,
      keys,
    });

    res
      .status(201)
      .json({ message: "Subscription saved successfully", subscription });
  } catch (error) {
    console.error("Error saving subscription:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to remove a subscription
const unsubscribeNotifications = async (req, res) => {
  const { endpoint } = req.body;

  try {
    const subscription = await NotificationSubscription.findOneAndDelete({
      endpoint,
    });
    if (subscription) {
      console.log("Subscription removed:", subscription);
      res.json({ message: "Subscription removed successfully" });
    } else {
      res.status(404).json({ error: "Subscription not found" });
    }
  } catch (error) {
    console.error("Error removing subscription:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const sendPushNotification = async (recipientId, options) => {
  console.log("Sending notification to:", recipientId);
  try {
    const subscriptions = await NotificationSubscription.find({
      user: recipientId,
      active: true,
    });

    subscriptions.forEach((subscription) => {
      webPush
        .sendNotification(subscription, JSON.stringify(options))
        .then(() => console.log("Notification sent"))
        .catch((error) => console.error("Error sending notification:", error));
    });

    return { message: "Notification sent successfully" };
  } catch (error) {
    console.error("Error sending notification:", error);
    throw new Error("An error occurred while sending the notification");
  }
};

const updatePushSubscriptionStatus = async (req, res) => {
  const { endpoint, keys } = req.body;
  const { status } = req.params; // "activate" or "deactivate"

  if (!endpoint || (status === "activate" && !keys)) {
    return res
      .status(400)
      .json({ error: "Endpoint and keys are required for activation" });
  }

  try {
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
          return res.status(404).json({ error: "Subscription not found" });
        }
        break;

      default:
        return res.status(400).json({ error: "Invalid status" });
    }

    res.json({
      message: `Subscription ${
        status === "activate" ? "activated" : "deactivated"
      } successfully`,
      subscription,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: `An error occurred while ${
        status === "activate" ? "activating" : "deactivating"
      } the subscription`,
    });
  }
};

export {
  subscribeNotifications,
  unsubscribeNotifications,
  sendPushNotification,
  getAllSubscriptions,
  updatePushSubscriptionStatus,
};
