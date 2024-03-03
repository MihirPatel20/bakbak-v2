import { isRejected } from "@reduxjs/toolkit";
import { showSnackbar } from "reducer/snackbar/snackbar.slice";

const errorSnackbarMiddleware =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    if (isRejected(action) && action?.error?.message)
      dispatch(showSnackbar("error", action?.error?.message));

    return next(action);
  };

export default errorSnackbarMiddleware;
