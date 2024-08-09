/**
 * @type {{ ADMIN: "ADMIN"; USER: "USER"} as const}
 */
export const UserRolesEnum = {
  ADMIN: "ADMIN",
  USER: "USER",
};

export const AvailableUserRoles = Object.values(UserRolesEnum);

/**
 * @type {{ PENDING: "PENDING"; CANCELLED: "CANCELLED"; DELIVERED: "DELIVERED" } as const}
 */
export const OrderStatusEnum = {
  PENDING: "PENDING",
  CANCELLED: "CANCELLED",
  DELIVERED: "DELIVERED",
};

export const AvailableOrderStatuses = Object.values(OrderStatusEnum);

/**
 * @type {{ UNKNOWN:"UNKNOWN"; RAZORPAY: "RAZORPAY"; PAYPAL: "PAYPAL"; } as const}
 */
export const PaymentProviderEnum = {
  UNKNOWN: "UNKNOWN",
  RAZORPAY: "RAZORPAY",
  PAYPAL: "PAYPAL",
};

export const AvailablePaymentProviders = Object.values(PaymentProviderEnum);

/**
 * @type {{ FLAT:"FLAT"; } as const}
 */
export const CouponTypeEnum = {
  FLAT: "FLAT",
  // PERCENTAGE: "PERCENTAGE",
};

export const AvailableCouponTypes = Object.values(CouponTypeEnum);

/**
 * @type {{ GOOGLE: "GOOGLE"; GITHUB: "GITHUB"; EMAIL_PASSWORD: "EMAIL_PASSWORD"} as const}
 */
export const UserLoginType = {
  GOOGLE: "GOOGLE",
  GITHUB: "GITHUB",
  EMAIL_PASSWORD: "EMAIL_PASSWORD",
};

export const AvailableSocialLogins = Object.values(UserLoginType);

/**
 * @type {{ MOST_VIEWED: "mostViewed"; MOST_LIKED: "mostLiked"; LATEST: "latest"; OLDEST: "oldest"} as const}
 */
export const YouTubeFilterEnum = {
  MOST_VIEWED: "mostViewed",
  MOST_LIKED: "mostLiked",
  LATEST: "latest",
  OLDEST: "oldest",
};

export const AvailableYouTubeFilters = Object.values(YouTubeFilterEnum);

export const USER_TEMPORARY_TOKEN_EXPIRY = 20 * 60 * 1000; // 20 minutes

export const MAXIMUM_SUB_IMAGE_COUNT = 4;
export const MAXIMUM_SOCIAL_POST_IMAGE_COUNT = 6;

export const DB_NAME = "bakbak";

export const paypalBaseUrl = {
  sandbox: "https://api-m.sandbox.paypal.com",
};

/**
 * @description set of events that we are using in chat app. more to be added as we develop the chat app
 */
export const ChatEventEnum = Object.freeze({
  // ? once user is ready to go
  CONNECTED_EVENT: "connected",
  // ? when user gets disconnected
  DISCONNECT_EVENT: "disconnect",
  // ? when user joins a socket room
  JOIN_CHAT_EVENT: "joinChat",
  // ? when participant gets removed from group, chat gets deleted or leaves a group
  LEAVE_CHAT_EVENT: "leaveChat",
  // ? when admin updates a group name
  UPDATE_GROUP_NAME_EVENT: "updateGroupName",
  // ? when user sends a message
  SEND_MESSAGE_EVENT: "sendMessage",
  // ? when new message is received
  MESSAGE_RECEIVED_EVENT: "messageReceived",
  // ? when there is new one on one chat, new group chat or user gets added in the group
  NEW_CHAT_EVENT: "newChat",
  // ? when there is an error in socket
  SOCKET_ERROR_EVENT: "socketError",
  // ? when participant stops typing
  STOP_TYPING_EVENT: "stopTyping",
  // ? when participant starts typing
  TYPING_EVENT: "typing",
  // ? when user comes online
  USER_ONLINE_EVENT: "userOnline",
  // ? when user goes offline
  USER_OFFLINE_EVENT: "userOffline",
  // Combined event for both sending and receiving notifications
  NOTIFICATION_EVENT: "notification",
  // ? when the notification is updated
  NOTIFICATION_UPDATE_EVENT: "notificationUpdate",
});

export const NotificationTypes = Object.freeze({
  MESSAGE: "message",
  MESSAGE_LIKE: "message_like",
  POST_LIKE: "post_like",
  POST_COMMENT: "post_comment",
  COMMENT_LIKE: "comment_like",
  PING: "ping",
  FOLLOW_REQUEST: "follow_request",
});

export const ReferenceModel = Object.freeze({
  MESSAGE: "ChatMessage",
  message_like: "ChatMessage",
  post_like: "SocialLike",
  post_comment: "SocialComment",
  comment_like: "SocialLike",
  ping: "ChatMessage",
  follow_request: "SocialFollow",
});

export const USER_ACTIVITY_TYPES = Object.freeze({
  USER_REGISTRATION: "user_registration",
  USER_LOGIN: "user_login",
  USER_LOGOUT: "user_logout",
  EMAIL_VERIFICATION: "email_verification",

  RETRIEVE_DATA: "retrieve_data",

  CREATE_POST: "create_post",
  DELETE_POST: "delete_post",
  UPDATE_POST: "update_post",
  LIKE_POST: "like_post",
  UNLIKE_POST: "unlike_post",
  COMMENT_ON_POST: "comment_on_post",
  LIKE_COMMENT: "like_comment",
  UNLIKE_COMMENT: "unlike_comment",
  DELETE_COMMENT: "delete_comment",
  UPDATE_COMMENT: "update_comment",
  BOOKMARK_POST: "bookmark_post",
  UNBOOKMARK_POST: "unbookmark_post",
  
  CREATE_CHAT: "create_chat",
  DELETE_CHAT: "delete_chat",
  SEND_MESSAGE: "send_message",
  
  EDIT_PROFILE: "edit_profile",
  EDIT_PROFILE_PICTURE: "edit_profile_picture",
  EDIT_PROFILE_COVER: "edit_profile_cover",

  FORGOT_PASSWORD_REQUEST: "forgot_password_request",
  FORGOT_PASSWORD_EMAIL_SENT: "forgot_password_email_sent",
  RESET_PASSWORD: "reset_password",
  CHANGE_PASSWORD: "change_password",

  ACTIVATE_PUSH_SUBSCRIPTION: "activate_push_subscription",
  DEACTIVATE_PUSH_SUBSCRIPTION: "deactivate_push_subscription",

  FOLLOW_USER: "follow_user",
  UNFOLLOW_USER: "unfollow_user",

  SYSTEM_CRASH: "system_crash",
  API_FAILURE: "api_failure",
  CLIENT_ERROR: "client_error",
  SYSTEM_ERROR: "system_error",
  START_SESSION: "start_session",
  SESSION_END: "session_end",

  SEND_NOTIFICATION: "send_notification",
  RETRIEVE_NOTIFICATIONS: "retrieve_notifications",
  READ_NOTIFICATION: "read_notification",
  CLICK_NOTIFICATION: "click_notification",
  NOTIFICATION_IGNORED: "notification_ignored",

  SUBSCRIBE_TO_NOTIFICATIONS: "subscribe_to_notifications",
  UNSUBSCRIBE_FROM_NOTIFICATIONS: "unsubscribe_from_notifications",
  SEND_PUSH_NOTIFICATION: "send_push_notification",

  TESTING_API: "testing_api",
});

export const AvailableChatEvents = Object.values(ChatEventEnum);
