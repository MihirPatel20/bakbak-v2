import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { SocialPost } from "../models/post.models.js";
import { User } from "../models/user.models.js";
import { postCommonAggregation } from "./post.controllers.js";
import { profileCommonAggregation } from "./profile.controllers.js";
import { SocialProfile } from "../models/profile.models.js";

const globalSearch = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Query parameter is required"));
  }

  const queryString = query.trim().toLowerCase();

  // Fuzzy match for social profiles using aggregation
  const socialProfilesAggregation = [
    ...profileCommonAggregation(req),
    {
      $match: {
        $or: [
          { firstName: { $regex: `.*${queryString}.*`, $options: "i" } },
          { lastName: { $regex: `.*${queryString}.*`, $options: "i" } },
          { bio: { $regex: `.*${queryString}.*`, $options: "i" } },
          { location: { $regex: `.*${queryString}.*`, $options: "i" } },
          { countryCode: { $regex: `.*${queryString}.*`, $options: "i" } },
          { phoneNumber: { $regex: `.*${queryString}.*`, $options: "i" } },
          {
            "account.username": { $regex: `.*${queryString}.*`, $options: "i" },
          },
        ],
      },
    },
  ];

  const socialProfiles = await SocialProfile.aggregate(
    socialProfilesAggregation
  ).exec();

  // Fuzzy match for posts using aggregation
  const postAggregation = [
    ...postCommonAggregation(req),
    {
      $match: {
        $or: [
          { tags: { $regex: `.*${queryString}.*`, $options: "i" } },
          { content: { $regex: `.*${queryString}.*`, $options: "i" } },
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
        { socialProfiles, posts },
        "Search results fetched successfully"
      )
    );
});

const searchSuggestions = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Query parameter is required"));
  }

  const queryString = query.trim().toLowerCase();

  // Fuzzy match for social profiles using partial matches
  const socialProfiles = await SocialProfile.find({
    $or: [
      { firstName: { $regex: `.*${queryString}.*`, $options: "i" } },
      { lastName: { $regex: `.*${queryString}.*`, $options: "i" } },
      { bio: { $regex: `.*${queryString}.*`, $options: "i" } },
      { location: { $regex: `.*${queryString}.*`, $options: "i" } },
      { "account.username": { $regex: `.*${queryString}.*`, $options: "i" } },
    ],
  })
    .limit(5)
    .exec();

  // Search for posts and filter tags based on partial matches
  const posts = await SocialPost.find({
    $or: [
      { tags: { $regex: `.*${queryString}.*`, $options: "i" } },
      { content: { $regex: `.*${queryString}.*`, $options: "i" } },
    ],
  }).exec();

  // Extract and filter matching tags
  const filteredTags = posts
    .flatMap((post) => post.tags)
    .map((tag) => tag.toLowerCase())
    .filter((tag) => tag.includes(queryString));

  // Extract matching social profile details
  const profileStrings = socialProfiles
    .flatMap((profile) => [
      profile.firstName.toLowerCase(),
      profile.lastName.toLowerCase(),
      profile.bio.toLowerCase(),
      profile.location.toLowerCase(),
    ])
    .filter((str) => str.includes(queryString)) // Only keep strings that closely match
    .filter(Boolean); // Filter out empty values

  // Combine and remove duplicates
  let suggestions = Array.from(new Set([...profileStrings, ...filteredTags]));

  // Prioritize exact matches
  suggestions = suggestions.sort((a, b) => {
    if (a === queryString) return -1; // Exact match first
    if (b === queryString) return 1;
    if (a.startsWith(queryString) && !b.startsWith(queryString)) return -1; // Strings starting with query next
    if (!a.startsWith(queryString) && b.startsWith(queryString)) return 1;
    return a.indexOf(queryString) - b.indexOf(queryString); // Partial matches by index
  });

  // Limit to top 10 suggestions
  suggestions = suggestions.slice(0, 10);

  // Return suggestions
  return res
    .status(200)
    .json(
      new ApiResponse(200, suggestions, "Search suggestions fetched successfully")
    );
});


export { globalSearch, searchSuggestions };
