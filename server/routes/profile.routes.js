import { Router } from "express";
import {
  getAllUserProfiles,
  getMySocialProfile,
  getProfileByUsername,
  updateCoverImage,
  updateSocialProfile,
} from "../controllers/profile.controllers.js";
import {
  getLoggedInUserOrIgnore,
  verifyJWT,
} from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
import {
  getProfileByUsernameValidator,
  updateSocialProfileValidator,
} from "../validators/profile.validators.js";
import { validate } from "../validators/validate.js";

const router = Router();

// public route
router.route("/u/:username").get(
  getLoggedInUserOrIgnore, // hover over the middleware to know more
  getProfileByUsernameValidator(),
  validate,
  getProfileByUsername
);

router.use(verifyJWT);

router
  .route("/")
  .get(getMySocialProfile)
  .patch(updateSocialProfileValidator(), validate, updateSocialProfile);

// Protected routes - require authentication
router.route("/all").get(getAllUserProfiles);

router
  .route("/cover-image")
  .patch(upload.single("coverImage"), updateCoverImage);

export default router;
