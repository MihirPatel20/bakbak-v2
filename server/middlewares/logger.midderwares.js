// middleware.js
import { response } from "express";
import { activityLogger, errorLogger } from "../logger.js";

// Middleware for logging API calls
const activityLoggerMiddleware = (req, res, next) => {
  const startTime = Date.now();

  // Capture the original res.json function
  const originalJson = res.json;

  // Override res.json method
  res.json = function (body) {
    // Restore original json function
    res.json = originalJson;

    // Capture response body
    const responseBody = body;

    // Call the original json function
    res.json(body);

    // Log after response is sent
    const { user, method, originalUrl, body: requestBody } = req;
    const { statusCode } = res;

    if (method === "GET") return;

    activityLogger.info(responseBody?.message || "", {
      timestamp: new Date().toISOString(),
      userActivityType: responseBody.userActivityType,
      user: user ? user._id : "anonymous",
      endpoint: originalUrl,
      method: method,
      // requestBody: requestBody,
      // responseData: responseBody.data,
      responseStatus: statusCode,
      responseSuccess: responseBody.success,
      responseTime: `${Date.now() - startTime}ms`,
    });
  };

  next();
};

// Middleware for logging errors
const errorLoggerMiddleware = (err, req, res, next) => {
  const { user, method, originalUrl, body } = req;
  const statusCode = res.statusCode || 500;

  errorLogger.error({
    timestamp: new Date().toISOString(),
    user: user ? user._id : "anonymous",
    endpoint: originalUrl,
    method: method,
    requestBody: body,
    responseStatus: statusCode,
    error: err.message,
    stack: err.stack,
  });

  next(err);
};

export { activityLoggerMiddleware, errorLoggerMiddleware };
