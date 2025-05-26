import React from "react";
import { Card, CardContent, Grid, Typography, Switch } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  applySettingChange,
  applyPushNotificationSetting,
} from "reducer/settings/settings.actions";

const PreferencesCard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const notificationSettings = useSelector(
    (state) => state.settings.notifications
  );

  const handleSettingChange = (key, value) => {
    dispatch(applySettingChange(`notifications.${key}`, value));
  };

  const handlePushNotificationToggle = (isEnabled) => {
    dispatch(applyPushNotificationSetting(isEnabled));
  };

  return (
    <Card sx={{ bgcolor: theme.palette.primary.light, my: 2 }}>
      <CardContent>
        <Grid container spacing={3} direction="column">
          {/* Push Notifications */}
          <Grid item>
            <Grid container alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle1">Push Notifications</Typography>
              <Switch
                color="primary"
                checked={notificationSettings.push}
                onChange={(val) => handlePushNotificationToggle(val)}
                size="small"
              />
            </Grid>
          </Grid>

          {/* Email Notifications */}
          <Grid item>
            <Grid container alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle1">Email Notifications</Typography>
              <Switch
                color="primary"
                checked={notificationSettings.email}
                onChange={(val) => handleSettingChange("email", val)}
                size="small"
              />
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PreferencesCard;
