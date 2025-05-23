import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Grid, useMediaQuery } from "@mui/material";
import PostItem from "./PostItem";
import { useTheme } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserFeed } from "reducer/userFeed/userFeed.thunk";
import useLastElementObserver from "hooks/useLastElementObserver";

const PostFeed = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

  const { posts, page, isLoading, hasNextPage, error } = useSelector(
    (state) => state.userFeed
  );

  const lastPostElementRef = useLastElementObserver(
    isLoading,
    hasNextPage,
    () => {
      dispatch(fetchUserFeed({ page: page + 1, limit: 3 }));
    }
  );

  useEffect(() => {
    dispatch(fetchUserFeed({ page: 1, limit: 3 }));
  }, [dispatch]);

  return (
    <Box
      sx={{
        maxWidth: "560px",
        paddingLeft: matchDownSM ? "16px" : "8px",
        paddingRight: matchDownSM ? "16px" : "8px",
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
      ) : error ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width={"100%"}
          my={4}
        >
          <Typography color="error">Failed to load posts</Typography>
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
          {isLoading && page > 1 && (
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
