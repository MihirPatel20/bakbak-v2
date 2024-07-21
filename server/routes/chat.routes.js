import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  createOrGetAOneOnOneChat,
  deleteOneOnOneChat,
  getAllChats,
  getChatById,
  searchAvailableUsers,
} from "../controllers/chat.controllers.js";
import { validate } from "../validators/validate.js";
import { mongoIdPathVariableValidator } from "../validators/mongodb.validators.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getAllChats);

router.route("/users").get(searchAvailableUsers);

router
  .route("/c/:receiverId") // Create or get a one-on-one chat with a user
  .post(
    mongoIdPathVariableValidator("receiverId"),
    validate,
    createOrGetAOneOnOneChat
  );

router.get("/c/:chatId", getChatById); // Get a chat by ID

router
  .route("/remove/:chatId")
  .delete(mongoIdPathVariableValidator("chatId"), validate, deleteOneOnOneChat);

export default router;
