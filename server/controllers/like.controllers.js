// Importing required modules and constants
import mongoose from "mongoose";
import {
  NotificationTypes,
  ReferenceModel,
  USER_ACTIVITY_TYPES,
} from "../constants.js";
import { SocialComment } from "../models/comment.models.js";
import { SocialLike } from "../models/like.models.js";
import { SocialPost } from "../models/post.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { postCommonAggregation } from "./post.controllers.js";
import { createNotification } from "./notification.controllers.js";
import { sendPushNotification } from "./notificationSubscription.controllers.js";
import { shouldSendLikeNotification } from "../utils/notificationLimiter.js";

// Controller to like or unlike a post
const likeDislikePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user?._id;

  // Fetch the post using aggregation
  const posts = await SocialPost.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(postId),
      },
    },
    ...postCommonAggregation(req),
  ]);

  const post = posts[0];

  // If post doesn't exist, throw an error
  if (!post) {
    throw new ApiError(404, "Post does not exist");
  }

  // Check if the user has already liked the post
  const isAlreadyLiked = await SocialLike.findOne({
    postId,
    likedBy: userId,
  });

  if (isAlreadyLiked) {
    // If already liked, remove the like (unlike)
    await SocialLike.findOneAndDelete({
      postId,
      likedBy: userId,
    });

    post.isLiked = false;
    post.likes = (post.likes || 0) - 1;

    // Return response for unlike
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          post,
          "Unliked successfully",
          USER_ACTIVITY_TYPES.UNLIKE_POST
        )
      );
  } else {
    // If not liked yet, add a new like
    const like = await SocialLike.create({
      postId,
      likedBy: userId,
    });

    post.isLiked = true;
    post.likes = (post.likes || 0) + 1;

    const receiverId = post.author.owner.toString();

    if (
      receiverId !== userId.toString() &&
      shouldSendLikeNotification(userId.toString(), postId.toString())
    ) {
      // Create a notification for the post author
      await createNotification(
        req,
        receiverId, // Who receives the notification
        req.user, // Who triggered the action
        "liked your post", // Notification preview
        NotificationTypes.LIKE, // Type of notification
        post._id.toString(), // Related post ID
        ReferenceModel.POST // Type of referenced model
      );

      // Send push notification
      const senderUsername = req.user.username || "Someone";
      const options = {
        title: `${senderUsername} liked your post!`,
        body: "Tap to view the post.",
        icon: "icons/bakbak.ico",
        badge: "icons/bakbak.ico",
        tag: "like",
        data: { url: `/social/post/${postId}` },
      };

      await sendPushNotification(receiverId, options);
    }

    // Return response for like
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          post,
          "Liked successfully",
          USER_ACTIVITY_TYPES.LIKE_POST
        )
      );
  }
});

// Controller to like or unlike a comment
const likeDislikeComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user?._id;

  // Find the comment and populate author info
  const comment = await SocialComment.findById(commentId).populate("author");

  // If comment doesn't exist, throw an error
  if (!comment) {
    throw new ApiError(404, "Comment does not exist");
  }

  // Check if the user has already liked the comment
  const isAlreadyLiked = await SocialLike.findOne({
    commentId,
    likedBy: userId,
  });

  if (isAlreadyLiked) {
    // If already liked, remove the like (unlike)
    await SocialLike.findOneAndDelete({
      commentId,
      likedBy: userId,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { commentId, isLiked: false },
          "Unliked successfully",
          USER_ACTIVITY_TYPES.UNLIKE_COMMENT
        )
      );
  } else {
    // Add a new like
    await SocialLike.create({
      commentId,
      likedBy: userId,
    });

    const receiverId = comment.author._id.toString();

    // Avoid notifying self
    if (
      receiverId !== userId.toString() &&
      shouldSendLikeNotification(userId.toString(), postId.toString())
    ) {
      // Create notification for comment author
      await createNotification(
        req,
        receiverId,
        req.user,
        "liked your comment",
        NotificationTypes.LIKE,
        commentId,
        ReferenceModel.COMMENT
      );

      // Send push notification
      const senderUsername = req.user.username || "Someone";
      const options = {
        title: `${senderUsername} liked your comment!`,
        body: "Tap to view the comment.",
        icon: "icons/bakbak.ico",
        badge: "icons/bakbak.ico",
        tag: "comment-like",
        data: { url: `/social/post/${comment.postId}` },
      };

      await sendPushNotification(receiverId, options);
    }

    // Return response for like
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isLiked: true, commentId },
          "Liked successfully",
          USER_ACTIVITY_TYPES.LIKE_COMMENT
        )
      );
  }
});

export { likeDislikePost, likeDislikeComment };
