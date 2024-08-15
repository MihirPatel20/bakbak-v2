import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Box,
  Card,
  CardMedia,
  Grid,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/system";
import api from "api";
import { getUserAvatarUrl } from "utils/getImageUrl";
import ImagePlaceholder from "ui-component/cards/Skeleton/ImagePlaceholder";
import { usePostDialog } from "context/PostDialogContext";

const ExplorePosts = () => {
  const { openDialog } = usePostDialog();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const observer = useRef();
  const lastPostElementRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isFetching) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, isFetching]
  );

  const getLimit = useCallback(() => {
    return matchDownSM ? 6 : 9;
  }, [matchDownSM]);

  const limit = getLimit();

  const fetchPosts = useCallback(
    async (pageNumber) => {
      setIsFetching(true);
      try {
        const response = await api.get(
          `/explore?page=${pageNumber}&limit=${limit}`
        );
        const fetchedPosts = response.data.data.posts.filter(
          (post) => post.images && post.images.length > 0
        );
        const { totalPages } = response.data.data;

        setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
        setHasMore(pageNumber < totalPages); // Ensure hasMore is set correctly
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsFetching(false);
      }
    },
    [limit]
  );

  useEffect(() => {
    fetchPosts(page);
  }, [fetchPosts, page]);

  if (posts.length === 0) {
    return (
      <Grid container spacing={2}>
        <ImagePlaceholder height={200} />
      </Grid>
    );
  }

  return (
    <Grid container spacing={2}>
      {posts.map((post, index) => (
        <ImageCard
          key={post._id}
          post={post}
          totalPosts={posts.length}
          index={index}
          lastPostElementRef={lastPostElementRef}
          openDialog={openDialog}
        />
      ))}
      {isFetching && (
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

export default ExplorePosts;

const ImageCard = ({
  post,
  index,
  lastPostElementRef,
  openDialog,
  totalPosts,
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchImageUrl = async (url) => {
    const defaultImage =
      "http://localhost:8080/images/image172327007458649446.jpg"; // replace with your default image URL

    try {
      const response = await fetch(url, { method: "HEAD" });
      if (response.ok) {
        return url; // Image URL is valid
      } else {
        return defaultImage; // Return default image if URL is not valid
      }
    } catch (error) {
      console.error("Image fetch error:", error);
      return defaultImage; // Return default image in case of an error
    }
  };

  useEffect(() => {
    const loadImage = async () => {
      const resolvedUrl = await fetchImageUrl(
        getUserAvatarUrl(post?.images[0])
      );
      setImageUrl(resolvedUrl);
      setLoading(false);
    };

    loadImage();
  }, [post.images, post._id]);

  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      ref={index === totalPosts - 1 ? lastPostElementRef : null}
    >
      <Card sx={{ borderRadius: 2 }}>
        {loading || !post?.images[0] ? (
          <ImagePlaceholder height={200} />
        ) : (
          <CardMedia
            component="img"
            image={imageUrl}
            alt={`Image for post ${post._id}`}
            onClick={() => openDialog(post._id)}
            style={{ height: "200px", objectFit: "cover" }}
          />
        )}
      </Card>
    </Grid>
  );
};
