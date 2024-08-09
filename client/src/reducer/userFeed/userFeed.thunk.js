import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "api";

/**
 * @description Fetch user feed with pagination.
 * @param {Object} params - The parameters for fetching the user feed.
 * @param {number} params.page - The current page number for pagination.
 * @param {number} params.limit - The number of items per page.
 */
export const fetchUserFeed = createAsyncThunk(
  "userFeed/fetchUserFeed",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get("/post/feed", { params });
      console.log("response: ", response);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Like a post
export const likePost = createAsyncThunk(
  "userFeed/likePost",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/like/post/${postId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Bookmark a post
export const bookmarkPost = createAsyncThunk(
  "userFeed/bookmarkPost",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await api.post(`bookmark/post/${postId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Comment on a post
export const commentOnPost = createAsyncThunk(
  "userFeed/commentOnPost",
  async ({ postId, comment }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/posts/${postId}/comment`, { comment });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
