// ...imports remain mostly same
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
// material-ui
import {
  Typography,
  Box,
  Grid,
  Container,
  TextField,
  Divider,
  List,
} from "@mui/material";
import api from "api";
import AdsComponent from "@/adsense";
import { markAsRead } from "reducer/notification/notification.thunk";
import NotificationList from "layout/MainLayout/Header/NotificationSection/NotificationList";
import { NotificationTypes } from "constants";

const readStatusOptions = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
];

const typeOptions = [
  { value: "all", label: "All Types" },
  { value: NotificationTypes.MESSAGE, label: "Messages" },
  { value: NotificationTypes.LIKE_POST, label: "Likes" },
  { value: NotificationTypes.COMMENT, label: "Comments" },
  { value: NotificationTypes.FOLLOW_REQUEST, label: "Follows" },
  { value: NotificationTypes.MENTIONS, label: "Mentions" },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "mostFrequent", label: "Most Frequent" },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const [readStatus, setReadStatus] = useState("all");
  const [notifType, setNotifType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const fetchNotificationsData = useCallback(async () => {
    setIsLoading(true);

    const params = {
      page: 1,
      limit: 10,
      sortBy,
      readStatus,
    };

    if (notifType !== "all") params.type = notifType;

    try {
      const response = await api.get("/notifications", { params });
      setNotifications(response.data.data.notifications);
    } catch (error) {
      console.log("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [readStatus, notifType, sortBy]);

  useEffect(() => {
    fetchNotificationsData();
  }, [fetchNotificationsData]);

  const handleMarkAsRead = (e, notificationId) => {
    e.stopPropagation();
    dispatch(markAsRead(notificationId));
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "16px",
          textAlign: "center",
          margin: "16px 0",
        }}
      >
        <Typography variant="h6">Place To show Google AdSense</Typography>
        <AdsComponent dataAdSlot="8429412170" />
      </Box>

      <Typography variant="h3" sx={{ mb: 2 }}>
        Notifications
      </Typography>

      <Grid container spacing={{ sm: 1, xs: 2 }}>
        {[
          {
            label: "Read Status",
            value: readStatus,
            onChange: setReadStatus,
            options: readStatusOptions,
          },
          {
            label: "Type",
            value: notifType,
            onChange: setNotifType,
            options: typeOptions,
          },
          {
            label: "Sort By",
            value: sortBy,
            onChange: setSortBy,
            options: sortOptions,
          },
        ].map(({ label, value, onChange, options }) => (
          <Grid item sm={4} xs={12} key={label}>
            <TextField
              select
              size="small"
              fullWidth
              label={label}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              SelectProps={{ native: true }}
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </TextField>
          </Grid>
        ))}
      </Grid>

      {isLoading ? (
        <Typography sx={{ mt: 3 }}>Loading...</Typography>
      ) : notifications.length === 0 ? (
        <Typography sx={{ mt: 3 }}>
          You're all caught up! No new notifications.
        </Typography>
      ) : (
        <List
          sx={{
            width: "100%",
            py: 0,
            borderRadius: "10px",
            "& .MuiListItemSecondaryAction-root": { top: 22 },
            "& .MuiDivider-root": { my: 0 },
            "& .list-container": { pl: 5 },
          }}
        >
          {notifications.map((notif, i) => (
            <React.Fragment key={notif._id || i}>
              <NotificationList notification={notif} />
              {i < notifications.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Container>
  );
};

export default Notifications;
