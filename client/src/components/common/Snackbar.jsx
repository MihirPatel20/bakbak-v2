import * as React from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { hideSnackbar } from "reducer/snackbar/snackbar.slice";
import { useDispatch, useSelector } from "react-redux";

export default function SnackbarAlert() {
  const dispatch = useDispatch();

  const { open, message, type } = useSelector((state) => state.snackbar);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(hideSnackbar());
  };

  return (
    <div>
      <Snackbar
        open={open}
        // autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert
          severity={type}
          variant="filled"
          sx={{ width: "100%" }}
          onClose={handleClose}
        >
          This is a success Alert inside a Snackbar!
        </Alert>
      </Snackbar>
    </div>
  );
}
