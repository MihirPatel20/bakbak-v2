// store.js
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/auth.slice.js";
import snackbarReducer from "./snackbar/snackbar.slice.js";
import errorSnackbarMiddleware from "./middleware/errorHandler.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    snackbar: snackbarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(errorSnackbarMiddleware),
});

export default store;
