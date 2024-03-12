import express from "express";
import cors from "cors";
import fs from "fs";
import { createServer } from "http";
import { Server } from "socket.io";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

app.set("io", io); // using set method to mount the `io` instance on the app to avoid usage of `global`

// global middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
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

// * App routes
import userRouter from "./routes/user.routes.js";
import profileRouter from "./routes/profile.routes.js";
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
app.use("/api/v1/users", userRouter);
app.use("/api/v1/profile", profileRouter);

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
import { getGeneratedCredentials, seedUsers } from "./seeds/user.seeds.js";
import { seedSocialMedia } from "./seeds/social-media.seeds.js";
import { dbInstance } from "./db/index.js";
import { DB_NAME } from "./constants.js";
import { ApiError } from "./utils/ApiError.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import path from "path";
import { seedChatApp } from "./seeds/chat-app.seeds.js";

app.post(
  "/api/v1/seed/social-media",
  avoidInProduction,
  seedUsers,
  seedSocialMedia
);
app.post("/api/v1/seed/chat-app", avoidInProduction, seedUsers, seedChatApp);

// ! 🚫 Danger Zone
app.delete("/api/v1/reset-db", avoidInProduction, async (req, res) => {
  if (dbInstance) {
    // Drop the whole DB
    await dbInstance.connection.db.dropDatabase({
      dbName: DB_NAME,
    });

    const directory = "./public/images";

    // Remove all product images from the file system
    fs.readdir(directory, (err, files) => {
      if (err) {
        // fail silently
        console.log("Error while removing the images: ", err);
      } else {
        for (const file of files) {
          if (file === ".gitkeep") continue;
          fs.unlink(path.join(directory, file), (err) => {
            if (err) throw err;
          });
        }
      }
    });
    // remove the seeded users if exist
    fs.unlink("./public/temp/seed-credentials.json", (err) => {
      // fail silently
      if (err) console.log("Seed credentials are missing.");
    });
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Database dropped successfully"));
  }
  throw new ApiError(500, "Something went wrong while dropping the database");
});

// common error handling middleware
app.use(errorHandler);

export default httpServer;
