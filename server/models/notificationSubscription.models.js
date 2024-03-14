import { Schema, model } from "mongoose";

const notificationSubscriptionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
  },
  keys: {
    p256dh: {
      type: String,
      required: true,
    },
    auth: {
      type: String,
      required: true,
    },
  },
});

export const NotificationSubscription = model(
  "NotificationSubscription",
  notificationSubscriptionSchema
);
