// models/userSettings.models.js
import mongoose from "mongoose";

const UserSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    notifications: {
      push: { type: Boolean, default: false },
      email: { type: Boolean, default: true },
    },
    appearance: {
      theme: { type: String, enum: ["light", "dark"], default: "light" },
      fontSize: {
        type: String,
        enum: ["small", "medium", "large"],
        default: "medium",
      },
    },
    interaction: {
      autoPlayVideos: { type: Boolean, default: false },
      showTypingIndicators: { type: Boolean, default: true },
    },
    visibility: {
      profile: { type: String, enum: ["public", "private"], default: "public" },
    },
    meta: {
      language: {
        type: String,
        default: "en",
      },
      version: {
        type: Number,
        default: 1,
      },
    },
  },
  { timestamps: true } // mongoose adds createdAt, updatedAt here
);

export default mongoose.model("UserSettings", UserSettingsSchema);
