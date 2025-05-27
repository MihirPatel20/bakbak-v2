import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Chip,
  Paper,
  Typography,
  IconButton,
  Container,
} from "@mui/material";
import { styled } from "@mui/system";
import CancelIcon from "@mui/icons-material/Cancel";
import ImageIcon from "@mui/icons-material/Image";
import api from "api";
import { useNavigate } from "react-router-dom";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 600,
  margin: "auto",
  // marginTop: theme.spacing(4),
}));

const ImagePreview = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",

  borderRadius: 4,
});

const ImagePlaceholder = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isDragging",
})(({ theme, isDragging }) => ({
  width: "100%",
  height: 300,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  border: `2px dashed ${
    isDragging ? theme.palette.secondary.main : theme.palette.grey[300]
  }`,
  borderRadius: 4,
  marginTop: 16,
  marginBottom: 16,
  color: isDragging ? theme.palette.secondary.main : theme.palette.grey[500],
  backgroundColor: isDragging ? theme.palette.secondary.light : "transparent",
  cursor: "pointer",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    borderColor: theme.palette.secondary.main,
    color: theme.palette.secondary.main,
  },
}));

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleTagInputChange = (event) => {
    setCurrentTag(event.target.value);
  };

  const handleTagInputKeyPress = (event) => {
    if (event.key === "Enter" && currentTag.trim() !== "") {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleImageUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleDragEnter = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file);
    }
  }, []);

  useEffect(() => {
    const handleGlobalDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener("dragover", handleGlobalDrop);
    window.addEventListener("drop", handleGlobalDrop);

    return () => {
      window.removeEventListener("dragover", handleGlobalDrop);
      window.removeEventListener("drop", handleGlobalDrop);
    };
  }, []);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsLoading(true);

    console.log("Submitting post:", { content, tags, image });

    try {
      const formData = new FormData();
      formData.append("content", content);
      // Append each tag individually to the FormData
      tags.forEach((tag, index) => {
        formData.append(`tags[${index}]`, tag);
      });

      if (image) {
        // Convert base64 image to file
        const imageFile = await fetch(image).then((res) => res.blob());
        formData.append("images", imageFile, "image.jpg");
      }

      const response = await api.post("post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Post created:", response.data);
      // Reset form or navigate to the new post
      setContent("");
      setTags([]);
      setImage(null);
      setIsLoading(false);

      navigate("/home");
    } catch (error) {
      console.error("Error creating post:", error);
      // Handle error (e.g., show error message to user)
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <StyledPaper variant="outlined">
        <Typography variant="h5" gutterBottom>
          Create a New Post
        </Typography>

        {image ? (
          <Box position="relative" height={300} mt={2} mb={2}>
            <ImagePreview src={image} alt="Preview" />
            <IconButton
              size="small"
              sx={{ position: "absolute", top: 8, right: 8, bgcolor: "white" }}
              onClick={handleRemoveImage}
            >
              <CancelIcon />
            </IconButton>
          </Box>
        ) : (
          <ImagePlaceholder
            isDragging={isDragging}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById("image-upload").click()}
          >
            <ImageIcon sx={{ fontSize: 64, mb: 1 }} />
            <Typography variant="body2">
              {isDragging
                ? "Drop the image here"
                : "Click or drag and drop an image here"}
            </Typography>
          </ImagePlaceholder>
        )}
        <input
          accept="image/*"
          id="image-upload"
          type="file"
          hidden
          onChange={(e) => handleImageUpload(e.target.files[0])}
        />

        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder="What's on your mind?"
          value={content}
          onChange={handleContentChange}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Add tags (press Enter to add)"
          value={currentTag}
          onChange={handleTagInputChange}
          onKeyPress={handleTagInputKeyPress}
          sx={{ mb: 2 }}
        />
        <Box display="flex" flexWrap="wrap" gap={1}>
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => handleRemoveTag(tag)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>

        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            disableElevation
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Posting..." : "Post"}
          </Button>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default CreatePost;
