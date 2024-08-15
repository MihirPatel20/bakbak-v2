import { asyncHandler } from "../utils/asyncHandler.js";
import { SocialPost } from "../models/post.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { postCommonAggregation } from "./post.controllers.js";
import { USER_ACTIVITY_TYPES } from "../constants.js";

/**
 * Fetches and returns posts for the explore page, prioritizing both activity and recency.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Returns a JSON response with the posts.
 *
 * @throws {Error} - Throws an error if aggregation or pagination fails.
 */
const exploreGrid = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const postAggregation = SocialPost.aggregate([
    ...postCommonAggregation(req), 

    {
      $addFields: {
        // Calculate the time factor in days since the post was created.
        timeFactor: {
          $divide: [
            { $subtract: [new Date(), "$createdAt"] }, // Time difference between now and post creation.
            1000 * 60 * 60 * 24, // Convert milliseconds to days.
          ],
        },

        // Calculate the initial activity score based on likes, comments, and bookmarks.
        activityScore: {
          $add: [
            { $multiply: ["$likes", 1] }, // Likes with a weight of 1.
            { $multiply: ["$comments", 2] }, // Comments with a weight of 2.
            { $multiply: [{ $size: { $ifNull: ["$bookmarks", []] } }, 3] }, // Bookmarks with a weight of 3.
          ],
        },
      },
    },

    {
      $addFields: {
        // Adjust the activity score by subtracting a fraction of the time factor.
        adjustedScore: {
          $subtract: [
            "$activityScore", // Base activity score.
            { $multiply: ["$timeFactor", 0.1] }, // Subtract a portion of time factor to account for recency.
          ],
        },
      },
    },

    // Sort posts by adjusted score in descending order, prioritizing high scores.
    {
      $sort: { adjustedScore: -1 },
    },
  ]);

  // Pagination options for fetching a specific page of posts.
  const options = {
    page: parseInt(page), // Convert page number to integer.
    limit: parseInt(limit), // Convert limit to integer.
    customLabels: {
      totalDocs: "totalPosts", // Custom label for total document count.
      docs: "posts", // Custom label for the array of posts.
    },
  };

  // Fetch and paginate the posts using the defined aggregation pipeline and options.
  const posts = await SocialPost.aggregatePaginate(postAggregation, options);

  // Send a successful response with the fetched posts and a status message.
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        posts,
        "Posts fetched successfully",
        USER_ACTIVITY_TYPES.RETRIEVE_DATA
      )
    );
});

export { exploreGrid };
