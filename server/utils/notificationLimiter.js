// utils/notificationLimiter.js

const notifCache = new Map(); // Key: `${type}:${userId}:${targetId}`

export const shouldSendNotification = (type, userId, targetId, ttl = 10) => {
  const key = `${type}:${userId}:${targetId}`;
  const now = Date.now();

  if (notifCache.has(key)) {
    const lastTime = notifCache.get(key);
    if (now - lastTime < ttl * 1000) return false;
  }

  notifCache.set(key, now);
  setTimeout(() => notifCache.delete(key), ttl * 1000);

  return true;
};

// use redis in the future
// chatGPT prompt for future reference:
// I want to implement a notification limiter that prevents sending multiple notifications for the same action within a certain time frame.
// can you help me implement it will redis? i have no experience using it and dont have in my project. you will have to help me make baby steps.
