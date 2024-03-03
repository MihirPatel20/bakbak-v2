import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "api/api";

// Async thunk for user registration
const registerUser = createAsyncThunk(
  "users/registerUser",
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
const loginUser = createAsyncThunk("users/loginUser", async (userData) => {
  try {
    const response = await api.post("/users/login", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
});

// Async thunk for refreshing access token
const refreshAccessToken = createAsyncThunk(
  "users/refreshAccessToken",
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
const verifyEmail = createAsyncThunk(
  "users/verifyEmail",
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
const forgotPassword = createAsyncThunk(
  "users/forgotPassword",
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
const resetForgottenPassword = createAsyncThunk(
  "users/resetForgottenPassword",
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
const logoutUser = createAsyncThunk("users/logoutUser", async () => {
  try {
    const response = await api.post("/users/logout");
    return response.data;
  } catch (error) {
    throw error;
  }
});

// Async thunk for getting current user
const getUserProfile = createAsyncThunk("users/getUserProfile", async () => {
  try {
    const response = await api.get("/users/current-user");
    return response.data;
  } catch (error) {
    throw error;
  }
});

// Async thunk for getting user profile
const getAllUsers = createAsyncThunk("users/getAllUsers", async (_) => {
  try {
    const response = await api.get("/users/all-users");
    // console.log("response: ", response)
    return response.data.data;
  } catch (error) {
    throw error;
  }
});

// Async thunk for updating user avatar
const updateUserAvatar = createAsyncThunk(
  "users/updateUserAvatar",
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
const resendEmailVerification = createAsyncThunk(
  "users/resendEmailVerification",
  async () => {
    try {
      const response = await api.post("/users/resend-email-verification");
      return response.data;
    } catch (error) {
      throw error;
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