// notification.routes.js

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../controllers/notification.controllers.js";

const router = Router();

router.route("/").get(verifyJWT, getNotifications);
router.route("/mark-as-read").patch(verifyJWT, markNotificationAsRead);
router.route("/mark-all-as-read").patch(verifyJWT, markAllNotificationsAsRead);

export default router;
