import React, { forwardRef, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Grid,
  Card,
  CardContent,
  useTheme,
  Button,
} from "@mui/material";
import ImageCarousel from "./ImageCarousel";
import PostIcons from "assets/tabler-icons/post-icons";
import { getUserAvatarUrl } from "utils/getImageUrl";

const PostItem = forwardRef(({ post }, ref) => {
  const theme = useTheme();

  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => setIsReadMore(!isReadMore);

  const truncateContent = (content, limit) => {
    if (content.length <= limit) return content;
    return content.substring(0, limit) + "...";
  };

  const contentLimit = 120; // Set the character limit for truncation

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
            {isReadMore
              ? truncateContent(post.content, contentLimit)
              : post.content}
            {post.content.length > contentLimit && (
              <Typography
              component="span"
              onClick={toggleReadMore}
              style={{ color: 'gray', cursor: 'pointer', marginLeft: '5px' }}
            >
              {isReadMore ? 'Read More' : 'Read Less'}
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
