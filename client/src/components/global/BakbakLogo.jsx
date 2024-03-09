import { Typography } from "@mui/material";
import React from "react";

const BakbakLogo = ({ sx }) => {
  return (
    <Typography
      variant="body2"
      // className="gradient-wave"
      sx={{
        fontWeight: "bold",
        fontFamily: "Outfit, sans-serif",
        letterSpacing: "0.08em",
        background: "linear-gradient(120deg, #007bff 75%, #00c6ff 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",

        ...sx,
      }}
    >
      BAKBAK
    </Typography>
  );
};

export default BakbakLogo;
