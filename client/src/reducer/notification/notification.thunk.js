import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "api";

// Async thunk for fetching notifications
const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async ({ isRead = "all", page = 1, limit = 10 }) => {
    try {
      // Construct the query string based on parameters
      const query = `?isRead=${isRead}&page=${page}&limit=${limit}`;
      const response = await api.get(`/notifications${query}`);

      console.log("response", response.data.data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
);

export default fetchNotifications;

// Async thunk for marking a notification as read
const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async ({ notificationId, chatId }) => {
    try {
      const query = notificationId
        ? `notificationId=${notificationId}`
        : `chatId=${chatId}`;

      const response = await api.patch(`/notifications/mark-as-read?${query}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
);

const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async () => {
    try {
      const response = await api.patch("/notifications/mark-all-as-read");
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
);

export { fetchNotifications, markAsRead, markAllAsRead };
