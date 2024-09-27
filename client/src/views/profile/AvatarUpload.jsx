// AvatarUpload.js
import React, { useState } from "react";
import { Box, IconButton, Input, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import api from "api";

const AvatarUpload = ({ initialAvatar, onUploadSuccess }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(initialAvatar);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedAvatar(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewAvatar(imageUrl);
      setError(false);
    }
  };

  const handleAvatarUpload = async () => {
    if (!selectedAvatar) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("avatar", selectedAvatar);

    try {
      const response = await api.patch("/profile/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Avatar uploaded successfully", response.data);
      onUploadSuccess(response.data); // Call the success handler
      setLoading(false);
    } catch (error) {
      console.error("Error uploading avatar", error);
      setError(true);
      setLoading(false);
    }
  };

  return (
    <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
      <img
        src={previewAvatar}
        alt="Avatar"
        style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          objectFit: "cover",
          marginRight: 16,
        }}
      />
      <Input
        id="avatar-input"
        type="file"
        accept="image/*"
        sx={{ display: "none" }}
        onChange={handleAvatarChange}
      />
      <IconButton
        onClick={() => document.getElementById("avatar-input").click()}
        color="primary"
      >
        <EditIcon />
      </IconButton>
      <IconButton
        onClick={handleAvatarUpload}
        color="primary"
        disabled={loading || !selectedAvatar}
      >
        <Typography>{loading ? "Uploading..." : "Upload"}</Typography>
      </IconButton>
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          Error uploading avatar.
        </Typography>
      )}
    </Box>
  );
};

export default AvatarUpload;
