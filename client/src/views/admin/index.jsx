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
import { Refresh as RefreshIcon } from "@mui/icons-material";

// Local imports
import api from "api";
import UserAccordion from "./UserAccordion";
import StatWidget from "./StatWidget";
import TopPostsSection from "./TopPostsSection";
import UserActivityChart from "./UserActivityChart";
import UserActivityLogsChart from "./UserActivityLogsChart";
import ManagementActions from "./ManagementActions";

export const adminApi = {
  changeUserRole: (userId, newRole) =>
    api.put(`/admin/users/role`, { userId, newRole }),
};

const AdminPanel = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get(`/admin/stats`);
      setStats(response.data.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
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
          {/* <UserActivityLogsChart /> */}
        </Grid>
      </Grid>

      <Box my={4}>
        <UserAccordion />
      </Box>

      <TopPostsSection />

      <ManagementActions />
    </Container>
  );
};

export default AdminPanel;
