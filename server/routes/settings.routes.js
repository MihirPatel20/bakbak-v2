// routes/settings.routes.js
import express from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/settingsController.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/", getSettings); // GET /settings
router.put("/", updateSettings); // PUT /settings (bulk)

export default router;
