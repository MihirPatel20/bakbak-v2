// logInteraction.js
import logger from "./logger.js";

const logInteraction = (userId, interactionType, details) => {
  logger.info({
    timestamp: new Date().toISOString(),
    userId,
    interactionType,
    details,
  });
};

export default logInteraction;

//example use cases
export const login = (req, res) => {
  // ... login logic ...
  logInteraction(user.id, "AUTH_LOGIN", { method: "email", success: true });
};

export const logout = (req, res) => {
  // ... logout logic ...
  logInteraction(req.user.id, "AUTH_LOGOUT", {});
};

export const resetPassword = (req, res) => {
  // ... reset password logic ...
  logInteraction(user.id, "AUTH_RESET_PASSWORD", { method: "email" });
};

export const updateProfile = (req, res) => {
  // ... update profile logic ...
  logInteraction(req.user.id, "PROFILE_UPDATE", {
    updatedFields: ["name", "avatar"],
  });
};

// messages.js
export const sendMessage = (req, res) => {
  // ... send message logic ...
  logInteraction(req.user.id, "MESSAGE_SEND", {
    recipientId: req.body.recipientId,
  });
};

// posts.js
export const createPost = (req, res) => {
  // ... create post logic ...
  logInteraction(req.user.id, "POST_CREATE", { postId: newPost.id });
};

export const likePost = (req, res) => {
  // ... like post logic ...
  logInteraction(req.user.id, "POST_LIKE", { postId: req.params.postId });
};

// comments.js
export const addComment = (req, res) => {
  // ... add comment logic ...
  logInteraction(req.user.id, "COMMENT_ADD", {
    postId: req.params.postId,
    commentId: newComment.id,
  });
};

// notifications.js
export const sendNotification = (
  userId,
  notificationType,
  notificationDetails
) => {
  // ... send notification logic ...
  logInteraction(userId, "NOTIFICATION_RECEIVE", {
    type: notificationType,
    ...notificationDetails,
  });
};
zF;
