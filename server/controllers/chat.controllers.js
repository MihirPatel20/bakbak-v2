import mongoose from "mongoose";
import { ChatMessage } from "../models/message.models.js";
import { Chat } from "../models/chat.models.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { emitSocketEvent } from "../socket.js";
import { ChatEventEnum, USER_ACTIVITY_TYPES } from "../constants.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * @description Utility function which returns the pipeline stages to structure the chat schema with common lookups
 * @returns {mongoose.PipelineStage[]}
 */
const chatCommonAggregation = () => {
  return [
    {
      // lookup for the participants present
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "participants",
        as: "participants",
        pipeline: [
          {
            $project: {
              password: 0,
              refreshToken: 0,
              forgotPasswordToken: 0,
              forgotPasswordExpiry: 0,
              emailVerificationToken: 0,
              emailVerificationExpiry: 0,
            },
          },
        ],
      },
    },
    {
      // lookup for the group chats
      $lookup: {
        from: "chatmessages",
        foreignField: "_id",
        localField: "lastMessage",
        as: "lastMessage",
        pipeline: [
          {
            // get details of the sender
            $lookup: {
              from: "users",
              foreignField: "_id",
              localField: "sender",
              as: "sender",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    avatar: 1,
                    email: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              sender: { $first: "$sender" },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        lastMessage: { $first: "$lastMessage" },
      },
    },
  ];
};

const searchAvailableUsers = asyncHandler(async (req, res) => {
  const users = await User.aggregate([
    {
      $match: {
        _id: {
          $ne: req.user._id, // avoid logged in user
        },
      },
    },
    {
      $project: {
        avatar: 1,
        username: 1,
        email: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        users,
        "Users fetched successfully",
        USER_ACTIVITY_TYPES.RETRIEVE_DATA
      )
    );
});

const createOrGetAOneOnOneChat = asyncHandler(async (req, res) => {
  const { receiverId } = req.params;

  // Check if it's a valid receiver
  const receiver = await User.findById(receiverId);

  if (!receiver) {
    throw new ApiError(404, "Receiver does not exist");
  }

  // check if receiver is not the user who is requesting a chat
  if (receiver._id.toString() === req.user._id.toString()) {
    throw new ApiError(400, "You cannot chat with yourself");
  }

  const chat = await Chat.aggregate([
    {
      $match: {
        isGroupChat: false, // avoid group chats. This controller is responsible for one on one chats
        // Also, filter chats with participants having receiver and logged in user only
        $and: [
          {
            participants: { $elemMatch: { $eq: req.user._id } },
          },
          {
            participants: {
              $elemMatch: { $eq: new mongoose.Types.ObjectId(receiverId) },
            },
          },
        ],
      },
    },
    ...chatCommonAggregation(),
  ]);

  if (chat.length) {
    // if we find the chat that means user already has created a chat
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          chat[0],
          "Chat retrieved successfully",
          USER_ACTIVITY_TYPES.RETRIEVE_DATA
        )
      );
  }

  // if not we need to create a new one on one chat
  const newChatInstance = await Chat.create({
    name: "One on one chat",
    participants: [req.user._id, new mongoose.Types.ObjectId(receiverId)], // add receiver and logged in user as participants
    admin: req.user._id,
  });

  // structure the chat as per the common aggregation to keep the consistency
  const createdChat = await Chat.aggregate([
    {
      $match: {
        _id: newChatInstance._id,
      },
    },
    ...chatCommonAggregation(),
  ]);

  const payload = createdChat[0]; // store the aggregation result

  if (!payload) {
    throw new ApiError(500, "Internal server error");
  }

  // logic to emit socket event about the new chat added to the participants
  payload?.participants?.forEach((participant) => {
    // if (participant._id.toString() === req.user._id.toString()) return; // don't emit the event for the logged in use as he is the one who is initiating the chat

    // emit event to other participants with new chat as a payload
    emitSocketEvent(
      req,
      participant._id?.toString(),
      ChatEventEnum.NEW_CHAT_EVENT,
      payload
    );
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        payload,
        "Chat retrieved successfully",
        USER_ACTIVITY_TYPES.CREATE_CHAT
      )
    );
});

const deleteOneOnOneChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  // check for chat existence
  const chat = await Chat.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(chatId),
      },
    },
    ...chatCommonAggregation(),
  ]);

  const payload = chat[0];

  if (!payload) {
    throw new ApiError(404, "Chat does not exist");
  }

  // Delete the chat
  await Chat.findByIdAndDelete(chatId); // delete the chat even if the user is not admin because it's a personal chat

  // Delete all messages associated with this chat
  await ChatMessage.deleteMany({ chat: chatId });
  // delete all the messages and attachments associated with the chat
  // await deleteCascadeChatMessages(chatId);

  // Notify participants
  payload?.participants?.forEach((participant) => {
    // The below commented code is intended to prevent emitting an event to the user who is deleting the chat.
    // Currently, it's not required because we want to update the chat list of the user who is deleting the chat as well from the server.
    // We will uncomment it when we implement Redux in the frontend.
    // if (participant._id.toString() === req.user._id.toString()) return; // don't emit the event for the logged in use as he is the one who is initiating the chat

    // emit event to other participant with left chat as a payload
    emitSocketEvent(
      req,
      participant._id?.toString(),
      ChatEventEnum.LEAVE_CHAT_EVENT,
      payload
    );
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Chat deleted successfully",
        USER_ACTIVITY_TYPES.DELETE_CHAT
      )
    );
});

const getAllChats = asyncHandler(async (req, res) => {
  const chats = await Chat.aggregate([
    {
      $match: {
        participants: { $elemMatch: { $eq: req.user._id } }, // get all chats that have logged in user as a participant
      },
    },
    {
      $sort: {
        updatedAt: -1,
      },
    },
    ...chatCommonAggregation(),
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        chats || [],
        "User chats fetched successfully!",
        USER_ACTIVITY_TYPES.RETRIEVE_DATA
      )
    );
});

const getChatById = asyncHandler(async (req, res) => {
  const { chatId } = req.params; // Extract chatId from URL parameters

  // Attempt to find the chat by ID, ensuring the requesting user is a participant
  const chat = await Chat.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(chatId),
        participants: { $elemMatch: { $eq: req.user._id } }, // Ensure the user is a participant
      },
    },
    ...chatCommonAggregation(),
  ]);

  // If no chat is found, return a 404 error
  if (!chat || chat.length === 0) {
    return res.status(404).json(new ApiResponse(404, {}, "Chat not found"));
  }

  // Return the found chat
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        chat[0],
        "Chat fetched successfully",
        USER_ACTIVITY_TYPES.RETRIEVE_DATA
      )
    );
});

export {
  searchAvailableUsers,
  createOrGetAOneOnOneChat,
  deleteOneOnOneChat,
  getAllChats,
  getChatById,
};
