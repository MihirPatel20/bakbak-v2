import React, { useState } from "react";
import {
  Box,
  Typography,
  Switch,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Divider,
  TextField,
  Button,
  Slide,
  FormControlLabel,
  Checkbox,
  Container,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import defaultSettings from "./settingsConfig";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState(null); // null means main page
  const [settings, setSettings] = useState(defaultSettings);

  // Handlers for main page toggle and opening detail pages
  const toggleNotifications = (checked) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, enabled: checked },
    }));
  };

  // Update notifications categories etc inside NotificationsDetail
  const handleNotificationCategoryChange = (category, checked) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        categories: {
          ...prev.notifications.categories,
          [category]: checked,
        },
      },
    }));
  };

  const handleQuietHoursChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        quietHours: {
          ...prev.notifications.quietHours,
          [field]: value,
        },
      },
    }));
  };

  // Profile settings handlers
  const handleProfileChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value,
      },
    }));
  };

  // UI Components for detail pages below

  function NotificationsDetail() {
    return (
      <Box sx={{ p: 2, height: "100%", boxSizing: "border-box" }}>
        <Header
          title="Notification Settings"
          onBack={() => setActiveSection(null)}
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.notifications.enabled}
              onChange={(e) => toggleNotifications(e.target.checked)}
            />
          }
          label="Enable Notifications"
          sx={{ mt: 2 }}
        />
        {settings.notifications.enabled && (
          <>
            <Typography variant="subtitle1" sx={{ mt: 3 }}>
              Notification Categories
            </Typography>
            {Object.entries(settings.notifications.categories).map(
              ([key, val]) => (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      checked={val}
                      onChange={(e) =>
                        handleNotificationCategoryChange(key, e.target.checked)
                      }
                    />
                  }
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                />
              )
            )}

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1">Quiet Hours</Typography>
              <TextField
                label="Start"
                type="time"
                size="small"
                value={settings.notifications.quietHours.start}
                onChange={(e) =>
                  handleQuietHoursChange("start", e.target.value)
                }
                sx={{ mr: 2, mt: 1 }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End"
                type="time"
                size="small"
                value={settings.notifications.quietHours.end}
                onChange={(e) => handleQuietHoursChange("end", e.target.value)}
                sx={{ mt: 1 }}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </>
        )}
      </Box>
    );
  }

  function ProfileDetail() {
    return (
      <Box
        sx={{
          p: 2,
          height: "100%",
          boxSizing: "border-box",
          overflowY: "auto",
        }}
      >
        <Header
          title="Profile Settings"
          onBack={() => setActiveSection(null)}
        />
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={settings.profile.username}
          onChange={(e) => handleProfileChange("username", e.target.value)}
        />
        <TextField
          label="Display Name"
          fullWidth
          margin="normal"
          value={settings.profile.displayName}
          onChange={(e) => handleProfileChange("displayName", e.target.value)}
        />
        <TextField
          label="Bio"
          fullWidth
          multiline
          rows={3}
          margin="normal"
          value={settings.profile.bio}
          onChange={(e) => handleProfileChange("bio", e.target.value)}
        />
        <TextField
          label="Avatar URL"
          fullWidth
          margin="normal"
          value={settings.profile.avatar}
          onChange={(e) => handleProfileChange("avatar", e.target.value)}
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.profile.publicProfile}
              onChange={(e) =>
                handleProfileChange("publicProfile", e.target.checked)
              }
            />
          }
          label="Public Profile"
          sx={{ mt: 2 }}
        />
        <Box
          sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 1 }}
        >
          <Button variant="outlined" onClick={() => setActiveSection(null)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              // Save action, here just close detail for demo
              setActiveSection(null);
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    );
  }

  // Header with back button
  function Header({ title, onBack }) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
          borderBottom: "1px solid #ddd",
          pb: 1,
        }}
      >
        <IconButton onClick={onBack} edge="start" aria-label="back">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ ml: 1 }}>
          {title}
        </Typography>
      </Box>
    );
  }

  // Main page UI
  function MainSettings() {
    return (
      <Container maxWidth="md" sx={{ px: 2, mt: { sm: 0, md: 3 } }}>
        <Typography variant="h3" gutterBottom>
          Preferences
        </Typography>

        <List>
          <ListItemButton onClick={() => setActiveSection("profile")}>
            <ListItemText primary="Profile Settings" />
          </ListItemButton>

          <Divider />
          
          <ListItemButton
            onClick={() => setActiveSection("notifications")}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <ListItemText primary="Notifications" />
            <Switch
              size="small"
              checked={settings.notifications.enabled}
              onClick={(e) => {
                e.stopPropagation();
                toggleNotifications(!settings.notifications.enabled);
              }}
            />
          </ListItemButton>

          <Divider />

          <ListItemButton onClick={() => setActiveSection("interaction")}>
            <ListItemText primary="Interaction Settings" />
          </ListItemButton>

          <Divider />

          <ListItemButton onClick={() => setActiveSection("appearance")}>
            <ListItemText primary="Appearance" />
          </ListItemButton>

          <Divider />

          <ListItemButton onClick={() => setActiveSection("language")}>
            <ListItemText primary="Language & Accessibility" />
          </ListItemButton>

          <Divider />

          <ListItemButton onClick={() => setActiveSection("security")}>
            <ListItemText primary="Security" />
          </ListItemButton>

          <Divider />

          <ListItemButton onClick={() => setActiveSection("communication")}>
            <ListItemText primary="Communication" />
          </ListItemButton>

          <Divider />

          <ListItemButton onClick={() => setActiveSection("danger")}>
            <ListItemText primary="Danger Zone" />
          </ListItemButton>

          <Divider />
        </List>
      </Container>
    );
  }

  // Dummy placeholders for other sections
  function PlaceholderDetail({ title }) {
    return (
      <Box sx={{ p: 2, height: "100%", boxSizing: "border-box" }}>
        <Header title={title} onBack={() => setActiveSection(null)} />
        <Typography>Settings UI for {title} coming soon...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      {/* Main settings - slide out when detail opened */}
      <Slide
        direction={activeSection ? "right" : "right"}
        in={!activeSection}
        mountOnEnter
        unmountOnExit
      >
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            bgcolor: "background.paper",
            overflowY: "auto",
          }}
        >
          <MainSettings />
        </Box>
      </Slide>

      {/* Detail pages - slide in */}
      <Slide direction="left" in={!!activeSection} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            bgcolor: "background.paper",
            overflowY: "auto",
          }}
        >
          {activeSection === "notifications" && <NotificationsDetail />}
          {activeSection === "profile" && <ProfileDetail />}
          {activeSection === "interaction" && (
            <PlaceholderDetail title="Interaction Settings" />
          )}
          {activeSection === "appearance" && (
            <PlaceholderDetail title="Appearance" />
          )}
          {activeSection === "language" && (
            <PlaceholderDetail title="Language & Accessibility" />
          )}
          {activeSection === "security" && (
            <PlaceholderDetail title="Security" />
          )}
          {activeSection === "communication" && (
            <PlaceholderDetail title="Communication" />
          )}
          {activeSection === "danger" && (
            <PlaceholderDetail title="Danger Zone" />
          )}
        </Box>
      </Slide>
    </Box>
  );
}
