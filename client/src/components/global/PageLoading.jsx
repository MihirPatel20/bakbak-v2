import React from "react";

import { Box, Typography } from "@mui/material";

const PageLoading = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      style={{
        background: "white",
        overflow: "hidden",
      }}
    >
      <Typography
        variant="h1"
        className="gradient-wave"
        sx={{
          fontSize: "2.6rem",
          fontWeight: "bold",
          fontFamily: "Outfit, sans-serif",
          letterSpacing: "0.08em",
          color: "#000",
        }}
      >
        BAKBAK
      </Typography>
    </Box>
  );
};

export default PageLoading;
