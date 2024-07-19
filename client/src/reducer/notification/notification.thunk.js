import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "api";

// Async thunk for fetching notifications
const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async () => {
    try {
      const response = await api.get("/notifications");
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk for marking a notification as read
const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId) => {
    try {
      const response = await api.patch(`/notifications/${notificationId}/mark-as-read`);
      return response.data;
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
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export { fetchNotifications, markAsRead, markAllAsRead };
