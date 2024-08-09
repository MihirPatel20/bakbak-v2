import React, { useEffect, useState, useCallback, useRef } from "react";
import { Box, CircularProgress, Grid, useMediaQuery } from "@mui/material";
import api from "api";
import PostItem from "./PostItem";
import { useTheme } from "@emotion/react";

const PostFeed = () => {
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
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, isFetching]
  );

  const fetchPosts = useCallback(async (pageNumber) => {
    setIsFetching(true);
    try {
      const response = await api.get(`post/feed?page=${pageNumber}&limit=3`);
      console.log("response: ", response)
      const fetchedPosts = response.data.data.posts;
      setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
      setHasMore(response.data.data.hasNextPage);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(page);
  }, [fetchPosts, page]);
  
  return (
    <Box
      sx={{
        maxWidth: "560px",
        px: matchDownSM ? 2 : 1,
      }}
    >
      {loading && page === 1 ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={"100%"}
          my={4}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <PostItem
                key={post._id}
                post={post}
                ref={index === posts.length - 1 ? lastPostElementRef : null}
              />
            ))
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
      )}
    </Box>
  );
};

export default PostFeed;
