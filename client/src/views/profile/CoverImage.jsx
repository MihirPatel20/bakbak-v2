import React, { useState } from "react";
import { Box, IconButton, Input, Skeleton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import api from "api";
import { getUserAvatarUrl } from "utils/getImageUrl";

const CoverImage = ({ profile, sx }) => {
  const [hover, setHover] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    getUserAvatarUrl(profile?.coverImage)
  );
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleHover = (state) => setHover(state);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl); // Show selected image as preview
      setError(false); // Reset error state
    }
  };

  const handleUpload = async () => {
    if (!imageFile) return;

    setLoading(true); // Set loading state during upload
    const formData = new FormData();
    formData.append("coverImage", imageFile);

    try {
      const response = await api.patch("/profile/cover-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Image uploaded successfully", response.data);
      setLoading(false); // Stop loading after successful upload
    } catch (error) {
      console.error("Error uploading image", error);
      setLoading(false);
    }
  };

  const handleError = () => {
    setError(true);
    setPreviewImage("/path-to-fallback-image.jpg"); // Set a fallback image on error
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: "150px", sm: "250px" },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0", // Fallback background color
        overflow: "hidden", // Ensure content doesn't overflow
        borderRadius: 2,
        "&:hover .edit-button": {
          opacity: 1, // Show edit button on hover
        },
        ...sx,
      }}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      {loading ? (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
        />
      ) : (
        <img
          src={previewImage}
          alt="Cover"
          onError={handleError}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: error ? "none" : "block",
          }}
        />
      )}

      {hover && !imageFile && (
        <IconButton
          className="edit-button"
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            opacity: 0,
            transition: "opacity 0.3s",
          }}
          onClick={() => document.getElementById("file-input").click()}
        >
          <EditIcon />
        </IconButton>
      )}

      <Input
        id="file-input"
        type="file"
        accept="image/*"
        sx={{ display: "none" }}
        onChange={handleImageChange}
      />

      {imageFile && (
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <IconButton
            className="edit-button"
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
            }}
            onClick={() => document.getElementById("file-input").click()}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            color="error"
            onClick={() => {
              setImageFile(null);
              setPreviewImage(getUserAvatarUrl(profile?.coverImage)); // Reset to original image
            }}
            sx={{
              backgroundColor: "#e03939bc",
              color: "white",

              "&:hover": {
                backgroundColor: "#e62d2d",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <IconButton
            color="primary"
            onClick={handleUpload}
            disabled={loading} // Disable button during upload
            sx={{
              backgroundColor: "#00c853bc",
              color: "white",

              "&:hover": {
                backgroundColor: "#18d667",
              },
            }}
          >
            <CheckIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default CoverImage;
