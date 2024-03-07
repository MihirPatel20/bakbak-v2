// snackbarSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  message: "",
  type: "success",
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    setSnackbar: (state, action) => {
      state.open = action.payload.open;
      state.message = action.payload.message || "";
      state.type = action.payload.type || "success";
    },
  },
});

export const { setSnackbar } = snackbarSlice.actions;

// Action creators
export const showSnackbar = (type, message) => (dispatch) => {
  dispatch(setSnackbar({ open: true, type, message }));
};

export const hideSnackbar = () => (dispatch, getState) => {
  const prevState = getState().snackbar;
  dispatch(setSnackbar({ ...prevState, open: false }));
};

export default snackbarSlice.reducer;
