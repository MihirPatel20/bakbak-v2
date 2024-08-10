import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Backdrop,
  CircularProgress,
  Box,
  Container,
  Paper,
} from "@mui/material";
import api from "api";
import PostDetails from "./PostDetails";

function PostView() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  console.log("location", location);

  // Check if the state is set indicating we're opening in a dialog
  const isModal = location.state && location.state.background;

  const handleClose = () => {
    navigate(-1); // Navigate back to the previous page
  };

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
    <>
      {isModal ? (
        <Dialog
          open={Boolean(postId)}
          onClose={handleClose}
          fullWidth
          maxWidth="md"
        >
          <DialogContent>{post && <PostDetails post={post} />}</DialogContent>
        </Dialog>
      ) : (
        <Container>
          <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2, md: 4 } }}>
            {post && <PostDetails post={post} />}
          </Paper>
        </Container>
      )}
    </>
  );
}

export default PostView;
