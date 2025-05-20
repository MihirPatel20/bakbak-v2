import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Checkbox,
  Button,
  Paper,
  Divider,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Container,
} from "@mui/material";

import * as serviceWorkerRegistration from "@/serviceWorkerRegistration";
import { updatePushSubscriptionStatus } from "@/serviceWorkerRegistration";

const SettingsView = () => {
  const [settings, setSettings] = useState({
    notifications: {
      enabled: false,
      types: {
        news: false,
        updates: false,
        messages: false,
      },
      quietHours: {
        start: "22:00",
        end: "07:00",
      },
    },
    account: {
      email: "",
      password: "",
    },
    privacy: {
      dataSharing: false,
      cookiesEnabled: true,
    },
    appearance: {
      darkMode: false,
      fontSize: "medium",
    },
    language: "en",
    accessibility: {
      highContrast: false,
      screenReader: false,
    },
    security: {
      twoFactor: false,
    },
    communication: {
      marketingEmails: false,
      updateFrequency: "weekly",
    },
  });

  useEffect(() => {
    // Load user settings here
    // For now, we'll use the initial state
  }, []);

  const handleSettingChange = async (category, setting, value) => {
    // Update local state
    setSettings((prevSettings) => ({
      ...prevSettings,
      [category]: {
        ...prevSettings[category],
        [setting]: value,
      },
    }));

    // Handle notification settings specifically
    if (category === "notifications" && setting === "enabled") {
      await handleNotificationToggle(value);
    }
  };

  const handleNotificationToggle = async (isEnabled) => {
    try {
      if (isEnabled) {
        const activateResponse = await updatePushSubscriptionStatus("activate");

        if (!activateResponse) {
          const registration =
            await serviceWorkerRegistration.initializeServiceWorker();
          if (!registration) {
            console.error(
              "[Settings] Failed to enable notifications. Please check your browser settings."
            );
            return;
          }
        }
      } else {
        const deactivateResponse = await updatePushSubscriptionStatus(
          "deactivate"
        );
        if (!deactivateResponse) {
          console.error("[Settings] Failed to disable notifications.");
          return;
        }
      }
    } catch (error) {
      console.error(
        "[Settings] Notification settings update failed:",
        error.message
      );
    }
  };

  const handleNestedSettingChange = (
    category,
    nestedCategory,
    setting,
    value
  ) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [category]: {
        ...prevSettings[category],
        [nestedCategory]: {
          ...prevSettings[category][nestedCategory],
          [setting]: value,
        },
      },
    }));
  };

  const handleSaveSettings = () => {
    console.log("Saving settings:", settings);
    // Implement API call to save settings
  };

  return (
    <Container sx={{ px: 2, mt: { sm: 0, md: 3 } }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Notification Settings
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={settings.notifications.enabled}
                onChange={(e) =>
                  handleSettingChange(
                    "notifications",
                    "enabled",
                    e.target.checked
                  )
                }
              />
            }
            label="Enable Notifications"
          />
          <Box sx={{ ml: 3, mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Notification Types
            </Typography>
            {Object.entries(settings.notifications.types).map(
              ([key, value]) => (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      checked={value}
                      onChange={(e) =>
                        handleNestedSettingChange(
                          "notifications",
                          "types",
                          key,
                          e.target.checked
                        )
                      }
                      disabled={!settings.notifications.enabled}
                    />
                  }
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                />
              )
            )}
          </Box>

          <Box sx={{ ml: 3, mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom mb={2}>
              Quiet Hours
            </Typography>
            <TextField
              label="Start"
              type="time"
              size="small"
              value={settings.notifications.quietHours.start}
              onChange={(e) =>
                handleNestedSettingChange(
                  "notifications",
                  "quietHours",
                  "start",
                  e.target.value
                )
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End"
              type="time"
              size="small"
              value={settings.notifications.quietHours.end}
              onChange={(e) =>
                handleNestedSettingChange(
                  "notifications",
                  "quietHours",
                  "end",
                  e.target.value
                )
              }
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Account Settings
          </Typography>
          <TextField
            fullWidth
            label="Email"
            value={settings.account.email}
            onChange={(e) =>
              handleSettingChange("account", "email", e.target.value)
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="New Password"
            type="password"
            onChange={(e) =>
              handleSettingChange("account", "password", e.target.value)
            }
            margin="normal"
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Privacy and Data
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={settings.privacy.dataSharing}
                onChange={(e) =>
                  handleSettingChange(
                    "privacy",
                    "dataSharing",
                    e.target.checked
                  )
                }
              />
            }
            label="Allow Data Sharing"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.privacy.cookiesEnabled}
                onChange={(e) =>
                  handleSettingChange(
                    "privacy",
                    "cookiesEnabled",
                    e.target.checked
                  )
                }
              />
            }
            label="Enable Cookies"
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Appearance
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={settings.appearance.darkMode}
                onChange={(e) =>
                  handleSettingChange(
                    "appearance",
                    "darkMode",
                    e.target.checked
                  )
                }
              />
            }
            label="Dark Mode"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Font Size</InputLabel>
            <Select
              label="Font Size"
              value={settings.appearance.fontSize}
              onChange={(e) =>
                handleSettingChange("appearance", "fontSize", e.target.value)
              }
            >
              <MenuItem value="small">Small</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="large">Large</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Language and Region
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Language</InputLabel>
            <Select
              value={settings.language}
              onChange={(e) => handleSettingChange("language", e.target.value)}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Spanish</MenuItem>
              <MenuItem value="fr">French</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Accessibility
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={settings.accessibility.highContrast}
                onChange={(e) =>
                  handleSettingChange(
                    "accessibility",
                    "highContrast",
                    e.target.checked
                  )
                }
              />
            }
            label="High Contrast Mode"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.accessibility.screenReader}
                onChange={(e) =>
                  handleSettingChange(
                    "accessibility",
                    "screenReader",
                    e.target.checked
                  )
                }
              />
            }
            label="Screen Reader Support"
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Security
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={settings.security.twoFactor}
                onChange={(e) =>
                  handleSettingChange("security", "twoFactor", e.target.checked)
                }
              />
            }
            label="Two-Factor Authentication"
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Communication Preferences
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={settings.communication.marketingEmails}
                onChange={(e) =>
                  handleSettingChange(
                    "communication",
                    "marketingEmails",
                    e.target.checked
                  )
                }
              />
            }
            label="Receive Marketing Emails"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Update Frequency</InputLabel>
            <Select
              value={settings.communication.updateFrequency}
              onChange={(e) =>
                handleSettingChange(
                  "communication",
                  "updateFrequency",
                  e.target.value
                )
              }
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveSettings}
          >
            Save All Settings
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SettingsView;
