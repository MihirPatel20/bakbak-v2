import { Box, Typography } from "@mui/material";
import api from "api";
import React, { useEffect, useState } from "react";
import { registerSW, requestNotificationPermission } from "utils/swUtils";

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
    const main = async () => {
      await requestNotificationPermission();
      await registerSW();
    };
    main();
    getAllSubscriptions();
  }, []);

  const sendNotification = async (recipientId) => {
    const options = {
      title: "You received a new message!",
      body: "Mihir has sent you a new message!",
      icon: "/bakbak.ico",
      badge: "/bakbak.ico",
      image: "/post1.jpg",
      actions: [
        { action: "open", title: "Open App" },
        { action: "dismiss", title: "Dismiss" },
      ],
      timestamp: Date.now(),
      data: { id: 123, type: "notification" },
    };

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_API_URI
        }/notification/send-push/${recipientId}`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(options),
          credentials: "include",
        }
      );
      const data = await response.json();
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
        <Box>
          {subscriptions.map((subscription) => (
            <Box
              key={subscription._id}
              sx={{
                bgcolor: "primary.light",
                display: "flex",
                p: 1,
                cursor: "pointer",
              }}
              onClick={() => {
                sendNotification(subscription.user);
              }}
            >
              <Typography variant="body1">
                User ID: {subscription?.user}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : (
        <p>No subscriptions found</p>
      )}

      <button onClick={sendNotification}>Send Notification</button>
    </div>
  );
};

export default NotificationView;
