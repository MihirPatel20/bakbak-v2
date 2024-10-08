import mongoose from "mongoose";
import { USER_ACTIVITY_TYPES } from "../constants.js";
import { SocialBookmark } from "../models/bookmark.models.js";
import { SocialPost } from "../models/post.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { postCommonAggregation } from "./post.controllers.js";

const bookmarkUnBookmarkPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await SocialPost.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(postId),
      },
    },
    ...postCommonAggregation(req),
  ]);

  // Check for post existence
  if (!post[0]) {
    throw new ApiError(404, "Post does not exist");
  }

  // See if user has already bookmarked the post
  const isAlreadyBookmarked = await SocialBookmark.findOne({
    postId,
    bookmarkedBy: req.user?._id,
  });

  if (isAlreadyBookmarked) {
    // if already bookmarked, dislike it by removing the record from the DB
    await SocialBookmark.findOneAndDelete({
      postId,
      bookmarkedBy: req.user?._id,
    });

    post[0].isBookmarked = false;

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          post[0],
          "Bookmark removed successfully",
          USER_ACTIVITY_TYPES.UNBOOKMARK_POST
        )
      );
  } else {
    // if not bookmarked, like it by adding the record from the DB
    await SocialBookmark.create({
      postId,
      bookmarkedBy: req.user?._id,
    });

    post[0].isBookmarked = true;

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          post[0],
          "Bookmarked successfully",
          USER_ACTIVITY_TYPES.BOOKMARK_POST
        )
      );
  }
});

export { bookmarkUnBookmarkPost };
