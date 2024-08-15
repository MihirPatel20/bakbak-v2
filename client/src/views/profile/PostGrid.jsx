import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  Box,
  Typography,
  CircularProgress,
  Skeleton,
} from "@mui/material";

import { usePostDialog } from "context/PostDialogContext";
import api from "api";
import { getUserAvatarUrl } from "utils/getImageUrl";
import ImagePlaceholder from "ui-component/cards/Skeleton/ImagePlaceholder";

const PostGrid = ({ currentProfileUsername }) => {
  const { openDialog } = usePostDialog();

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const defaultImage = "https://example.com/default-image.png"; // Your default image URL

  const observer = useRef();
  const lastPostElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, isFetching]
  );

  const fetchPosts = useCallback(async () => {
    setIsFetching(true);
    try {
      const response = await api.get(`post/u/${currentProfileUsername}`, {
        params: { page, limit: 3 },
      });
      const fetchedPosts = response.data.data.posts;
      setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
      setHasMore(response.data.data.hasNextPage);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsFetching(false);
    }
  }, [currentProfileUsername, page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <Grid container spacing={2}>
      {posts.length > 0 ? (
        posts.map((post, index) => {
          if (!post?.images[0]) return null;

          let imageSrc = getUserAvatarUrl(post.images[0]);

          return (
            <ImageCard
              key={post._id}
              posts={posts}
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

export default PostGrid;

const ImageCard = ({ posts, post, index, lastPostElementRef, openDialog }) => {
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
      const resolvedUrl = await fetchImageUrl(getUserAvatarUrl(post.images[0]));
      setImageUrl(resolvedUrl);
      setLoading(false);
    };

    loadImage();
  }, [post.images, post._id]);

  return (
    <Grid
      key={post._id}
      item
      xs={12}
      sm={6}
      md={4}
      ref={index === posts.length - 1 ? lastPostElementRef : null}
    >
      <Card>
        {loading ? (
          <ImagePlaceholder height={200} />
        ) : (
          <CardMedia
            component="img"
            image={imageUrl}
            alt={`Image for post ${post._id}`}
            onClick={() => openDialog(post._id)}
            style={{ height: "200px", objectFit: "cover" }} // Adjust style as needed
          />
        )}
      </Card>
    </Grid>
  );
};
