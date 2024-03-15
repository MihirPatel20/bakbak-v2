import { Grid, Typography } from "@mui/material";
import api from "api";
import React, { useEffect, useState } from "react";
import * as serviceWorkerRegistration from "@/serviceWorkerRegistration";

const NotificationView = () => {
  const [subscriptions, setSubscriptions] = useState([]); // Add this line

  const getAllSubscriptions = async () => {
    try {
      const response = await api.get("/notification");
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
      title: "You received a new message!",
      body: "Mihir has sent you a new message!",
      icon: "icons/bakbak.ico",
      badge: "icons/bakbak.ico",
      // image: "/post1.jpg",
      actions: [
        { action: "open", title: "Open App" },
        { action: "dismiss", title: "Dismiss" },
      ],
      timestamp: Date.now(),
      data: { id: 123, type: "notification" },
    };

    try {
      const response = await api.post(
        `${
          import.meta.env.VITE_SERVER_API_URI
        }/notification/send-push/${recipientId}`,
        options
      );
      const data = await response;
      console.log("Notification sent:", data);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  return (
    <div>
      <h1>React Chat Application</h1>
      {/* Your chat application components */}

      {subscriptions.length !== 0 ? (
        <Grid container>
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
              onClick={() => sendNotification(subscription.user)}
            >
              <Typography variant="body1">
                User ID: {subscription?.user}
              </Typography>
            </Grid>
          ))}
        </Grid>
      ) : (
        <p>No subscriptions found</p>
      )}
    </div>
  );
};

export default NotificationView;
