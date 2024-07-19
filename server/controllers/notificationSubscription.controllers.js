import webPush from "web-push";
import { NotificationSubscription } from "../models/notificationSubscription.models.js";

// Controller to save a subscription
const subscribeNotifications = async (req, res) => {
  const { endpoint, keys } = req.body;
  const user = req.user;

  console.log("body: ", req.body);
  console.log("user: ", user);

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

const sendPushNotification = async (req, res) => {
  // Send push notification
  const options = req.body;
  const { recipientId } = req.params;

  const subscriptions = await NotificationSubscription.find({
    user: recipientId,
  });

  subscriptions.forEach((subscription) => {
    webPush
      .sendNotification(subscription, JSON.stringify(options))
      .then(() => console.log("Notification sent"))
      .catch((error) => console.error("Error sending notification:", error));
  });

  res.json({ message: "Notification sent successfully" });
};

const getAllSubscriptions = async (req, res) => {
  const subscriptions = await NotificationSubscription.find().populate("user");
  res.json(subscriptions);
};

export { subscribeNotifications, sendPushNotification, getAllSubscriptions };
