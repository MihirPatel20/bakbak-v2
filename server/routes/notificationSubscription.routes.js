import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  getAllSubscriptions,
  saveNotificationSubscription,
  sendPushNotification,
} from "../controllers/notificationSubscription.controllers.js";

const router = Router();

router.route("/subscribe").post(verifyJWT, saveNotificationSubscription);
router.route("/send-push/:recipientId").post(verifyJWT, sendPushNotification);

router.route("/").get(getAllSubscriptions);
export default router;
