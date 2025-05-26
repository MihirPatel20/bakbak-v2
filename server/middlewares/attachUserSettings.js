import settingsService from "../services/settingsService.js";

const attachUserSettings = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId)
      return res.status(401).json({ error: "User not authenticated" });

    const settings = await settingsService.getUserSettings(userId);
    req.userSettings = settings;
    next();
  } catch (err) {
    console.error("Settings middleware error:", err);
    next(err);
  }
};

export default attachUserSettings;
