// store.js
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/auth.slice.js";
import snackbarReducer from "./snackbar/snackbar.slice.js";
import userFeedReducer from "./userFeed/userFeed.slice.js";
import notificationsReducer from "./notification/notification.slice.js";
import sidebarReducer from "./customization/customizationReducer.js";
import errorSnackbarMiddleware from "./middleware/errorHandler.js";
import settingsReducer from "./settings/settings.slice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    snackbar: snackbarReducer,
    userFeed: userFeedReducer,
    notifications: notificationsReducer,
    customization: sidebarReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(errorSnackbarMiddleware),
});

export default store;
