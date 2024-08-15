import { Router } from "express";
import { globalSearch } from "../controllers/search.controller.js";

const router = Router();

/**
 * @route GET /search
 * @description Search for user profiles and posts
 * @access Public
 */
router.get("/", globalSearch);

export default router;
