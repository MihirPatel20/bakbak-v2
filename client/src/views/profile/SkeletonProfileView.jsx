import { Box, Container, Divider, Grid, Skeleton } from "@mui/material";
import React from "react";

const SkeletonProfileView = () => {
  return (
    <Container sx={{ px: 2 }}>
      <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
      <Grid container spacing={2} direction="column" alignItems="center">
        <Skeleton variant="circular" width={150} height={150} />
        <Skeleton
          variant="rectangular"
          width={120}
          height={36}
          sx={{ mt: 2 }}
        />
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="text" width={140} />
        <Skeleton variant="text" width={250} />
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        {[...Array(3)].map((_, idx) => (
          <Grid item xs={4} key={idx} sx={{ textAlign: "center" }}>
            <Skeleton
              variant="text"
              width={60}
              height={32}
              sx={{ mx: "auto" }}
            />
            <Skeleton
              variant="text"
              width={80}
              height={20}
              sx={{ mx: "auto" }}
            />
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Box mb={4}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ m: 2 }}
        >
          <Skeleton variant="text" width={100} height={40} />
        </Box>
        <Grid container spacing={2}>
          {[...Array(6)].map((_, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default SkeletonProfileView;
