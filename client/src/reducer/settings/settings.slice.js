// redux/settings/settings.slice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchUserSettings, updateUserSettings } from "./settings.thunk";

const initialState = {
  notifications: {
    push: false,
    email: true,
  },
  appearance: {
    theme: "light",
    fontSize: "medium",
  },
  interaction: {
    autoPlayVideos: false,
    showTypingIndicators: true,
  },
  visibility: {
    profile: "public",
  },
  meta: {
    _id: null,
    userId: null,
    language: "en",
    version: 1,
    createdAt: null,
    updatedAt: null,
    __v: 0,
  },
  isLoading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    // For optimistic updates
    setSetting: (state, action) => {
      const [path, value] = action.payload; // e.g., ['notifications.push', true]
      const keys = path.split(".");

      let current = state;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserSettings.fulfilled, (state, { payload }) => {
        const { meta, ...rest } = payload;

        return {
          ...state,
          ...rest,
          meta: { ...meta },
          isLoading: false,
          error: null,
        };
      })
      .addCase(fetchUserSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(updateUserSettings.fulfilled, (state, action) => {
        const { meta, ...updatedSettings } = action.payload;

        Object.entries(updatedSettings).forEach(
          ([sectionKey, sectionValue]) => {
            if (
              typeof sectionValue === "object" &&
              !Array.isArray(sectionValue)
            ) {
              state[sectionKey] = {
                ...state[sectionKey],
                ...sectionValue,
              };
            } else {
              state[sectionKey] = sectionValue;
            }
          }
        );

        state.meta = { ...meta };
      });
  },
});

export const { setSetting } = settingsSlice.actions;
export default settingsSlice.reducer;
