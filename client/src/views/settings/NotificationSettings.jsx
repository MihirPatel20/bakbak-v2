import React, { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Switch,
  Divider,
} from "@mui/material";
import Header from "./Header";

const NotificationsDetail = ({ onBack }) => {
  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: false,
    emailNotifications: false,
  });

  const dummySettings = {
    pushNotifications: true,
    emailNotifications: false,
  };

  // Replace your useEffect and handleSettingChange with these versions:
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        setNotificationSettings(dummySettings);
      } catch (error) {
        console.error("Failed to fetch notification settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const handleSettingChange = async (type, value) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Update local state
      setNotificationSettings((prev) => ({
        ...prev,
        [type]: value,
      }));

      // Log the change (for testing)
      console.log(`Setting ${type} changed to:`, value);
    } catch (error) {
      console.error("Failed to update notification settings:", error);
    }
  };

  const SettingItem = ({ label, checked, onChange }) => (
    <>
      <ListItemButton
        disableRipple
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        onClick={() => onChange(!checked)}
      >
        <ListItemText primary={label} />
        <Switch
          edge="end"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          onClick={(e) => e.stopPropagation()} // prevent parent click
        />
      </ListItemButton>
      <Divider />
    </>
  );

  return (
    <Box sx={{ p: 2, height: "100%", boxSizing: "border-box" }}>
      <Header title="Notification Settings" onBack={onBack} />

      {/* Negative margin is used to visually align the list items with the header */}
      <List sx={{ mt: -2 }}>
        <SettingItem
          label="Push Notifications"
          checked={notificationSettings.pushNotifications}
          onChange={(val) => handleSettingChange("pushNotifications", val)}
        />

        <SettingItem
          label="Email Notifications"
          checked={notificationSettings.emailNotifications}
          onChange={(val) => handleSettingChange("emailNotifications", val)}
        />
      </List>
    </Box>
  );
};

export default NotificationsDetail;
