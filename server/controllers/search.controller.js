import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { SocialPost } from "../models/post.models.js";
import { User } from "../models/user.models.js";
import { postCommonAggregation } from "./post.controllers.js";

/**
 * Searches for user profiles and posts based on the search query.
 *
 * @param {Object} req - The request object containing the search query.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Returns a JSON response with search results.
 *
 * @throws {Error} - Throws an error if search fails.
 */
const globalSearch = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Query parameter is required"));
  }

  const queryString = query.trim();

  // Search for user profiles
  const userProfiles = await User.find({
    $or: [
      { username: { $regex: queryString, $options: "i" } },
      { email: { $regex: queryString, $options: "i" } },
    ],
  }).exec();

  // Search for posts using aggregation
  const postAggregation = [
    ...postCommonAggregation(req),
    {
      $match: {
        $or: [
          { tags: { $in: [queryString] } },
          { content: { $regex: queryString, $options: "i" } },
        ],
      },
    },
  ];

  const posts = await SocialPost.aggregate(postAggregation).exec();

  // Combine results and return
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { userProfiles, posts },
        "Search results fetched successfully"
      )
    );
});

export { globalSearch };
