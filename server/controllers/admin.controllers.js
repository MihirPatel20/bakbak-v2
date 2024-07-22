import { Chat } from "../models/chat.models.js";
import { ChatMessage } from "../models/message.models.js";
import { User } from "../models/user.models.js";
import { Notification } from "../models/notification.model.js";
import { NotificationSubscription } from "../models/notificationSubscription.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { SocialPost } from "../models/post.models.js";
import { SocialComment } from "../models/comment.models.js";
import { SocialLike } from "../models/like.models.js";
import { postCommonAggregation } from "./post.controllers.js";

const getEnhancedStatistics = asyncHandler(async (req, res) => {
  // User Activity
  const activeUsers24h = await User.countDocuments({
    lastseen: { $gte: new Date(new Date() - 24 * 60 * 60 * 1000) },
  });
  const activeUsers7d = await User.countDocuments({
    lastseen: { $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) },
  });
  const activeUsers30d = await User.countDocuments({
    lastseen: { $gte: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) },
  });
  const newUsersDay = await User.countDocuments({
    createdAt: { $gte: new Date(new Date() - 24 * 60 * 60 * 1000) },
  });
  const newUsersWeek = await User.countDocuments({
    createdAt: { $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) },
  });
  const newUsersMonth = await User.countDocuments({
    createdAt: { $gte: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) },
  });

  // Content Metrics
  const totalPosts = await SocialPost.countDocuments({});
  const totalComments = await SocialComment.countDocuments({});
  const totalLikes = await SocialLike.countDocuments({});

  // Interaction Metrics
  const totalMessages = await ChatMessage.countDocuments({});
  const totalChatSessions = await Chat.countDocuments({});

  // Notification Metrics
  const pendingNotifications = await Notification.countDocuments({
    delivered: false,
  });
  const deliveredNotifications = await Notification.countDocuments({
    delivered: true,
  });

  // Engagement Metrics
  const dailyActiveUsers = await User.countDocuments({
    lastseen: { $gte: new Date(new Date() - 24 * 60 * 60 * 1000) },
  });
  const weeklyActiveUsers = await User.countDocuments({
    lastseen: { $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) },
  });

  // Subscription Metrics
  const activeSubscriptions = await NotificationSubscription.countDocuments({
    active: true,
  });
  const subscriptionGrowth = await NotificationSubscription.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // User Demographics
  const userRoles = await User.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } },
  ]);
  const userLocations = await User.aggregate([
    { $group: { _id: "$location", count: { $sum: 1 } } },
  ]);

  const totalUsers = await User.countDocuments({});
  const totalChats = await Chat.countDocuments({});

  const stats = {
    activeUsers24h,
    activeUsers7d,
    activeUsers30d,
    newUsersDay,
    newUsersWeek,
    newUsersMonth,

    totalChatSessions,
    pendingNotifications,
    deliveredNotifications,
    dailyActiveUsers,
    weeklyActiveUsers,
    activeSubscriptions,
    subscriptionGrowth,
    userRoles,

    totalPosts,
    totalComments,
    totalLikes,
    totalMessages,
    totalUsers,
    totalChats,
    userLocations,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, stats, "Enhanced statistics retrieved successfully")
    );
});

const getTopPosts = asyncHandler(async (req, res) => {
  const topPosts = await SocialPost.aggregate([
    ...postCommonAggregation(req),
    { $sort: { likes: -1 } }, // Sort by the number of likes in descending order
    { $limit: 10 }, // Limit the results to the top 10 posts
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, topPosts, "Top posts retrieved successfully"));
});

const getAllUserDetails = asyncHandler(async (req, res) => {
  const { page = 1, limit = 5, search = "" } = req.query;

  const query = {
    $or: [
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { role: { $regex: search, $options: "i" } },
    ],
  };

  const users = await User.find(query)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const totalUsers = await User.countDocuments(query);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { users, totalUsers },
        "Users retrieved successfully"
      )
    );
});

const getStatistics = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({});
  const totalChats = await Chat.countDocuments({});
  const stats = { totalUsers, totalChats };
  return res
    .status(200)
    .json(new ApiResponse(200, stats, "Statistics retrieved successfully"));
});

const changeUserRole = asyncHandler(async (req, res) => {
  const { userId, newRole } = req.body;

  // Validate newRole
  if (!AvailableUserRoles.includes(newRole)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid role specified"));
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  user.role = newRole;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User role updated successfully"));
});

const deleteAllChats = asyncHandler(async (req, res) => {
  // Delete all chat documents from the database
  await Chat.deleteMany({});
  await ChatMessage.deleteMany({});

  return res
    .status(200)
    .json(
      new ApiResponse(200, null, "All chats and messages deleted successfully")
    );
});

// Add the new functions for deleting notifications and notification subscriptions
const deleteAllNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({});

  return res
    .status(200)
    .json(new ApiResponse(200, null, "All notifications deleted successfully"));
});

const deleteAllNotificationSubscriptions = asyncHandler(async (req, res) => {
  await NotificationSubscription.deleteMany({});

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "All notification subscriptions deleted successfully"
      )
    );
});

export {
  deleteAllChats,
  deleteAllNotifications,
  deleteAllNotificationSubscriptions,
  getAllUserDetails,
  getStatistics,
  getTopPosts,
  changeUserRole,
  getEnhancedStatistics,
};
