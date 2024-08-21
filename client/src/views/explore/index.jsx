import { useState, useEffect } from "react";
import { useTheme } from "@emotion/react";
import { Container, Typography, useMediaQuery } from "@mui/material";
import ExplorePosts from "./ExplorePosts";
import ExploreProfiles from "./ExploreProfiles";

const ExplorePage = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container sx={{ mb: matchDownSM ? 2 : 4 }}>
      <Typography variant="h4" fontWeight={200} component="h1" mb={3}>
        Explore
      </Typography>

      {/* <ExplorePosts /> */}
      <ExploreProfiles />
    </Container>
  );
};

export default ExplorePage;
