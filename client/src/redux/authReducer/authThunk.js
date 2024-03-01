import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "api/api";

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  "users/register",
  async (userData) => {
    // console.log("userData: ", userData);
    try {
      // Send a POST request to your registration endpoint
      const response = await api.post("/users/register", userData);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "users/login",
  async (credentials) => {
    try {w
      // Send a POST request to your login endpoint with credentials included
      const response = await api.post("/users/login", credentials);
      console.log("response: ", response)
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk for getting user profile
export const getUserProfile = createAsyncThunk(
  "users/getUserProfile",
  async (_) => {
    try {
      const response = await api.get("/users/current-user");
      console.log("response: ", response)
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk for user logout
export const logoutUser = createAsyncThunk("users/logout", async () => {
  try {
    const response = await api.get("/users/logout");
    return response.data.data;
  } catch (error) {
    throw error;
  }
});