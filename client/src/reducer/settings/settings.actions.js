// redux/settings/settings.actions.js
import { setSetting } from "./settings.slice";
import { updateUserSettings, fetchUserSettings } from "./settings.thunk";

import * as serviceWorkerRegistration from "@/serviceWorkerRegistration";
import { updatePushSubscriptionStatus } from "@/serviceWorkerRegistration";

/**
 * Applies a user setting with optimistic UI update,
 * then syncs the change with the backend.
 * If the API call fails, it rolls back by refetching settings.
 *
 * @param {string} path - Dot notation path, e.g., "notifications.email"
 * @param {*} value - The new value to apply for the setting
 */
const applySettingChange = (path, value) => async (dispatch) => {
  // Update local state immediately
  dispatch(setSetting([path, value]));

  try {
    // Sync change with server
    await dispatch(updateUserSettings({ [path]: value })).unwrap();
  } catch (err) {
    console.error("Setting update failed. Rolling back:", err);
    // Rollback by refetching the entire settings from backend
    dispatch(fetchUserSettings());
  }
};

/**
 * Handles toggling push notification setting with
 * additional service worker registration logic.
 * Updates the push notification subscription status on the server,
 * then applies the setting change optimistically.
 *
 * @param {boolean} isEnabled - Whether push notifications should be enabled or disabled
 */
const applyPushNotificationSetting = (isEnabled) => async (dispatch) => {
  try {
    if (isEnabled) {
      // Try to activate push subscription on server
      const activated = await updatePushSubscriptionStatus("activate");

      // If activation fails, try to initialize service worker registration
      if (!activated) {
        const registration =
          await serviceWorkerRegistration.initializeServiceWorker();
        if (!registration) {
          console.error(
            "[Settings] Failed to enable notifications. Please check your browser settings."
          );
          return;
        }
      }

      // Optimistically update push notification setting in Redux store
      dispatch(applySettingChange("notifications.push", true));
    } else {
      // Deactivate push subscription on server
      const deactivated = await updatePushSubscriptionStatus("deactivate");

      if (!deactivated) {
        console.error("[Settings] Failed to disable notifications.");
        return;
      }

      // Optimistically update push notification setting in Redux store
      dispatch(applySettingChange("notifications.push", false));
    }
  } catch (error) {
    console.error(
      "[Settings] Notification settings update failed:",
      error.message
    );
  }
};

export { applySettingChange, applyPushNotificationSetting };
