import mongoose from "mongoose";
import { SocialComment } from "../models/comment.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getMongoosePaginationOptions } from "../utils/helpers.js";
import { ApiError } from "../utils/ApiError.js";
import {
  NotificationTypes,
  ReferenceModel,
  USER_ACTIVITY_TYPES,
} from "../constants.js";
import { SocialPost } from "../models/post.models.js";
import { createNotification } from "./notification.controllers.js";
import { sendPushNotification } from "./notificationSubscription.controllers.js";

const getCommentAggregationPipeline = ({ userId, postId, commentId }) => {
  const matchStage = {};

  if (postId) {
    matchStage.postId = new mongoose.Types.ObjectId(postId);
  }

  if (commentId) {
    matchStage._id = new mongoose.Types.ObjectId(commentId);
  }

  const pipeline = [
    {
      $match: matchStage,
    },
    {
      $lookup: {
        from: "sociallikes",
        localField: "_id",
        foreignField: "commentId",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "sociallikes",
        localField: "_id",
        foreignField: "commentId",
        as: "isLiked",
        pipeline: [
          {
            $match: {
              likedBy: new mongoose.Types.ObjectId(userId),
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "socialprofiles",
        localField: "author",
        foreignField: "owner",
        as: "author",
        pipeline: [
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
                    email: 1,
                    username: 1,
                  },
                },
              ],
            },
          },
          {
            $project: {
              firstName: 1,
              lastName: 1,
              account: 1,
            },
          },
          {
            $addFields: {
              account: { $first: "$account" },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        author: { $first: "$author" },
        likes: { $size: "$likes" },
        isLiked: {
          $cond: {
            if: { $gte: [{ $size: "$isLiked" }, 1] },
            then: true,
            else: false,
          },
        },
      },
    },
  ];

  return pipeline;
};

const addComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  const comment = await SocialComment.create({
    content,
    author: req.user?._id,
    postId,
  });

  const post = await SocialPost.findById(postId).select("author");

  if (post && post.author.toString() !== req.user._id.toString()) {
    await createNotification(
      req,
      post.author.toString(),
      req.user,
      content,
      NotificationTypes.COMMENT,
      postId,
      ReferenceModel.POST
    );

    await sendPushNotification(post.author.toString(), {
      title: `${req.user.username} commented on your post!`,
      body: content,
      icon: "icons/bakbak.ico",
      badge: "icons/bakbak.ico",
      tag: "comment",
      data: { url: `/social/post/${postId}` },
    });
  }

  const pipeline = getCommentAggregationPipeline({
    userId: req.user._id,
    commentId: comment._id,
  });

  const populatedComment = await SocialComment.aggregate(pipeline);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        populatedComment[0],
        "Comment added successfully",
        USER_ACTIVITY_TYPES.COMMENT_ON_POST
      )
    );
});

const getPostComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const pipeline = getCommentAggregationPipeline({
    userId: req.user._id,
    postId,
  });

  const comments = await SocialComment.aggregatePaginate(
    SocialComment.aggregate(pipeline),
    getMongoosePaginationOptions({
      page,
      limit,
      customLabels: {
        totalDocs: "totalComments",
        docs: "comments",
      },
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        comments,
        "Post comments fetched successfully",
        USER_ACTIVITY_TYPES.RETRIEVE_DATA
      )
    );
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const deletedComment = await SocialComment.findOneAndDelete({
    _id: new mongoose.Types.ObjectId(commentId),
    author: req.user?._id,
  });

  if (!deletedComment) {
    throw new ApiError(
      404,
      "Comment is already deleted or you are not authorized for this action."
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deletedComment },
        "Comment deleted successfully",
        USER_ACTIVITY_TYPES.DELETE_COMMENT
      )
    );
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  const updatedComment = await SocialComment.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(commentId),
      author: req.user?._id,
    },
    {
      $set: { content },
    },
    { new: true }
  );

  if (!updatedComment) {
    throw new ApiError(
      404,
      "Comment does not exist or you are not authorized for this action."
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedComment,
        "Comment updated successfully",
        USER_ACTIVITY_TYPES.UPDATE_COMMENT
      )
    );
});

export { addComment, getPostComments, deleteComment, updateComment };
