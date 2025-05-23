import mongoose from "mongoose";
import {
  ChatEventEnum,
  NotificationTypes,
  ReferenceModel,
  USER_ACTIVITY_TYPES,
} from "../constants.js";
import { User } from "../models/user.models.js";
import { Chat } from "../models/chat.models.js";
import { ChatMessage } from "../models/message.models.js";
import { emitSocketEvent, isUserInChatRoom } from "../socket.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getLocalPath, getStaticFilePath } from "../utils/helpers.js";
import { createNotification } from "./notification.controllers.js";
import { sendPushNotification } from "./notificationSubscription.controllers.js";

/**
 * @description Utility function which returns the pipeline stages to structure the chat message schema with common lookups
 * @returns {mongoose.PipelineStage[]}
 */
const chatMessageCommonAggregation = () => {
  return [
    {
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
  ];
};

// needs improvement with infinite scroll
// currently fetching all messages at once
// which is not a good practice
const getAllMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { page = 1, limit = 1000 } = req.query; // Get page and limit from query parameters, with defaults

  const selectedChat = await Chat.findById(chatId);

  if (!selectedChat) {
    throw new ApiError(404, "Chat does not exist");
  }

  // Only send messages if the logged in user is a part of the chat he is requesting messages of
  if (!selectedChat.participants?.includes(req.user?._id)) {
    throw new ApiError(400, "User is not a part of this chat");
  }

  const messageAggregation = ChatMessage.aggregate([
    {
      $match: {
        chat: new mongoose.Types.ObjectId(chatId),
      },
    },
    ...chatMessageCommonAggregation(),
    {
      $sort: {
        createdAt: 1,
      },
    },
  ]);

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    customLabels: {
      totalDocs: "totalMessages",
      docs: "messages",
    },
  };

  const messages = await ChatMessage.aggregatePaginate(
    messageAggregation,
    options
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        messages || [],
        "Messages fetched successfully",
        USER_ACTIVITY_TYPES.RETRIEVE_DATA
      )
    );
});

const sendMessage = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { content } = req.body;

  if (!content && !req.files?.attachments?.length) {
    throw new ApiError(400, "Message content or attachment is required");
  }

  const selectedChat = await Chat.findById(chatId);

  if (!selectedChat) {
    throw new ApiError(404, "Chat does not exist");
  }

  const messageFiles = [];

  if (req.files && req.files.attachments?.length > 0) {
    req.files.attachments?.map((attachment) => {
      messageFiles.push({
        url: getStaticFilePath(req, attachment.filename),
        localPath: getLocalPath(attachment.filename),
      });
    });
  }

  // Create a new message instance with appropriate metadata
  const message = await ChatMessage.create({
    sender: new mongoose.Types.ObjectId(req.user._id),
    content: content || "",
    chat: new mongoose.Types.ObjectId(chatId),
    attachments: messageFiles,
  });

  // update the chat's last message which could be utilized to show last message in the list item
  const chat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $set: {
        lastMessage: message._id,
      },
    },
    { new: true }
  );

  // structure the message
  const messages = await ChatMessage.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(message._id),
      },
    },
    ...chatMessageCommonAggregation(),
  ]);

  // Store the aggregation result
  const receivedMessage = messages[0];

  if (!receivedMessage) {
    throw new ApiError(500, "Internal server error");
  }

  // logic to emit socket event about the new message created to the other participants
  chat.participants.forEach(async (participantObjectId) => {
    // here the chat is the raw instance of the chat in which participants is the array of object ids of users
    // avoid emitting event to the user who is sending the message
    if (participantObjectId.toString() === req.user._id.toString()) return;

    // Check if the participant is online
    const participant = await User.findOne({ _id: participantObjectId });

    if (!participant) {
      throw new ApiError(404, "Recipient not found");
    }

    // Check if the participant is in the chat room
    const isParticipantInRoom = isUserInChatRoom(
      req,
      chatId,
      participantObjectId.toString()
    );

    if (isParticipantInRoom) {
      emitSocketEvent(
        req,
        participantObjectId.toString(),
        ChatEventEnum.MESSAGE_RECEIVED_EVENT,
        receivedMessage
      );
    } else {
      // Create notification in database and send to the recipient
      await createNotification(
        req,
        participantObjectId.toString(), //receiver id
        receivedMessage.sender, // sender id
        receivedMessage.content, //preview
        NotificationTypes.MESSAGE, //type
        chatId, //referenceId
        ReferenceModel.CHAT // referenceModel
      );

      // Find the subscription for the participant
      const options = {
        title: `${receivedMessage.sender.username} sent a message!`,
        body: `${receivedMessage.content}`,
        icon: "icons/bakbak.ico",
        badge: "icons/bakbak.ico",
        tag: "message",
        data: { url: `/messages/direct/u/${chat._id}` },
      };

      await sendPushNotification(participantObjectId, options);
    }
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        receivedMessage,
        "Message saved successfully",
        USER_ACTIVITY_TYPES.SEND_MESSAGE
      )
    );
});

export { getAllMessages, sendMessage };
