import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

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
      refPath: "refSchema",
    },
    referenceModel: {
      type: String,
      required: true,
      enum: [
        "ChatMessage",
        "SocialFollow",
        "SocialPost",
        "SocialLike",
        "SocialComment",
      ],
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes to improve query performance
notificationSchema.index({ user: 1, isRead: 1 });

// Add pagination plugin to the Notification schema
notificationSchema.plugin(mongooseAggregatePaginate);

// Export the Notification model
export const Notification = mongoose.model("Notification", notificationSchema);
