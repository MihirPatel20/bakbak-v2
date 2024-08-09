import React, { useEffect, useState } from "react";
import api from "api";
import { Line } from "react-chartjs-2";
import { Box, Paper, Typography } from "@mui/material";
import { USER_ACTIVITY_TYPES } from "constants";
import { act } from "react";

const UserActivityChart = () => {
  const [data, setData] = useState(null);

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/admin/get-user-activity");

        console.log("response: ", response);
        const result = await response.data;
        setData(result);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <p>Loading chart data...</p>;
  }

  // Prepare data for the chart
  const labels = Object.keys(data).sort(); // Sort the dates
  const activityTypes = new Set();
  labels.forEach((date) => {
    Object.keys(data[date]).forEach((type) => activityTypes.add(type));
  });

  const colors = {
    [USER_ACTIVITY_TYPES.USER_REGISTRATION]: "#8884d8",
    [USER_ACTIVITY_TYPES.USER_LOGIN]: "#82ca9d",
    [USER_ACTIVITY_TYPES.SEND_MESSAGE]: "#ffc658",
  };

  const datasets = Array.from(activityTypes).map((activityType) => {
    return {
      label: activityType,
      data: labels.map((date) => data[date][activityType] || 0), // Fill in data or 0 if not available
      fill: true,
      borderColor: colors[activityType] || getRandomColor(),
      tension: 0.3,
    };
  });

  // Generate random color for each line
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const chartData = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
          },
        },
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

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        User Activity
      </Typography>
      <Box height={350}>
        <Line data={chartData} options={options} />
      </Box>
    </Paper>
  );
};

export default UserActivityChart;
