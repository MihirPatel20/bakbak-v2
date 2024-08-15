import { Router } from "express";
import {
  globalSearch,
  searchSuggestions,
} from "../controllers/search.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

/**
 * @route GET /search
 * @description Search for user profiles and posts
 * @access private
 */
router.use(verifyJWT);

router.get("/", globalSearch);
router.get("/suggestions", searchSuggestions);

export default router;
