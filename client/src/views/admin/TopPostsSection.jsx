import React, { useState, useEffect, useRef, useCallback } from "react";

// MUI components
import { Typography, Box, Grid, IconButton } from "@mui/material";
import {
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import PostItem from "views/home/ActivityFeed/PostItem";
import api from "api";

const TopPostsSection = () => {
  const [topPosts, setTopPosts] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const sectionRef = useRef(null);

  const fetchTopPosts = async () => {
    try {
      const response = await api.get(`/admin/top-posts`);
      setTopPosts(response.data.data);
    } catch (error) {
      console.error("Failed to fetch top posts:", error);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          fetchTopPosts();
          setHasLoaded(true);
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [fetchTopPosts, hasLoaded]);

  return (
    <Box ref={sectionRef} mt={8}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        position="relative"
        mb={2}
      >
        <Typography variant="h2" gutterBottom>
          Top Posts
        </Typography>
        <IconButton
          onClick={fetchTopPosts}
          color="primary"
          sx={{ position: "absolute", right: 0 }}
        >
          <RefreshIcon />
        </IconButton>
      </Box>

      <Grid container spacing={2}>
        {topPosts?.map((post) => (
          <Grid key={post._id} item xs={12} sm={6} md={4}>
            <PostItem post={post} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TopPostsSection;
