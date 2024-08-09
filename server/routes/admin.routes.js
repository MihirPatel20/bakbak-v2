// admin.routes.js

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  changeUserRole,
  deleteAllChats,
  downloadLogFile,
  getAllUserDetails,
  getEnhancedStatistics,
  getTopPosts,
  testAdminApi,
} from "../controllers/admin.controllers.js";
import {
  getUserActivityChart,
  handleGenerateLogs,
} from "../controllers/admin.test.controllers.js";
const router = Router();

router.use(verifyJWT);
router.route("/users").get(getAllUserDetails);
router.route("/stats").get(getEnhancedStatistics);
router.route("/top-posts").get(getTopPosts);

router.route("/chats").delete(deleteAllChats);
router.route("/users/role").put(changeUserRole);

router.route("/test").get(testAdminApi);
router.get("/download-log", downloadLogFile);
router.get("/get-user-activity", getUserActivityChart);
router.post("/generate-logs", handleGenerateLogs);

export default router;
