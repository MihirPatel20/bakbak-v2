// controllers/settingsController.js
import settingsService from "../services/settingsService.js";

const getSettings = async (req, res) => {
  console.log("Fetching user settings for:", req.user._id);
  try {
    const userId = req.user._id;
    const settings = await settingsService.getUserSettings(userId);
    res.json(settings);
  } catch (err) {
    console.error("Get settings error:", err);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
};

const updateSettings = async (req, res) => {
  try {
    const userId = req.user._id;
    const newSettings = req.body; // expect flat object like { "notifications.push": true }

    const updatedSettings = await settingsService.updateMultipleSettings(
      userId,
      newSettings
    );
    res.json({ success: true, settings: updatedSettings });
  } catch (err) {
    console.error("Update settings error:", err);
    res.status(500).json({ error: "Failed to update settings" });
  }
};

export { getSettings, updateSettings };
