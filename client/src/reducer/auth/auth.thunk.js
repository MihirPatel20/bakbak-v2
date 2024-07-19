import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "api";

// Async thunk for user registration
const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/register", userData);
      return response.data;
    } catch (error) {
      console.error("error: ", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for user login
const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/login", userData);
      return response.data;
    } catch (error) {
      console.error("error: ", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for refreshing access token
const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/refresh-token");
      return response.data;
    } catch (error) {
      console.error("error: ", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for verifying email
const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (verificationToken, { rejectWithValue }) => {
    try {
      const response = await api.get(`/verify-email/${verificationToken}`);
      return response.data;
    } catch (error) {
      console.error("error: ", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for requesting forgotten password
const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/forgot-password", { email });
      return response.data;
    } catch (error) {
      console.error("error: ", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for resetting forgotten password
const resetForgottenPassword = createAsyncThunk(
  "auth/resetForgottenPassword",
  async ({ resetPassToken, newPassword }, { rejectWithValue }) => {
    console.log("{ resetPassToken, newPassword }: ", {
      resetPassToken,
      newPassword,
    });
    try {
      const response = await api.post(
        `/users/reset-password/${resetPassToken}`,
        { newPassword }
      );
      return response.data;
    } catch (error) {
      console.error("error: ", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for logging out user
const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/logout");
      return response.data;
    } catch (error) {
      console.error("error: ", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for getting current user
const getUserProfile = createAsyncThunk(
  "auth/getUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/current-user");
      return response.data;
    } catch (error) {
      console.error("error: ", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for getting all users
const getAllUsers = createAsyncThunk(
  "auth/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/all-users");
      // console.log("response: ", response)
      return response.data.data;
    } catch (error) {
      console.error("error: ", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for updating user avatar
const updateUserAvatar = createAsyncThunk(
  "auth/updateUserAvatar",
  async (avatarFile, { rejectWithValue }) => {
    const formDataForAvatar = new FormData();
    formDataForAvatar.append("avatar", avatarFile);

    try {
      const response = await api.patch("/users/avatar", formDataForAvatar, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("error: ", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for resending email verification
const resendEmailVerification = createAsyncThunk(
  "auth/resendEmailVerification",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/resend-email-verification");
      return response.data;
    } catch (error) {
      console.error("error: ", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  verifyEmail,
  forgotPassword,
  resetForgottenPassword,
  logoutUser,
  getUserProfile,
  getAllUsers,
  updateUserAvatar,
  resendEmailVerification,
};
