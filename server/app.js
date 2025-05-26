import express from "express";
import cors from "cors";
import fs from "fs";
import { createServer } from "http";
import { Server } from "socket.io";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import webPush from "web-push";
import {
  activityLoggerMiddleware,
  errorLoggerMiddleware,
} from "./middlewares/logger.midderwares.js";

const app = express();
const httpServer = createServer(app);

// global middlewares
const allowedOrigins = [
  process.env.CORS_ORIGIN_1,
  process.env.CORS_ORIGIN_2,
  process.env.CORS_ORIGIN_3,
];

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

app.set("io", io); // using set method to mount the `io` instance on the app to avoid usage of `global`
app.set("trust proxy", true);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      // Add localhost origins dynamically
      const isLocalhost =
        origin.includes("localhost") || origin.includes("127.0.0.1");

      const allowedOrigins = [
        process.env.CORS_ORIGIN_1,
        process.env.CORS_ORIGIN_2,
        ...(isLocalhost ? [origin] : []), // dynamically allow current localhost origin
      ];

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Rate limiter to avoid misuse of the service and avoid cost spikes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: (req, res) => {
    return req.clientIp; // IP address from requestIp.mw(), as opposed to req.ip
  },
  handler: (_, __, ___, options) => {
    throw new ApiError(
      options.statusCode || 500,
      `There are too many requests. You are only allowed ${
        options.max
      } requests per ${options.windowMs / 60000} minutes`
    );
  },
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // configure static file to save images locally
app.use(cookieParser());
app.use(activityLoggerMiddleware);

// Initialize web-push with your VAPID keys
webPush.setVapidDetails(
  `mailto:${process.env.EMAIL_ADDRESS}`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// * App routes
import userRouter from "./routes/user.routes.js";
import profileRouter from "./routes/profile.routes.js";
import notificationSubscriptionRouter from "./routes/notificationSubscription.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import exploreRouter from "./routes/explore.routes.js";
import searchRouter from "./routes/search.routes.js";
import settingsRouter from "./routes/settings.routes.js";

import followRouter from "./routes/follow.routes.js";
import postRouter from "./routes/post.routes.js";
import bookmarkRouter from "./routes/bookmark.routes.js";
import likeRouter from "./routes/like.routes.js";
import commentRouter from "./routes/comment.routes.js";

import chatRouter from "./routes/chat.routes.js";
import adminRouter from "./routes/admin.routes.js";
import messageRouter from "./routes/message.routes.js";
import { errorHandler } from "./middlewares/error.middlewares.js";
import { initializeSocketIO } from "./socket.js";

// * App apis
app.get("/api/v1", (req, res) => {
  res.send("Welcome to the Social Media API");
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/notificationSubscription", notificationSubscriptionRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/explore", exploreRouter);
app.use("/api/v1/search", searchRouter);
app.use("/api/v1/settings", settingsRouter);

app.use("/api/v1/follow", followRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/bookmark", bookmarkRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v1/comment", commentRouter);

app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/messages", messageRouter);

app.use("/api/v1/admin", adminRouter);

initializeSocketIO(io);

// * Seeding handlers
import { avoidInProduction } from "./middlewares/auth.middlewares.js";
import seedRouter from "./routes/seed.routes.js";
import { dbInstance } from "./db/index.js";
import { DB_NAME } from "./constants.js";
import { ApiError } from "./utils/ApiError.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import path from "path";

app.use("/api/v1/seed", seedRouter);

// ---- 🚫 Danger Zone

// !!!!!!!!!!
import { cleanDirectory } from "./utils/cleanDirectory.js";
import { seedAdminUser } from "./seeds/user.seeds.js";
import { unlink } from "fs/promises";

app.delete("/api/v1/reset-db", avoidInProduction, async (req, res) => {
  try {
    if (dbInstance) {
      await dbInstance.connection.db.dropDatabase({ dbName: DB_NAME });

      // Clean image folder
      // await cleanDirectory("public/images");

      // Remove seed file if it exists
      try {
        await unlink("public/temp/seed-credentials.json");
      } catch {
        console.log("Seed credentials are missing.");
      }

      const result = await seedAdminUser();
      return res
        .status(200)
        .json(
          new ApiResponse(200, result.user, "DB dropped & admin user seeded")
        );
    }

    throw new ApiError(500, "Something went wrong while dropping the database");
  } catch (error) {
    console.error("DB reset failed:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to reset the database"));
  }
});

app.use(errorLoggerMiddleware);

// common error handling middleware
app.use(errorHandler);

export default httpServer;
