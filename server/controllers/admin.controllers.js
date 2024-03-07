import { Chat } from "../models/chat.models.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllUserDetails = asyncHandler(async (req, res) => {
  const users = await User.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users retrieved successfully"));
});

const getStatistics = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({});
  const totalChats = await Chat.countDocuments({});
  const stats = { totalUsers, totalChats };
  return res
    .status(200)
    .json(new ApiResponse(200, stats, "Statistics retrieved successfully"));
});

const deleteAllChats = asyncHandler(async (req, res) => {
  // Delete all chat documents from the database
  await Chat.deleteMany({});

  return res
    .status(200)
    .json(new ApiResponse(200, null, "All chats deleted successfully"));
});

export { deleteAllChats, getAllUserDetails, getStatistics };
