import mongoose from "mongoose";
import { User } from "../models/user.models.js";
import { SocialProfile } from "../models/profile.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  getLocalPath,
  getStaticFilePath,
  removeLocalFile,
} from "../utils/helpers.js";
import { USER_ACTIVITY_TYPES } from "../constants.js";

export const profileCommonAggregation = (req, userId) => {
  const matchStage = userId
    ? { owner: new mongoose.Types.ObjectId(userId) }
    : {};

  return [
    { $match: matchStage },

    // Lookup user account details
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "account",
        pipeline: [
          {
            $project: {
              avatar: 1,
              username: 1,
              email: 1,
              isEmailVerified: 1,
            },
          },
        ],
      },
    },

    // Lookup follower/following stats
    {
      $lookup: {
        from: "socialfollows",
        let: { ownerId: "$owner" },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ["$followerId", "$$ownerId"] },
                  { $eq: ["$followeeId", "$$ownerId"] },
                ],
              },
            },
          },
          {
            $group: {
              _id: null,
              following: {
                $sum: { $cond: [{ $eq: ["$followerId", "$$ownerId"] }, 1, 0] },
              },
              followedBy: {
                $sum: { $cond: [{ $eq: ["$followeeId", "$$ownerId"] }, 1, 0] },
              },
            },
          },
        ],
        as: "followStats",
      },
    },

    // Lookup if current user is following this profile
    {
      $lookup: {
        from: "socialfollows",
        let: { ownerId: "$owner" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$followeeId", "$$ownerId"] },
                  { $eq: ["$followerId", req.user?._id] },
                ],
              },
            },
          },
        ],
        as: "isFollowingDoc",
      },
    },

    // 🔥 Lookup totalPosts count
    {
      $lookup: {
        from: "socialposts",
        let: { ownerId: "$owner" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$author", "$$ownerId"] },
            },
          },
          {
            $count: "totalPosts",
          },
        ],
        as: "postStats",
      },
    },

    // Add derived fields
    {
      $addFields: {
        account: { $arrayElemAt: ["$account", 0] },
        followersCount: { $arrayElemAt: ["$followStats.followedBy", 0] },
        followingCount: { $arrayElemAt: ["$followStats.following", 0] },
        isFollowing: { $gt: [{ $size: "$isFollowingDoc" }, 0] },
        totalPosts: {
          $ifNull: [{ $arrayElemAt: ["$postStats.totalPosts", 0] }, 0],
        },
      },
    },

    // Clean up unwanted stuff
    {
      $project: {
        followStats: 0,
        isFollowingDoc: 0,
        postStats: 0,
      },
    },
  ];
};

const getMySocialProfile = asyncHandler(async (req, res) => {
  const [profile] = await SocialProfile.aggregate(
    profileCommonAggregation(req, req.user._id)
  );

  if (!profile) {
    throw new ApiError(404, "User profile does not exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        profile,
        "User profile fetched successfully",
        USER_ACTIVITY_TYPES.RETRIEVE_DATA
      )
    );
});

const getAllUserProfiles = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    customLabels: {
      totalDocs: "totalProfiles",
      docs: "profiles",
    },
  };

  const profiles = await SocialProfile.aggregatePaginate(
    SocialProfile.aggregate(profileCommonAggregation(req)),
    options
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        profiles,
        "User profiles fetched successfully",
        USER_ACTIVITY_TYPES.RETRIEVE_DATA
      )
    );
});

const getProfileByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username }).lean();
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const [userProfile] = await SocialProfile.aggregate(
    profileCommonAggregation(req, user._id)
  );

  if (!userProfile) {
    throw new ApiError(404, "User profile does not exist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        userProfile,
        "User profile fetched successfully",
        USER_ACTIVITY_TYPES.RETRIEVE_DATA
      )
    );
});

const updateSocialProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phoneNumber, countryCode, bio, dob, location } =
    req.body;

  await SocialProfile.findOneAndUpdate(
    { owner: req.user._id },
    {
      $set: {
        firstName,
        lastName,
        phoneNumber,
        countryCode,
        bio,
        dob,
        location,
      },
    }
  );

  const [profile] = await SocialProfile.aggregate(
    profileCommonAggregation(req, req.user._id)
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        profile,
        "User profile updated successfully",
        USER_ACTIVITY_TYPES.EDIT_PROFILE
      )
    );
});

const updateCoverImage = asyncHandler(async (req, res) => {
  if (!req.file?.filename) {
    throw new ApiError(400, "Cover image is required");
  }
  const coverImageUrl = getStaticFilePath(req, req.file?.filename);
  const coverImageLocalPath = getLocalPath(req.file?.filename);

  const profile = await SocialProfile.findOne({ owner: req.user._id });

  await SocialProfile.findOneAndUpdate(
    { owner: req.user._id },
    {
      $set: {
        coverImage: {
          url: coverImageUrl,
          localPath: coverImageLocalPath,
        },
      },
    }
  );

  removeLocalFile(profile.coverImage.localPath);

  const [updatedProfile] = await SocialProfile.aggregate(
    profileCommonAggregation(req, req.user._id)
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedProfile,
        "Cover image updated successfully",
        USER_ACTIVITY_TYPES.EDIT_PROFILE_COVER
      )
    );
});

export {
  getMySocialProfile,
  getAllUserProfiles,
  getProfileByUsername,
  updateSocialProfile,
  updateCoverImage,
};
