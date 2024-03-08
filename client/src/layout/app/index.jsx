// Desc: App layout component

// Dependencies
import React from "react";
import { Outlet } from "react-router-dom";

// UI and styling imports
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

// Component imports
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { drawerWidth } from "@/constants";

// App layout component
const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar handleDrawerToggle={handleDrawerToggle} />

      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerTransitionEnd={handleDrawerTransitionEnd}
        handleDrawerClose={handleDrawerClose}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;
