// UserActivityChart.js

import React from "react";
import { Line } from "react-chartjs-2";
import { Box, Paper, Typography } from "@mui/material";

const userChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false, // Hide the legend
    },
    title: {
      display: false, // Hide the title
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
    },
  },
};

const UserActivityChart = ({ data }) => {
  const userChartData = {
    labels: [
      "Active (24h)",
      "Active (7d)",
      "Active (30d)",
      "New (Day)",
      "New (Week)",
      "New (Month)",
    ],
    datasets: [
      {
        label: "Active Users",
        data: [
          data.activeUsers24h,
          data.activeUsers7d,
          data.activeUsers30d,
          null,
          null,
          null,
        ],
        borderColor: "#8884d8",
        tension: 0.4, // Adjust the curve smoothness
        fill: false,
      },
      {
        label: "New Users",
        data: [
          null,
          null,
          null,
          data.newUsersDay,
          data.newUsersWeek,
          data.newUsersMonth,
        ],
        borderColor: "#82ca9d",
        tension: 0.4, // Adjust the curve smoothness
        fill: false,
      },
    ],
  };
  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        User Activity
      </Typography>
      <Box height={300}>
        <Line data={userChartData} options={userChartOptions} />
      </Box>
    </Paper>
  );
};

export default UserActivityChart;
