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
    <Grid container spacing={2}>
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
  const { url, isLoading } = useFetchImageUrl(
    getUserAvatarUrl(post?.images[0])
  );

  return (
    <Grid
      key={post._id}
      item
      xs={12}
      sm={6}
      md={4}
      ref={index === totalPosts - 1 ? lastPostElementRef : null}
    >
      <Card>
        {isLoading ? (
          <ImagePlaceholder height={200} />
        ) : (
          <CardMedia
            component="img"
            image={url}
            alt={`Image for post ${post._id}`}
            onClick={() => openDialog(post._id)}
            style={{ height: "200px", objectFit: "cover" }} // Adjust style as needed
          />
        )}
      </Card>
    </Grid>
  );
};
