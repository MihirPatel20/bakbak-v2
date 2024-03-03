// store.js
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/auth.slice.js";
import snackbarReducer from "./snackbar/snackbar.slice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    // snackbar: snackbarReducer,
  },
});

export default store;
