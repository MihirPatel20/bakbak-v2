// redux/settings/settings.thunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "api";

// Fetch all user settings
const fetchUserSettings = createAsyncThunk(
  "settings/fetchUserSettings",
  async () => {
    const response = await api.get("/settings");
    return response.data;
  }
);

// Bulk update settings (expects flat object like { "notifications.push": true })
const updateUserSettings = createAsyncThunk(
  "settings/updateUserSettings",
  async (settingsObj) => {
    const response = await api.put("/settings", settingsObj);
    return response.data;
  }
);

export { fetchUserSettings, updateUserSettings };
