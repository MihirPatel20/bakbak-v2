// components/ProfileDetail.js
import React from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import EditProfile from "views/profile/EditProfile";

const ProfileDetail = ({ onBack }) => {
  return (
    <Box
      sx={{ p: 2, height: "100%", boxSizing: "border-box", overflowY: "auto" }}
    >
      <Header title="Profile Settings" onBack={onBack} />

      <EditProfile />
    </Box>
  );
};

export default ProfileDetail;
