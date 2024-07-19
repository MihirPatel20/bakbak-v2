import { createSlice } from "@reduxjs/toolkit";
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
} from "./notification.thunk";

const initialState = {
  notifications: [],
  isLoading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications = [action.payload, ...state.notifications];
      state.totalCount += 1;
    },
    updateNotification: (state, action) => {
      const updatedNotification = action.payload;
      const index = state.notifications.findIndex(
        (notification) => notification._id === updatedNotification._id
      );
      if (index !== -1) {
        state.notifications[index] = updatedNotification;
      }
    },
    deleteNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification._id !== action.payload
      );
      state.totalCount -= 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload.notifications;
        state.totalCount = action.payload.totalCount;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.error = null;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const { id } = action.payload;
        const index = state.notifications.findIndex(
          (notification) => notification._id === id
        );
        if (index !== -1) {
          state.notifications[index].isRead = true;
          state.totalCount -= 1;
        }
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.filter(
          (notification) => notification.type !== "message"
        );
        state.notifications.forEach(
          (notification) => (notification.isRead = true)
        );
        state.totalCount = 0;
      });
  },
});

export const { addNotification, updateNotification, deleteNotification } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
