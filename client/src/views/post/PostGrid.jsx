import React, { useCallback, useEffect, useState } from "react";
import { Grid, Card, CardMedia, Box, CircularProgress } from "@mui/material";
import { usePostDialog } from "context/PostDialogContext";
import api from "api";
import { getUserAvatarUrl } from "utils/getImageUrl";
import ImagePlaceholder from "ui-component/cards/Skeleton/ImagePlaceholder";
import useLastElementObserver from "hooks/useLastElementObserver";
import useFetchImageUrl from "hooks/useFetchImageUrl";

const PostGrid = ({ currentProfileUsername }) => {
  const { openDialog } = usePostDialog();

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`post/u/${currentProfileUsername}`, {
        params: { page, limit: 3 },
      });
      const fetchedPosts = response.data.data.posts;
      setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
      setHasMore(response.data.data.hasNextPage);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentProfileUsername, page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoading, hasMore]);

  const lastPostElementRef = useLastElementObserver(
    isLoading,
    hasMore,
    loadMore
  );

  return (
    <Grid container spacing={{ xs: 0.5, sm: 2 }}>
      {posts.length > 0 ? (
        posts.map((post, index) => {
          if (!post?.images[0]) return null;

          return (
            <ImageCard
              key={post._id}
              totalPosts={posts.length}
              post={post}
              index={index}
              lastPostElementRef={lastPostElementRef}
              openDialog={openDialog}
            />
          );
        })
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width={"100%"}
          my={4}
        >
          No posts available
        </Box>
      )}

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
    </Grid>
  );
};

export default PostGrid;

const ImageCard = ({
  post,
  totalPosts,
  index,
  lastPostElementRef,
  openDialog,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imageUrl = getUserAvatarUrl(post?.images[0]);
  const fallbackUrl =
    "http://localhost:8080/images/default/placeholder-image.jpg"; // or whatever you want

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const finalUrl = hasError ? fallbackUrl : imageUrl;

  return (
    <Grid
      key={post._id}
      item
      xs={6}
      md={4}
      ref={index === totalPosts - 1 ? lastPostElementRef : null}
      sx={{ cursor: "pointer" }}
    >
      <Card sx={{ borderRadius: 1 }}>
        {isLoading && (
          <ImagePlaceholder sx={{ height: { xs: 120, sm: 200 } }} />
        )}
        <CardMedia
          component="img"
          image={finalUrl}
          alt={`Image for post ${post._id}`}
          onLoad={handleLoad}
          onError={handleError}
          onClick={() => openDialog(post._id)}
          sx={{
            height: { xs: 120, sm: 200 },
            objectFit: "cover",
            display: isLoading ? "none" : "block",
          }}
        />
      </Card>
    </Grid>
  );
};
