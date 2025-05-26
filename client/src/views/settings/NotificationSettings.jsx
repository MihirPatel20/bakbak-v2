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
import { useDispatch, useSelector } from "react-redux";
import {
  applyPushNotificationSetting,
  applySettingChange,
} from "reducer/settings/settings.actions";

const NotificationsDetail = ({ onBack }) => {
  const notificationSettings = useSelector(
    (state) => state.settings.notifications
  );
  const dispatch = useDispatch();

  const handleSettingChange = (key, value) => {
    dispatch(applySettingChange(`notifications.${key}`, value));
  };

  const handlePushNotificationToggle = (isEnabled) => {
    dispatch(applyPushNotificationSetting(isEnabled));
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
          checked={notificationSettings.push}
          onChange={(val) => handlePushNotificationToggle(val)}
        />

        <SettingItem
          label="Email Notifications"
          checked={notificationSettings.email}
          onChange={(val) => handleSettingChange("email", val)}
        />
      </List>
    </Box>
  );
};

export default NotificationsDetail;
