// admin.routes.js

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  deleteAllChats,
  getAllUserDetails,
  getStatistics,
} from "../controllers/admin.controllers.js";
const router = Router();

router.use(verifyJWT);
router.route("/users").get(getAllUserDetails);
router.route("/stats").get(getStatistics);

router.route("/chats").delete(deleteAllChats);

export default router;
