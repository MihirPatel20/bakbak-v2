// admin.routes.js

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  changeUserRole,
  deleteAllChats,
  getAllUserDetails,
  getEnhancedStatistics,
  getTopPosts,
  testAdminApi,
} from "../controllers/admin.controllers.js";
const router = Router();

router.use(verifyJWT);
router.route("/users").get(getAllUserDetails);
router.route("/stats").get(getEnhancedStatistics);
router.route("/top-posts").get(getTopPosts);

router.route("/chats").delete(deleteAllChats);
router.route("/users/role").put(changeUserRole);

router.route("/test").get(testAdminApi);

export default router;
