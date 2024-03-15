import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  getAllSubscriptions,
  subscribeNotifications,
  sendPushNotification,
} from "../controllers/notificationSubscription.controllers.js";

const router = Router();

router.route("/subscribe").post(verifyJWT, subscribeNotifications);
router.route("/send-push/:recipientId").post(verifyJWT, sendPushNotification);

router.route("/").get(getAllSubscriptions);
export default router;
