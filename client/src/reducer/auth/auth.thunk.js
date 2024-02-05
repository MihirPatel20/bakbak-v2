import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "api";

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData) => {
    try {
      const response = await api.post("/users/register", userData);
      return response.data;
    } catch (error) {
      console.log("error: ", error.response.data);
      throw error;
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData) => {
    try {
      const response = await api.post("/users/login", userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk for refreshing access token
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async () => {
    try {
      const response = await api.post("/users/refresh-token");
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk for verifying email
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (verificationToken) => {
    try {
      const response = await api.get(`/verify-email/${verificationToken}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk for requesting forgotten password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email) => {
    try {
      const response = await api.post("/users/forgot-password", { email });
      return response.data;
    } catch (error) {
      console.log("error: ", error.response.data);
      throw error;
    }
  }
);

// Async thunk for resetting forgotten password
export const resetForgottenPassword = createAsyncThunk(
  "auth/resetForgottenPassword",
  async ({ resetPassToken, newPassword }) => {
    console.log("{ resetPassToken, newPassword }: ", {
      resetPassToken,
      newPassword,
    });
    try {
      const response = await api.post(
        `/users/reset-password/${resetPassToken}`,
        {
          newPassword,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk for logging out user
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  try {
    const response = await api.post("/users/logout");
    return response.data;
  } catch (error) {
    throw error;
  }
});

// Async thunk for getting current user
export const getUserProfile = createAsyncThunk(
  "auth/getUserProfile",
  async () => {
    try {
      const response = await api.get("/users/current-user");
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk for updating user avatar
export const updateUserAvatar = createAsyncThunk(
  "auth/updateUserAvatar",
  async (avatarFile) => {
    const formDataForAvatar = new FormData();
    formDataForAvatar.append("avatar", avatarFile);

    try {
      const response = await api.patch("/users/avatar", formDataForAvatar, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk for resending email verification
export const resendEmailVerification = createAsyncThunk(
  "auth/resendEmailVerification",
  async () => {
    try {
      const response = await api.post("/users/resend-email-verification");
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);
