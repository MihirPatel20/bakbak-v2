import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Grid } from "@mui/material";
import api from "api"; // Assuming you have an API utility file
import PostItem from "./PostItem";

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("post");
        setPosts(response.data.data.posts);
        console.log("Posts:", response.data.data.posts[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Box sx={{ maxWidth: "560px", pr: "4px" }}>
      {loading ? (
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
          {posts.map((post) => (
            <PostItem key={post._id} post={post} />
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PostFeed;
