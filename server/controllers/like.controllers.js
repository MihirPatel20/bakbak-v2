import { USER_ACTIVITY_TYPES } from "../constants.js";
import { SocialComment } from "../models/comment.models.js";
import { SocialLike } from "../models/like.models.js";
import { SocialPost } from "../models/post.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const likeDislikePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await SocialPost.findById(postId);

  // Check for post existence
  if (!post) {
    throw new ApiError(404, "Post does not exist");
  }

  // See if user has already liked the post
  const isAlreadyLiked = await SocialLike.findOne({
    postId,
    likedBy: req.user?._id,
  });

  if (isAlreadyLiked) {
    // if already liked, dislike it by removing the record from the DB
    await SocialLike.findOneAndDelete({
      postId,
      likedBy: req.user?._id,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { postId, isLiked: false },
          "Unliked successfully",
          USER_ACTIVITY_TYPES.UNLIKE_POST
        )
      );
  } else {
    // if not liked, like it by adding the record from the DB
    await SocialLike.create({
      postId,
      likedBy: req.user?._id,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { postId, isLiked: true },
          "Liked successfully",
          USER_ACTIVITY_TYPES.LIKE_POST
        )
      );
  }
});

const likeDislikeComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await SocialComment.findById(commentId);

  // Check for comment existence
  if (!comment) {
    throw new ApiError(404, "Comment does not exist");
  }

  // See if user has already liked the comment
  const isAlreadyLiked = await SocialLike.findOne({
    commentId,
    likedBy: req.user?._id,
  });

  if (isAlreadyLiked) {
    // if already liked, dislike it by removing the record from the DB
    await SocialLike.findOneAndDelete({
      commentId,
      likedBy: req.user?._id,
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
    // if not liked, like it by adding the record from the DB
    await SocialLike.create({
      commentId,
      likedBy: req.user?._id,
    });
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
