import { SocialBookmark } from "../models/bookmark.models.js";
import { SocialPost } from "../models/post.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const bookmarkUnBookmarkPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await SocialPost.findById(postId);

  // Check for post existence
  if (!post) {
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
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isBookmarked: false },
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
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isBookmarked: true },
          "Bookmarked successfully",
          USER_ACTIVITY_TYPES.BOOKMARK_POST
        )
      );
  }
});

export { bookmarkUnBookmarkPost };
