import { createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  verifyEmail,
  forgotPassword,
  resetForgottenPassword,
  logoutUser,
  getUserProfile,
  updateUserAvatar,
  resendEmailVerification,
} from "./auth.thunk";

const initialState = {
  user: null, // Store user data here
  token: null, // Store the JWT token here
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
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Login User
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        // console.log("login payload: ", action.payload.data.user);
        state.isLoading = false;
        // state.user = action.payload.data.user;
        state.token = action.payload.data.accessToken;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        // console.log("thunk action: ", action)
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Refresh Access Token
      .addCase(refreshAccessToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.data.token;
        state.error = null;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.isLoading = false;
        // Additional handling for successful email verification if needed
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        // Additional handling for successful forgot password request if needed
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Reset Forgotten Password
      .addCase(resetForgottenPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetForgottenPassword.fulfilled, (state) => {
        state.isLoading = false;
        // Additional handling for successful password reset if needed
      })
      .addCase(resetForgottenPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Logout User
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Get Current User
      .addCase(getUserProfile.fulfilled, (state, action) => {
        // console.log("get user payload: ", action.payload);
        state.user = action.payload.data;
      })

      // Update User Avatar
      .addCase(updateUserAvatar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserAvatar.fulfilled, (state) => {
        state.isLoading = false;
        // Additional handling for successful avatar update if needed
      })
      .addCase(updateUserAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Resend Email Verification
      .addCase(resendEmailVerification.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendEmailVerification.fulfilled, (state) => {
        state.isLoading = false;
        // Additional handling for successful email verification resend if needed
      })
      .addCase(resendEmailVerification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { setUserProfile } = authSlice.actions;

export default authSlice.reducer;
