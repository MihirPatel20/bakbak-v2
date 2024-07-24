import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  getAllSubscriptions,
  subscribeNotifications,
  sendPushNotification,
  unsubscribeNotifications,
  updatePushSubscriptionStatus,
} from "../controllers/notificationSubscription.controllers.js";

const router = Router();

router.route("/").get(getAllSubscriptions);

router.route("/subscribe").post(verifyJWT, subscribeNotifications);
router.route("/unsubscribe").post(verifyJWT, unsubscribeNotifications);

// router.route("/send-push/:recipientId").post(verifyJWT, sendPushNotification);

router.route("/:status").post(verifyJWT, updatePushSubscriptionStatus);

export default router;
