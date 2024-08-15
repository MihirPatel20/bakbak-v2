import React, { useEffect, useState, useCallback, useRef } from "react";
import { Box, CircularProgress, Grid, useMediaQuery } from "@mui/material";
import PostItem from "./PostItem";
import { useTheme } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserFeed } from "reducer/userFeed/userFeed.thunk";

const PostFeed = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

  const { posts, page, isLoading, hasNextPage } = useSelector(
    (state) => state.userFeed
  );

  const [isFetching, setIsFetching] = useState(false);

  const observer = useRef();
  const lastPostElementRef = useCallback(
    (node) => {
      if (isLoading || !hasNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          dispatch(fetchUserFeed({ page: page + 1, limit: 3 }));
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage, isFetching, dispatch, page]
  );

  useEffect(() => {
    dispatch(fetchUserFeed({ page: 1, limit: 3 }));
  }, [dispatch]);

  return (
    <Box
      sx={{
        maxWidth: "560px",
        px: matchDownSM ? 2 : 1,
      }}
    >
      {isLoading && page === 1 ? (
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
                key={post._id + index}
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
