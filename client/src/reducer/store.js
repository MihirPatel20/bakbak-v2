// store.js
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/auth.slice.js";
import snackbarReducer from "./snackbar/snackbar.slice.js";
import notificationsReducer from "./notification/notification.slice.js";
import sidebarReducer from "./customization/customizationReducer.js";
import errorSnackbarMiddleware from "./middleware/errorHandler.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    snackbar: snackbarReducer,
    notifications: notificationsReducer,
    customization: sidebarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(errorSnackbarMiddleware),
});

export default store;
