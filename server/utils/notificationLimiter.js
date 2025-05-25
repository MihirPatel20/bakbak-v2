// utils/notificationLimiter.js

const likeNotifCache = new Map(); // Key: `${userId}:${targetId}`

export const shouldSendLikeNotification = (userId, targetId, ttl = 10) => {
  const key = `${userId}:${targetId}`;
  const now = Date.now();

  if (likeNotifCache.has(key)) {
    const lastTime = likeNotifCache.get(key);
    if (now - lastTime < ttl * 1000) return false; // Within TTL, skip
  }

  likeNotifCache.set(key, now);
  setTimeout(() => likeNotifCache.delete(key), ttl * 1000); // Auto-expire

  return true;
};

// use redis in the future
// chatGPT prompt for future reference:
// I want to implement a notification limiter that prevents sending multiple notifications for the same action within a certain time frame.
// can you help me implement it will redis? i have no experience using it and dont have in my project. you will have to help me make baby steps.
