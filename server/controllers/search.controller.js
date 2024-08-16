import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { SocialPost } from "../models/post.models.js";
import { SocialProfile } from "../models/profile.models.js";
import { postCommonAggregation } from "./post.controllers.js";
import { profileCommonAggregation } from "./profile.controllers.js";

/**
 * Creates a weighted search pipeline for aggregations.
 *
 * @param {Array} fields - The fields to search.
 * @param {String} queryString - The query string for searching.
 * @returns {Array} - The weighted search pipeline.
 */
const createWeightedSearchPipeline = (fields, queryString) => {
  const weights = {
    firstName: 7,
    lastName: 6,
    "account.username": 5,
    tags: 4, // This will be handled conditionally
    content: 3,
    bio: 2,
    location: 1,
  };

  return fields.map((field) => ({
    $cond: [
      {
        $regexMatch: { input: `$${field}`, regex: queryString, options: "i" },
      },
      weights[field] || 1,
      0,
    ],
  }));
};

/**
 * Aggregates search results with relevance scoring.
 *
 * @param {Object} req - The request object.
 * @param {String} queryString - The query string for searching.
 * @param {Function} aggregationPipelineFn - Function to get the aggregation pipeline.
 * @param {Object} model - The Mongoose model to perform aggregation on.
 * @returns {Array} - The aggregated results.
 */
const aggregateSearchResults = async (
  req,
  queryString,
  aggregationPipelineFn,
  model
) => {
  const isPostModel = model === SocialPost;

  const aggregationPipeline = [
    ...aggregationPipelineFn(req),
    {
      $addFields: {
        relevanceScore: {
          $sum: createWeightedSearchPipeline(
            isPostModel
              ? ["content"]
              : [
                  "firstName",
                  "lastName",
                  "account.username",
                  "bio",
                  "location",
                ],
            queryString
          ),
        },
      },
    },
    ...(isPostModel
      ? [
          {
            $addFields: {
              relevanceScore: {
                $sum: [
                  {
                    $cond: [
                      { $gt: [{ $size: { $ifNull: ["$tags", []] } }, 0] },
                      {
                        $multiply: [
                          4, // Weight for tags
                          {
                            $size: {
                              $filter: {
                                input: "$tags",
                                as: "tag",
                                cond: {
                                  $regexMatch: {
                                    input: "$$tag",
                                    regex: queryString,
                                    options: "i",
                                  },
                                },
                              },
                            },
                          },
                        ],
                      },
                      0,
                    ],
                  },
                ],
              },
            },
          },
        ]
      : []),
    { $match: { relevanceScore: { $gt: 0 } } },
    { $sort: { relevanceScore: -1 } },
    ...(isPostModel ? [{ $limit: 5 }] : []),
  ];

  return model.aggregate(aggregationPipeline).exec();
};

/**
 * Global search across social profiles and posts with priority-based scoring.
 *
 * Currently matches individual words:
 * @example
 * - "nat" returns results like: "natural", "agnate", "nation", "nationalism", "natal"
 * - "tan" returns results like: "tangent", "tanning", "tantrum", "cantankerous", "santander"
 *
 * Future implementation suggestions:
 * - Enhance the search to handle multiple words in a query:
 *   - "tech trends" should return results that match either "tech" or "trends":
 *   -> "tech savvy", "technology", "latest trends", "trendsetters", "tech news"
 *
 * - Consider fuzzy matching and substring matching to improve search accuracy and flexibility.
 */

const globalSearch = asyncHandler(async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Query parameter is required"));
  }

  const queryString = query.trim().toLowerCase();

  const [socialProfiles, posts] = await Promise.all([
    aggregateSearchResults(
      req,
      queryString,
      profileCommonAggregation,
      SocialProfile
    ),
    aggregateSearchResults(req, queryString, postCommonAggregation, SocialPost),
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { socialProfiles, posts },
        "Search results fetched successfully"
      )
    );
});

/**
 * Fetches search suggestions with priority-based relevance scoring.
 *
 */
const searchSuggestions = asyncHandler(async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Query parameter is required"));
  }

  const queryString = query.trim().toLowerCase();

  const [socialProfiles, posts] = await Promise.all([
    aggregateSearchResults(
      req,
      queryString,
      profileCommonAggregation,
      SocialProfile
    ),
    aggregateSearchResults(req, queryString, postCommonAggregation, SocialPost),
  ]);

  const matchingTags = posts
    .flatMap((post) => post.tags || [])
    .filter((tag) => tag.toLowerCase().includes(queryString));

  const profileStrings = socialProfiles
    .flatMap((profile) => [
      profile.firstName.toLowerCase(),
      profile.lastName.toLowerCase(),
      profile.bio.toLowerCase(),
      profile.location.toLowerCase(),
    ])
    .filter((str) => str.includes(queryString))
    .filter(Boolean);

  let suggestions = Array.from(new Set([...profileStrings, ...matchingTags]));

  suggestions = suggestions
    .sort((a, b) => {
      if (a === queryString) return -1;
      if (b === queryString) return 1;
      if (a.startsWith(queryString) && !b.startsWith(queryString)) return -1;
      if (!a.startsWith(queryString) && b.startsWith(queryString)) return 1;
      return a.indexOf(queryString) - b.indexOf(queryString);
    })
    .slice(0, 10);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        suggestions,
        "Search suggestions fetched successfully"
      )
    );
});

export { globalSearch, searchSuggestions };
