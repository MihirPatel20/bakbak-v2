// Desc: This file contains the NotificationView component which is responsible for rendering the notification view in the application. This component is responsible for fetching notifications from the server and displaying them to the user. It also provides a button to mark a notification as read.
import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";

import api from "api";
import * as serviceWorkerRegistration from "@/serviceWorkerRegistration";

const NotificationView = () => {
  const [subscriptions, setSubscriptions] = useState([]);

  const getAllSubscriptions = async () => {
    try {
      const response = await api.get("/notificationSubscription");
      console.log("push subs: ", response.data);
      setSubscriptions(response.data); // Add this line
    } catch (error) {
      console.error("Error getting subscriptions:", error);
    }
  };

  useEffect(() => {
    serviceWorkerRegistration.registerSW();
    getAllSubscriptions();
  }, []);

  const sendNotification = async (recipientId) => {
    const options = {
      title: "Mihir sent a message!",
      body: "Hey There!",
      icon: "icons/bakbak.ico",
      badge: "icons/bakbak.ico",
      // image: "/post1.jpg",
      actions: [
        // { action: "open", title: "Open App" },
        { action: "dismiss", title: "Dismiss" },
        { action: "reply", title: "Reply" },
      ],
      timestamp: Date.now(),
      data: {
        notificationType: "message",
        messageId: "123456789",
        senderId: "66985afbfa693f72a35e1dec",
      },
      silent: false,
      tag: "message_group",
      ttl: 10,
    };

    try {
      const response = await api.post(
        `${
          import.meta.env.VITE_SERVER_API_URI
        }/notificationSubscription/send-push/${recipientId}`,
        options
      );
      const data = await response;
      console.log("Notification sent:", data);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  return (
    <Box>
      <h1>React Chat Application</h1>

      <Typography
        variant="body1"
        sx={{
          bgcolor: "primary.light",
          fontSize: "20px",
          fontWeight: "bold",
          color: "primary.main",
          p: 2,
        }}
      >
        Send Notification to
      </Typography>

      {subscriptions.length !== 0 ? (
        <Grid container gap={1} mt={1}>
          {subscriptions.map((subscription) => (
            <Grid
              item
              key={subscription._id}
              sx={{
                bgcolor: "primary.light",
                display: "flex",
                p: 1,
                cursor: "pointer",
              }}
              onClick={() => sendNotification(subscription.user._id)}
            >
              <Typography variant="body1" fontSize={16}>
                {subscription?.user.username}
              </Typography>
            </Grid>
          ))}
        </Grid>
      ) : (
        <p>No subscriptions found</p>
      )}
    </Box>
  );
};

export default NotificationView;
