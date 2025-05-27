import mongoose from "mongoose";
import { User } from "../models/user.models.js";
import { SocialFollow } from "../models/follow.models.js";
import { SocialProfile } from "../models/profile.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getMongoosePaginationOptions } from "../utils/helpers.js";
import {
  NotificationTypes,
  ReferenceModel,
  USER_ACTIVITY_TYPES,
} from "../constants.js";
import { createNotification } from "./notification.controllers.js";
import { sendPushNotification } from "./notificationSubscription.controllers.js";
import { shouldSendNotification } from "../utils/notificationLimiter.js";
import { profileCommonAggregation } from "./profile.controllers.js";

const followUnFollowUser = asyncHandler(async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

  // Fetch the user who is about to be followed/unfollowed
  const targetUser = await User.findById(targetUserId);
  if (!targetUser) {
    throw new ApiError(404, "User does not exist");
  }

  // Prevent users from following themselves
  if (targetUserId.toString() === userId.toString()) {
    throw new ApiError(422, "You cannot follow yourself");
  }

  // Check if the current user is already following the target user
  const isAlreadyFollowing = await SocialFollow.findOne({
    followerId: userId,
    followeeId: targetUser._id,
  });

  if (isAlreadyFollowing) {
    // Unfollow: remove the follow entry from DB
    await SocialFollow.findOneAndDelete({
      followerId: userId,
      followeeId: targetUser._id,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { following: false },
          "Removed from following.",
          USER_ACTIVITY_TYPES.UNFOLLOW_USER
        )
      );
  } else {
    // Follow: create a new follow entry
    const followEntry = await SocialFollow.create({
      followerId: userId,
      followeeId: targetUser._id,
    });

    // Send notification + push if valid
    if (
      targetUserId.toString() !== userId.toString() &&
      shouldSendNotification(
        NotificationTypes.FOLLOW_REQUEST,
        userId.toString(),
        targetUserId.toString()
      )
    ) {
      // In-app notification
      await createNotification(
        req,
        targetUserId, // Receiver
        req.user, // Actor
        "started following you", // Preview
        NotificationTypes.FOLLOW_REQUEST,
        followEntry._id,
        ReferenceModel.FOLLOW_REQUEST //SocialFollow
      );

      // Push notification
      const senderName = req.user.username || "Someone";
      const pushOptions = {
        title: `${senderName} followed you!`,
        body: "Check out their profile.",
        icon: "icons/bakbak.ico",
        badge: "icons/bakbak.ico",
        tag: "follow",
        data: { url: `/profile/${userId}` },
      };

      await sendPushNotification(targetUserId, pushOptions);
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { following: true },
          "Added to following",
          USER_ACTIVITY_TYPES.FOLLOW_USER
        )
      );
  }
});

const getFollowersListByUserName = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // Step 1: Get the user
  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // Step 2: Get IDs of all followers
  const followerDocs = await SocialFollow.find({
    followeeId: user._id,
  }).select("followerId");

  const followerIds = followerDocs.map((doc) => doc.followerId);

  // Step 3: Use profileCommonAggregation on those followers
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    customLabels: {
      totalDocs: "totalFollowers",
      docs: "followers",
    },
  };

  const followers = await SocialProfile.aggregatePaginate(
    SocialProfile.aggregate([
      { $match: { owner: { $in: followerIds } } },
      ...profileCommonAggregation(req),
    ]),
    options
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          _id: user._id,
          username: user.username,
        },
        ...followers,
      },
      "Followers list fetched successfully",
      USER_ACTIVITY_TYPES.RETRIEVE_DATA
    )
  );
});

const getFollowingListByUserName = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // Step 1: Find the user
  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // Step 2: Get IDs of users they are following
  const followingDocs = await SocialFollow.find({
    followerId: user._id,
  }).select("followeeId");

  const followeeIds = followingDocs.map((doc) => doc.followeeId);

  // Step 3: Apply profileCommonAggregation for those users
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    customLabels: {
      totalDocs: "totalFollowing",
      docs: "following",
    },
  };

  const profiles = await SocialProfile.aggregatePaginate(
    SocialProfile.aggregate([
      { $match: { owner: { $in: followeeIds } } },
      ...profileCommonAggregation(req),
    ]),
    options
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          _id: user._id,
          username: user.username,
        },
        ...profiles,
      },
      "Following list fetched successfully",
      USER_ACTIVITY_TYPES.RETRIEVE_DATA
    )
  );
});

export {
  followUnFollowUser,
  getFollowersListByUserName,
  getFollowingListByUserName,
};
