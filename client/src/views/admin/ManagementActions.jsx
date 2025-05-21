import React, { useState } from "react";
import { Typography, Box, Paper, Button, Grid } from "@mui/material";
import {
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Backup as BackupIcon,
} from "@mui/icons-material";
import { pink, blue, green } from "@mui/material/colors";

import ConfirmationDialog from "components/shared/ConfirmationDialog";
import { downloadFile, downloadJsonFile } from "utils/downloadFile";
import api from "api";

const ManagementActions = () => {
  const [dialogType, setDialogType] = useState(null);
  const [dialogAction, setDialogAction] = useState(null);
  const [seedTarget, setSeedTarget] = useState(null);
  const [chatIdForSeed, setChatIdForSeed] = useState(null);

  const handleOpenDialog = (type, action, seedKey = null) => {
    setDialogType(type);
    setDialogAction(action);
    setSeedTarget(seedKey);
  };

  const handleCloseDialog = () => {
    setDialogType(null);
    setDialogAction(null);
    setSeedTarget(null);
    setChatIdForSeed(null);
  };

  const handleDownloadLog = async () => {
    try {
      const response = await api.get("/admin/download-log", {
        responseType: "blob",
      });

      downloadFile(response.data, "user-activity.log");
      downloadJsonFile(response.data, "user-activity.json");
    } catch (error) {
      console.error("Failed to download the log file:", error);
      alert("Error downloading the log file.");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      switch (dialogType) {
        case "chats":
          await api.delete(`/admin/chats`);
          break;
        case "notifications":
          await api.delete(`/admin/notifications`);
          break;
        case "subscriptions":
          await api.delete(`/admin/notification-subscriptions`);
          break;
        default:
          break;
      }
      fetchStats();
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("Failed to delete data.");
    }
  };

  const seedFunctions = {
    "social-media": async () => {
      await api.post("/seed/social-media");
      alert("Social media data seeded successfully.");
    },
    "chat-app": async () => {
      await api.post("/seed/chat-app");
      alert("Chat app data seeded successfully.");
    },
    "chat-messages": async (chatId) => {
      await api.post(`/seed/chat-messages/${chatId}`);
      alert("Chat messages seeded.");
    },
  };

  const handleConfirmSeed = async () => {
    try {
      if (seedTarget === "chat-messages") {
        // ask chatId only here
        const chatId = prompt("Enter Chat ID to seed messages:");
        if (!chatId) {
          alert("Seed canceled: No chat ID provided.");
          return;
        }
        setChatIdForSeed(chatId);
        await seedFunctions[seedTarget](chatId);
      } else {
        await seedFunctions[seedTarget]();
      }
    } catch (err) {
      console.error("Seeding failed:", err);
      alert("Failed to seed data.");
    }
  };

  const handleConfirm = async () => {
    if (dialogAction === "delete") {
      await handleConfirmDelete();
    } else if (dialogAction === "seed") {
      await handleConfirmSeed();
    }
    handleCloseDialog();
  };

  // Compose dialog title and message dynamically
  let dialogTitle = "";
  let dialogMessage = "";

  if (dialogAction === "delete") {
    dialogTitle = "Confirm Deletion";
    dialogMessage = `Are you sure you want to delete all ${dialogType}? This action cannot be undone.`;
  } else if (dialogAction === "seed") {
    dialogTitle = "Confirm Seeding";
    dialogMessage = `Are you sure you want to seed ${dialogType}? This may overwrite existing data.`;
  }

  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          mt: 4,
          backgroundColor: "#ffebee", 
          borderRadius: 2,
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <Typography variant="h3" textAlign="center" gutterBottom>
          Management Actions
        </Typography>

        {/* Seed Data Section */}
        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          Seed Data
        </Typography>
        <Grid container spacing={2} mb={3}>
          <Grid item>
            <Button
              variant="contained"
              sx={{
                color: "white",
                backgroundColor: green[800],
                "&:hover": { backgroundColor: green[700] },
              }}
              startIcon={<BackupIcon />}
              onClick={() =>
                handleOpenDialog("Social Media", "seed", "social-media")
              }
            >
              Seed Social Media
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              sx={{
                color: "white",
                backgroundColor: green[800],
                "&:hover": { backgroundColor: green[700] },
              }}
              startIcon={<BackupIcon />}
              onClick={() => handleOpenDialog("Chat App", "seed", "chat-app")}
            >
              Seed Chat App
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              sx={{
                color: "white",
                backgroundColor: green[800],
                "&:hover": { backgroundColor: green[700] },
              }}
              startIcon={<BackupIcon />}
              onClick={() =>
                handleOpenDialog("Chat Messages", "seed", "chat-messages")
              }
            >
              Seed Chat Messages
            </Button>
          </Grid>
        </Grid>

        {/* Delete Data Section */}
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Delete Data
        </Typography>
        <Grid container spacing={2}>
          {["chats", "notifications", "subscriptions"].map((type) => (
            <Grid item key={type}>
              <Button
                variant="contained"
                sx={{
                  color: "white",
                  backgroundColor: pink[900],
                  "&:hover": {
                    backgroundColor: pink[800],
                  },
                }}
                startIcon={<DeleteIcon />}
                onClick={() => handleOpenDialog(type, "delete")}
              >
                Delete All {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            </Grid>
          ))}
        </Grid>

        {/* Download Log Button */}
        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          Download Data
        </Typography>
        <Grid container spacing={2} mb={3}>
          <Grid item>
            <Button
              variant="contained"
              sx={{
                color: "white",
                backgroundColor: blue[900],
                "&:hover": {
                  backgroundColor: blue[800],
                },
              }}
              startIcon={<DownloadIcon />}
              onClick={handleDownloadLog}
            >
              Download Log File
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <ConfirmationDialog
        open={dialogType !== null}
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={handleConfirm}
        onClose={handleCloseDialog}
      />
    </>
  );
};

export default ManagementActions;
