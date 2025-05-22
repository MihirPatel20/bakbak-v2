import { Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const BakbakLogo = ({ sx }) => {
  const navigate = useNavigate();

  return (
    <Typography
      variant="body2"
      onClick={() => navigate("/")}
      sx={{
        fontWeight: "bold",
        fontFamily: "Outfit, sans-serif",
        letterSpacing: "0.08em",
        background: "linear-gradient(120deg, #007bff 75%, #00c6ff 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        cursor: "pointer", // Add cursor pointer to indicate clickable
        ...sx,
      }}
    >
      BAKBAK
    </Typography>
  );
};

export default BakbakLogo;