import React, { useState } from "react";

// MUI components
import { Typography, Box, Paper, Button, Grid } from "@mui/material";
import {
  Delete as DeleteIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { pink, blue } from "@mui/material/colors";

import ConfirmationDialog from "components/shared/ConfirmationDialog";
import { downloadFile, downloadJsonFile } from "utils/downloadFile";
import api from "api";

const ManagementActions = () => {
  const [dialogType, setDialogType] = useState(null);

  const handleOpenDialog = (type) => setDialogType(type);
  const handleCloseDialog = () => setDialogType(null);

  const handleDownloadLog = async () => {
    try {
      const response = await api.get("/admin/download-log", {
        responseType: "blob",
      });

      // Download the file as is
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
    }
    handleCloseDialog();
  };

  return (
    <>
      <Box mt={4}>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Management Actions
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
                  onClick={() => handleOpenDialog(type)}
                >
                  Delete All {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              </Grid>
            ))}
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
      </Box>

      <ConfirmationDialog
        open={dialogType !== null}
        title="Confirm Deletion"
        message={`Are you sure you want to delete all ${dialogType}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onClose={handleCloseDialog}
      />
    </>
  );
};

export default ManagementActions;
