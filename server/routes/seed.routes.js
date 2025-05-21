import { Router } from "express";
import {
  avoidInProduction,
  verifyJWT,
} from "../middlewares/auth.middlewares.js";
import { seedChatMessages } from "../seeds/message.seeds.js";
import { seedUsers } from "../seeds/user.seeds.js";
import { seedSocialMedia } from "../seeds/social-media.seeds.js";
import { seedChatApp } from "../seeds/chat-app.seeds.js";

const router = Router();

router.use(verifyJWT);

router.post(
  "/social-media",
  avoidInProduction,
  seedUsers,
  seedSocialMedia
);
router.post("/chat-app", avoidInProduction, seedUsers, seedChatApp);
router.post("/chat-messages/:chatId", avoidInProduction, seedChatMessages);

export default router;
