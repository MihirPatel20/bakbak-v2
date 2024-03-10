import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Grid,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import ImageCarousel from "./ImageCarousel";
import PostIcons from "assets/tabler-icons/post-icons";

const PostItem = ({ post }) => {
  const theme = useTheme();

  const handleLikeClick = () => {
    // Handle like click action
  };

  const handleCommentClick = () => {
    // Handle comment click action
  };

  const handleShareClick = () => {
    // Handle share click action
  };

  const handleBookmarkClick = () => {
    // Handle bookmark click action
  };

  return (
    <Grid item xs={12}>
      <Card sx={{ bgcolor: theme.palette.primary.light }}>
        <CardContent sx={{ p: { xs: 2, lg: 2.5 } }}>
          <Box display="flex" alignItems="center" gap={2} mb={1}>
            <Avatar src={post.author.account.avatar.url} alt="author avatar" />
            <Typography variant="body2">
              Posted by {post.author.firstName} {post.author.lastName}
            </Typography>
          </Box>

          <ImageCarousel items={post.images} />

          <Box display="flex" alignItems="center" mb={1} gap={1}>
            {/* Like icon */}
            <PostIcons.Heart
              onClick={handleLikeClick}
              style={{ cursor: "pointer", strokeWidth: 1.5 }}
            />
            {/* <Typography variant="body2">{post.likes}</Typography> */}

            {/* Comment icon */}
            <PostIcons.MessageCircle
              onClick={handleCommentClick}
              style={{ cursor: "pointer", strokeWidth: 1.5 }}
            />

            {/* Share icon */}
            <PostIcons.Send
              onClick={handleShareClick}
              style={{ cursor: "pointer", strokeWidth: 1.5 }}
            />

            {/* Bookmark icon */}
            <PostIcons.Bookmark
              onClick={handleBookmarkClick}
              style={{ cursor: "pointer", strokeWidth: 1.5 }}
            />
          </Box>

          <Typography variant="body2" fontWeight={600}>
            {post.likes} likes
          </Typography>

          <Typography variant="body2" lineHeight={1.3}>
            <Typography component="span" mr={1} fontWeight={600}>
              {post.author.account.username}
            </Typography>
            {post.content}
          </Typography>

          <Typography variant="body2" color={"#7f8489"}>
            View all {post.comments} comments
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default PostItem;
