// SettingsPage.js
import React, { useState } from "react";

import {
  Container,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Slide,
} from "@mui/material";

import NotificationSettings from "./NotificationSettings";
import ProfileDetail from "./ProfileSettings";
import Header from "./Header";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState(null);

  return (
    <Container
      maxWidth="md"
      sx={{
        p: 0,
        mt: { sm: 0, md: 3 },
        position: "relative",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Slide direction="right" in={!activeSection} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: "absolute",
            width: "calc(100% - 24px)",
            height: "100%",
            bgcolor: "background.paper",
            overflowY: "auto",
            px: 2,
          }}
        >
          <MainSettings onSectionChange={setActiveSection} />
        </Box>
      </Slide>

      <Slide direction="left" in={!!activeSection} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: "absolute",
            width: "calc(100% - 24px)",
            height: "100%",
            bgcolor: "background.paper",
            overflowY: "auto",
            px: 2,
          }}
        >
          {activeSection === "notifications" && (
            <NotificationSettings onBack={() => setActiveSection(null)} />
          )}
          {activeSection === "profile" && (
            <ProfileDetail onBack={() => setActiveSection(null)} />
          )}
          {[
            "interaction",
            "appearance",
            "language",
            "security",
            "communication",
            "danger",
          ].includes(activeSection) && (
            <PlaceholderDetail
              title={activeSection}
              onBack={() => setActiveSection(null)}
            />
          )}
        </Box>
      </Slide>
    </Container>
  );
}

const MainSettings = ({ onSectionChange }) => {
  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        Preferences
      </Typography>
      <List>
        {[
          "profile",
          "notifications",
          "interaction",
          "appearance",
          "language",
          "security",
          "communication",
          "danger",
        ].map((section, i) => (
          <React.Fragment key={section}>
            <ListItemButton
              onClick={() => onSectionChange(section)}
              sx={
                section === "notifications"
                  ? {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }
                  : {}
              }
            >
              <ListItemText
                primary={
                  {
                    profile: "Profile Settings",
                    notifications: "Notifications",
                    interaction: "Interaction Settings",
                    appearance: "Appearance",
                    language: "Language & Accessibility",
                    security: "Security",
                    communication: "Communication",
                    danger: "Danger Zone",
                  }[section]
                }
              />
            </ListItemButton>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

const PlaceholderDetail = ({ title, onBack }) => (
  <Box sx={{ p: 2, height: "100%", boxSizing: "border-box" }}>
    <Header title={title} onBack={onBack} />
    <Typography>Settings UI for {title} coming soon...</Typography>
  </Box>
);
