import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Card,
  CardMedia,
  CircularProgress,
  useMediaQuery,
  ImageList,
  ImageListItem,
} from "@mui/material";
import { useTheme } from "@mui/system";
import api from "api";
import ImagePlaceholder from "ui-component/cards/Skeleton/ImagePlaceholder";
import { usePostDialog } from "context/PostDialogContext";
import generateExploreGrid from "utils/helpers/generateExploreGrid";
import useLastElementObserver from "hooks/useLastElementObserver"; // Adjust the path as needed
import { getUserAvatarUrl } from "utils/getImageUrl";
import useFetchImageUrl from "hooks/useFetchImageUrl";

const ExplorePosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [gridConfig, setGridConfig] = useState([]);

  const { openDialog } = usePostDialog();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  // Use the custom hook to observe the last element
  const lastPostElementRef = useLastElementObserver(isLoading, hasMore, () =>
    setPage((prevPage) => prevPage + 1)
  );

  // Adjusting limit and cols based on screen size
  const limit = matchDownSM ? 6 : 9;
  const cols = matchDownSM ? 3 : 6;

  const fetchPosts = useCallback(
    async (pageNumber) => {
      setIsLoading(true);
      try {
        const response = await api.get(
          `/explore?page=${pageNumber}&limit=${limit}`
        );
        const fetchedPosts = response.data.data.posts.filter(
          (post) => post.images && post.images.length > 0
        );

        setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
        setHasMore(response.data.data.hasNextPage);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [limit]
  );

  useEffect(() => {
    fetchPosts(page);
  }, [fetchPosts, page]);

  useEffect(() => {
    // Initial grid configuration when the component mounts
    if (gridConfig.length < 1) {
      const { items } = generateExploreGrid(200, cols);
      setGridConfig(items);
    }

    // Update grid configuration incrementally by 200
    const thresholds = [200, 400, 600, 800, 1000]; // Add more thresholds as needed
    for (let threshold of thresholds) {
      if (posts.length > threshold && gridConfig.length < threshold) {
        const { items } = generateExploreGrid(threshold, cols);
        setGridConfig(items);
      }
    }
  }, [posts, matchDownSM]);

  if (posts.length === 0 && isLoading) {
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
            lastPostElementRef={lastPostElementRef}
            openDialog={openDialog}
            gridConfig={gridConfig}
          />
        ))}
      </ImageList>
      {isLoading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width={"100%"}
          my={4}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default ExplorePosts;

const ImageCard = ({
  post,
  index,
  lastPostElementRef,
  openDialog,
  totalPosts,
  gridConfig,
}) => {
  const { url, isLoading } = useFetchImageUrl(
    getUserAvatarUrl(post?.images[0])
  );

  return (
    <ImageListItem
      ref={index === totalPosts - 1 ? lastPostElementRef : null}
      cols={gridConfig[index]?.colSpan || 1}
      rows={gridConfig[index]?.rowSpan || 1}
      sx={{ borderRadius: "3px", overflow: "hidden" }}
    >
      {isLoading || !post?.images[0] ? (
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
