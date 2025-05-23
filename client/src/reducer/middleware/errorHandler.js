import { isRejected } from "@reduxjs/toolkit";
import { showSnackbar } from "reducer/snackbar/snackbar.slice";

const errorSnackbarMiddleware =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    if (isRejected(action)) {
      const message =
        action?.payload?.message ||
        action?.error?.message ||
        "Something went wrong. Please try again.";

      if (import.meta.env.DEV) {
        console.error("Redux error action:", action);
      }

      dispatch(showSnackbar("error", message));
    }

    return next(action);
  };

export default errorSnackbarMiddleware;
