import mongoose, { Schema } from "mongoose";
import { User } from "./user.models.js";
import { SocialPost } from "./post.models.js";
import { SocialComment } from "./comment.models.js";

const likeSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "SocialPost",
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: "SocialComment",
    },
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const SocialLike = mongoose.model("SocialLike", likeSchema);
