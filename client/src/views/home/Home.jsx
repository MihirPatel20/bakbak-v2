import { Box, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import ActivityFeed from "./ActivityFeed";
import ActiveUsers from "./ActiveUsers";
import PerfectScrollbar from "react-perfect-scrollbar";
import { AppBarHeight } from "constants";

const Home = () => {
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box
      sx={{
        display: "flex",
        gap: "12px",
        height: "100%",
        width: "100%",
      }}
    >
      <Box sx={{ flexGrow: 4 }}>
        <PerfectScrollbar
          component="div"
          style={{
            display: "flex",
            justifyContent: "center",
            height: !matchUpMd
              ? "calc(100vh - 56px)"
              : `calc(100vh - ${AppBarHeight}px)`,
          }}
        >
          <ActivityFeed />
        </PerfectScrollbar>
      </Box>

      <Box
        sx={{
          display: { xs: "none", sm: "block" },
          flexGrow: 1,
          flexBasis: "300px",
          maxWidth: "300px",
        }}
      >
        <PerfectScrollbar
          component="div"
          style={{
            height: !matchUpMd
              ? "calc(100vh - 56px)"
              : `calc(100vh - ${AppBarHeight}px)`,
          }}
        >
          <ActiveUsers />
        </PerfectScrollbar>
      </Box>
    </Box>
  );
};

export default Home;
