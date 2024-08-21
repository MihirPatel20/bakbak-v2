import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Box,
  CardMedia,
  CircularProgress,
  useMediaQuery,
  ImageList,
  ImageListItem,
} from "@mui/material";
import { useTheme } from "@mui/system";
import { getUserAvatarUrl } from "utils/getImageUrl";
import ImagePlaceholder from "ui-component/cards/Skeleton/ImagePlaceholder";
import { usePostDialog } from "context/PostDialogContext";
import generateExploreGrid from "utils/helpers/generateExploreGrid";
import useFetchImageUrl from "hooks/useFetchImageUrl";

const ExplorePosts = ({ posts }) => {
  const { openDialog } = usePostDialog();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  // Adjusting cols based on screen size
  const cols = matchDownSM ? 3 : 4;

  if (posts.length === 0) {
    return (
      <ImageList cols={cols} gap={8}>
        <ImagePlaceholder height={200} />
      </ImageList>
    );
  }

  return (
    <Box>
      <ImageList
        variant=""
        cols={cols}
        gap={4}
        rowHeight={matchDownSM ? 100 : 200}
      >
        {posts.map((post, index) => (
          <ImageCard
            key={post._id}
            post={post}
            index={index}
            totalPosts={posts.length}
            openDialog={openDialog}
          />
        ))}
      </ImageList>
    </Box>
  );
};

export default ExplorePosts;

const ImageCard = ({ post, index, openDialog, totalPosts }) => {
  const { url, isLoading } = useFetchImageUrl(
    getUserAvatarUrl(post?.images[0])
  );

  return (
    <ImageListItem
      cols={1}
      rows={1}
      sx={{ borderRadius: "3px", overflow: "hidden" }}
    >
      {isLoading ? (
        <ImagePlaceholder height={200} />
      ) : (
        <CardMedia
          component="img"
          image={url}
          alt={`Image for post ${post._id}`}
          onClick={() => openDialog(post._id)}
          style={{ height: "100%", width: "100%", objectFit: "cover" }}
          loading="lazy"
        />
      )}
    </ImageListItem>
  );
};
