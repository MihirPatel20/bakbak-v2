import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Avatar,
  TextField,
  Button,
  Grid,
  Box,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getUserAvatarUrl } from "utils/getImageUrl";
import { formatRelativeTime } from "utils/getRelativeTime";
import api from "api";

const PostDialog = ({ post, open, onClose }) => {
  const theme = useTheme();
  const [comment, setComment] = useState("");
  const [postComments, setPostComments] = useState([]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    // Handle comment submission logic here
    console.log("Submitted comment:", comment);
    setComment("");
  };

  const fetchPostComments = async () => {
    try {
      // Fetch post comments
      const response = await api.get(`/comment/post/${post._id}`);
      setPostComments(response.data.data.comments);
    } catch (error) {
      console.error("Error fetching post comments:", error);
    }
  };

  useEffect(() => {
    fetchPostComments();
  }, [post._id]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.background.default,
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">
            Post by {post.author.firstName} {post.author.lastName}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
       
      </DialogContent>
    </Dialog>
  );
};

export default PostDialog;
