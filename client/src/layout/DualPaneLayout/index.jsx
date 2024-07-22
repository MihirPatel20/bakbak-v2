import { Box, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { AppBarHeight } from "constants";

const withDualPaneLayout = (LeftPaneComponent, RightPaneComponent) => {
  return () => {
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
                ? `calc(100vh - ${AppBarHeight}px)`
                : `calc(100vh - ${AppBarHeight}px)`,
            }}
          >
            <LeftPaneComponent />
          </PerfectScrollbar>
        </Box>

        <Box
          sx={{
            display: "none", // Hide by default
            "@media (min-width:745px)": {
              display: "block", // Display as block on screens wider than 745px
            },
            flexGrow: 1,
            flexBasis: "300px",
            maxWidth: "300px",
          }}
        >
          <PerfectScrollbar
            component="div"
            style={{
              height: !matchUpMd
                ? `calc(100vh - ${AppBarHeight}px)`
                : `calc(100vh - ${AppBarHeight}px)`,
            }}
          >
            <RightPaneComponent />
          </PerfectScrollbar>
        </Box>
      </Box>
    );
  };
};

export default withDualPaneLayout;
