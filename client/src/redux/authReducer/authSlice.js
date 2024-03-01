import { createSlice } from "@reduxjs/toolkit";
import { getUserProfile, loginUser, logoutUser, registerUser } from "./authThunk";

const initialState = {
  user: null, // Store user data here
  accessToken: null, // Store the JWT accessToken here
  refreshToken: null, // Store the refreshToken here
  isLoading: false,
  error: null,
};

// Create an authentication slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Add reducers for handling user profile data here
    setUserProfile: (state, action) => {
      state.user = action.payload;
    },
    logoutUser,
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("action: ", action)
        state.isLoading = false;
        state.user = action?.payload?.data?.user;
        state.accessToken = action?.payload?.data?.accessToken;
        state.refreshToken = action?.payload?.data?.refreshToken;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.user = null;
        state.accessToken = null;
        state.error = null;
      });
  },
});

export default authSlice.reducer;
