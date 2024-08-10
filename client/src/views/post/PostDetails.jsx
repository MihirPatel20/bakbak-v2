import React, { useEffect, useState } from "react";
import {
  Typography,
  Avatar,
  TextField,
  Box,
  useTheme,
  Grid,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { formatRelativeTime } from "utils/getRelativeTime";
import api from "api";
import { getUserAvatarUrl } from "utils/getImageUrl";
import ImageCarousel from "views/home/ActivityFeed/ImageCarousel";
import PerfectScrollbar from "react-perfect-scrollbar";

const PostDetails = ({ post }) => {
  const theme = useTheme();
  const [comment, setComment] = useState("");
  const [postComments, setPostComments] = useState([]);
  const [readMoreStatus, setReadMoreStatus] = useState({});

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    // Handle comment submission logic here
    console.log("Submitted comment:", comment);
    try {
      const response = await api.post(`/comment/post/${post._id}`, {
        content: comment,
      });
      setComment("");
    } catch (error) {
      console.error("Error fetching post details:", error);
    }
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

  const truncateContent = (content, limit) => {
    if (content.length <= limit) return content;
    return content.substring(0, limit) + "...";
  };

  const toggleReadMore = (index) => {
    setReadMoreStatus((prevStatus) => ({
      ...prevStatus,
      [index]: !prevStatus[index],
    }));
  };

  return (
    <Grid container>
      {/* Left side - Post Image Preview */}
      <Grid
        item
        xs={12}
        md={6}
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <ImageCarousel items={post.images} />
      </Grid>

      {/* Right side - Post Content and Comments */}
      <Grid
        item
        xs={12}
        md={6}
        p={2}
        display="flex"
        flexDirection="column"
        position="relative"
        borderLeft={1}
        borderLeftColor="grey.500"
      >
        <Box
          mb={3}
          display="flex"
          alignItems="center"
          gap={2}
          position="absolute"
          p={2}
          top={0}
          left={0}
          right={0}
          borderBottom={1}
          zIndex={1}
          bgcolor="background.paper"
          borderBottomColor="grey.400"
        >
          <Avatar
            src={getUserAvatarUrl(post.author.account.avatar)}
            alt="author avatar"
          />
          <Typography
            component="div"
            variant="body2"
            display="flex"
            alignItems="center"
          >
            {post.author.firstName} {post.author.lastName} •{" "}
            <Typography variant="body2" color={"#7f8489"} ml={1}>
              {formatRelativeTime(post.updatedAt)}
            </Typography>
          </Typography>
        </Box>

        <PerfectScrollbar
          component="div"
          style={{
            flexGrow: 1,
            maxHeight: "60vh",
            paddingRight: "16px",
            overflowX: "hidden",
            marginTop: "60px",
            marginBottom: "40px",
          }}
        >
          <Box mb={3}>
            <Typography variant="body1">{post.content}</Typography>
          </Box>

          <Box mb={3} flexGrow={1} position="relative">
            {postComments?.map((comment, index) => (
              <Box
                key={index}
                mb={2}
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Avatar
                  src={getUserAvatarUrl(comment.author.account.avatar)}
                  alt="commenter avatar"
                />
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {comment.author.account.username}
                  </Typography>
                  <Typography variant="body2">
                    {readMoreStatus[index]
                      ? comment.content
                      : truncateContent(comment.content, 100)}
                    {comment.content.length > 100 && (
                      <Typography
                        component="span"
                        onClick={() => toggleReadMore(index)}
                        style={{
                          color: "gray",
                          cursor: "pointer",
                          marginLeft: "5px",
                        }}
                      >
                        {readMoreStatus[index] ? "Read Less" : "Read More"}
                      </Typography>
                    )}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </PerfectScrollbar>

        <Box
          component="form"
          noValidate
          autoComplete="off"
          display="flex"
          alignItems="center"
          onSubmit={handleCommentSubmit}
          p={1}
          borderTop={1}
          borderTopColor="grey.400"
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          bgcolor="background.paper"
        >
          <TextField
            name="comment"
            placeholder="Add a comment..."
            size="small"
            fullWidth
            value={comment}
            onChange={handleCommentChange}
          />
          <IconButton type="submit" sx={{ ml: 1 }} color="primary">
            <SendIcon />
          </IconButton>
        </Box>
      </Grid>
    </Grid>
  );
};

export default PostDetails;
