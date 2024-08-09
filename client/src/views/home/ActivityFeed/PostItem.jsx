import React, { forwardRef, useState } from "react";
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
import { getUserAvatarUrl } from "utils/getImageUrl";
import { useDispatch } from "react-redux";
import { likePost, bookmarkPost } from "reducer/userFeed/userFeed.thunk";

const PostItem = forwardRef(({ post }, ref) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => setIsReadMore(!isReadMore);

  const truncateContent = (content, limit) => {
    if (content.length <= limit) return content;
    return content.substring(0, limit) + "...";
  };

  const contentLimit = 120; // Set the character limit for truncation

  const handleLikeClick = async () => {
    try {
      // Dispatch likePost thunk
      await dispatch(likePost(post._id));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleCommentClick = () => {
    // Handle comment click action
  };

  const handleShareClick = () => {
    // Handle share click action
  };

  const handleBookmarkClick = async () => {
    try {
      // Dispatch bookmarkPost thunk
      await dispatch(bookmarkPost(post._id));
    } catch (error) {
      console.error("Error bookmarking post:", error);
    }
  };

  return (
    <Grid item xs={12} ref={ref}>
      <Card sx={{ bgcolor: theme.palette.primary.light }}>
        <CardContent sx={{ p: { xs: 2, lg: 2.5 } }}>
          <Box display="flex" alignItems="center" gap={2} mb={1}>
            <Avatar
              src={getUserAvatarUrl(post.author.account.avatar)}
              alt="author avatar"
            />
            <Typography variant="body2">
              Posted by {post.author.firstName} {post.author.lastName}
            </Typography>
          </Box>

          <ImageCarousel items={post.images} />

          <Box display="flex" alignItems="center" mb={1} gap={1}>
            {/* Like icon */}
            <PostIcons.Heart
              onClick={handleLikeClick}
              size={28}
              style={{
                cursor: "pointer",
                strokeWidth: 1.5,
                fill: post.isLiked ? "red" : "none",
                color: post.isLiked ? "red" : "black",
              }}
            />

            {/* Comment icon */}
            <PostIcons.MessageCircle
              onClick={handleCommentClick}
              size={28}
              style={{ cursor: "pointer", strokeWidth: 1.5 }}
            />

            {/* Share icon */}
            <PostIcons.Send
              onClick={handleShareClick}
              size={28}
              style={{ cursor: "pointer", strokeWidth: 1.5 }}
            />

            {/* Bookmark icon */}
            <PostIcons.Bookmark
              onClick={handleBookmarkClick}
              size={28}
              style={{
                cursor: "pointer",
                strokeWidth: 1.5,
                fill: post.isBookmarked ? "gray" : "none",
                color: post.isBookmarked ? "gray" : "black",
              }}
            />
          </Box>

          <Typography variant="body2" fontWeight={600}>
            {post.likes} likes
          </Typography>

          <Typography variant="body2" lineHeight={1.3}>
            <Typography component="span" mr={1} fontWeight={600}>
              {post.author.account.username}
            </Typography>
            {isReadMore
              ? truncateContent(post.content, contentLimit)
              : post.content}
            {post.content.length > contentLimit && (
              <Typography
                component="span"
                onClick={toggleReadMore}
                style={{ color: "gray", cursor: "pointer", marginLeft: "5px" }}
              >
                {isReadMore ? "Read More" : "Read Less"}
              </Typography>
            )}
          </Typography>

          <Typography variant="body2" color={"#7f8489"}>
            View all {post.comments} comments
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
});

export default PostItem;
