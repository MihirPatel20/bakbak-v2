// React imports
import React, { useState, useEffect } from "react";

// MUI components
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  IconButton,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { pink } from "@mui/material/colors";

// Local imports
import api from "api";
import UserAccordion from "./UserAccordion";
import ConfirmationDialog from "components/shared/ConfirmationDialog";
import StatWidget from "./StatWidget";
import TopPostsSection from "./TopPostsSection";
import UserActivityChart from "./UserActivityChart";

export const adminApi = {
  getStatistics: () => api.get(`/admin/stats`),
  changeUserRole: (userId, newRole) =>
    api.put(`/admin/users/role`, { userId, newRole }),
  deleteAllChats: () => api.delete(`/admin/chats`),
  deleteAllNotifications: () => api.delete(`/admin/notifications`),
  deleteAllNotificationSubscriptions: () =>
    api.delete(`/admin/notification-subscriptions`),
};

const AdminPanel = () => {
  const [stats, setStats] = useState({});
  const [dialogType, setDialogType] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminApi.getStatistics();
      setStats(response.data.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleOpenDialog = (type) => setDialogType(type);
  const handleCloseDialog = () => setDialogType(null);

  const handleConfirmDelete = async () => {
    try {
      switch (dialogType) {
        case "chats":
          await adminApi.deleteAllChats();
          break;
        case "notifications":
          await adminApi.deleteAllNotifications();
          break;
        case "subscriptions":
          await adminApi.deleteAllNotificationSubscriptions();
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

  const basicStats = [
    { title: "Total Users", value: stats.totalUsers, color: "#3f51b5" },
    { title: "Total Chats", value: stats.totalChats, color: "#f50057" },
    { title: "Total Posts", value: stats.totalPosts, color: "#4caf50" },
    { title: "Total Comments", value: stats.totalComments, color: "#ff9800" },
  ];

  return (
    <Container maxWidth="lg" sx={{ mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight={200} component="h1">
          Admin Dashboard
        </Typography>
        <IconButton onClick={fetchStats} color="primary">
          <RefreshIcon />
        </IconButton>
      </Box>

      <Grid container spacing={{ xs: 1, md: 3 }} mt={0}>
        {basicStats.map((card, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <StatWidget
              title={card.title}
              value={card.value}
              color={card.color}
            />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} mt={0}>
        <Grid item xs={12}>
          <UserActivityChart data={stats} />
        </Grid>
      </Grid>

      <Box my={4}>
        <UserAccordion />
      </Box>

      <TopPostsSection />

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
    </Container>
  );
};

export default AdminPanel;
