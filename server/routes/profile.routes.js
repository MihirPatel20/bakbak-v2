import { Router } from "express";
import {
  getAllUserProfiles,
  getMySocialProfile,
  getProfileByUserName,
  updateCoverImage,
  updateSocialProfile,
} from "../controllers/profile.controllers.js";
import {
  getLoggedInUserOrIgnore,
  verifyJWT,
} from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
import {
  getProfileByUserNameValidator,
  updateSocialProfileValidator,
} from "../validators/profile.validators.js";
import { validate } from "../validators/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();

// public route
router.route("/u/:username").get(
  getLoggedInUserOrIgnore, // hover over the middleware to know more
  getProfileByUserNameValidator(),
  validate,
  getProfileByUserName
);

router.use(verifyJWT);

router
  .route("/")
  .get(getMySocialProfile)
  .patch(updateSocialProfileValidator(), validate, updateSocialProfile);

// Protected routes - require authentication
router.route("/all").get(
  asyncHandler(async (req, res) => {
    const profiles = await getAllUserProfiles(req);
    return res
      .status(200)
      .json(
        new ApiResponse(200, profiles, "All user profiles fetched successfully")
      );
  })
);

router
  .route("/cover-image")
  .patch(upload.single("coverImage"), updateCoverImage);

export default router;
