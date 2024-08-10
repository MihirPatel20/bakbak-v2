import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import PostDetails from "./PostDetails";
import { usePostDialog } from "context/PostDialogContext.jsx";
import { useEffect, useState } from "react";
import api from "api/index.js";

const PostDialog = () => {
  const { isOpen, postId, closeDialog } = usePostDialog();
  const [post, setPost] = useState(null);

  const fetchPost = async (postId) => {
    try {
      const response = await api.get(`/post/${postId}`);
      setPost(response.data.data);
    } catch (error) {
      console.error("Error fetching post details:", error);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchPost(postId);
    }
  }, [postId]);

  return (
    <Dialog open={isOpen} onClose={closeDialog} fullWidth maxWidth="lg">
      {post && <PostDetails post={post} />}
    </Dialog>
  );
};

export default PostDialog;
