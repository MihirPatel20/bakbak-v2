// services/settingsService.js
import UserSettings from "../models/settings.models.js";

const transformSettingsResponse = (settingsDoc) => {
  if (!settingsDoc) return null;
  const settings = settingsDoc.toObject();

  // Move userId and timestamps into meta for frontend
  settings.meta = {
    ...settings.meta,
    userId: settings.userId,
    createdAt: settings.createdAt,
    updatedAt: settings.updatedAt,
    version: settings.version,
    // remove userId from top-level to avoid duplication
  };
  delete settings.userId;
  delete settings.createdAt;
  delete settings.updatedAt;
  delete settings.version;

  return settings;
};

const getUserSettings = async (userId) => {
  let settings = await UserSettings.findOne({ userId });
  if (!settings) {
    settings = await UserSettings.create({ userId }); // creates with default values
  }
  return transformSettingsResponse(settings);
};

const updateUserSetting = async (userId, keyPath, value) => {
  const result = await UserSettings.updateOne(
    { userId },
    { $set: { [keyPath]: value } }
  );
  // Optionally return updated doc again
  const updatedSettings = await UserSettings.findOne({ userId });
  return transformSettingsResponse(updatedSettings);
};

const updateMultipleSettings = async (userId, settingsObj) => {
  const result = await UserSettings.updateOne(
    { userId },
    { $set: settingsObj }
  );
  const updatedSettings = await UserSettings.findOne({ userId });
  return transformSettingsResponse(updatedSettings);
};

export default {
  getUserSettings,
  updateUserSetting,
  updateMultipleSettings,
};
