import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { ReferenceModel } from "../constants.js";

// Define the Notification schema
const notificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["message", "follow_request", "like", "comment"],
    },
    preview: [{ type: String }],
    repetitionCount: {
      type: Number,
      default: 1,
    },
    referenceId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "referenceModel",
    },
    referenceModel: {
      type: String,
      required: true,
      enum: ReferenceModel,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Indexes
notificationSchema.index({ user: 1, isRead: 1 });

// TTL index: delete 3 days after read
notificationSchema.index(
  { readAt: 1 },
  { expireAfterSeconds: 3 * 24 * 60 * 60 } // 3 days
);

// Optional: TTL for unread cleanup after 7 days
// notificationSchema.index(
//   { createdAt: 1 },
//   { expireAfterSeconds: 7 * 24 * 60 * 60 }
// );

// Pagination
notificationSchema.plugin(mongooseAggregatePaginate);

export const Notification = mongoose.model("Notification", notificationSchema);
