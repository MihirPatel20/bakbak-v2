import { isRejected } from "@reduxjs/toolkit";
import { showSnackbar } from "reducer/snackbar/snackbar.slice";

const errorSnackbarMiddleware =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    if (isRejected(action) && action?.payload?.message)
      dispatch(showSnackbar("error", action?.payload?.message));

    return next(action);
  };

export default errorSnackbarMiddleware;
