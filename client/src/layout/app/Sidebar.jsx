// Desc: Sidebar component for the application layout

// Dependencies
import React from "react";
import { useNavigate } from "react-router-dom";

// UI and Styling imports
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

// Component imports
import { drawerWidth } from "@/constants";
import BakbakLogo from "components/global/BakbakLogo";
import dashboardRoutes from "@/routes/dashboardRoutes";
import authenticationRoutes from "@/routes/authenticationRoutes";

const Sidebar = ({
  mobileOpen,
  handleDrawerTransitionEnd,
  handleDrawerClose,
}) => {
  const navigate = useNavigate();

  const drawer = (
    <div>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* <BakbakLogo sx={{ fontSize: "2rem" }} /> */}
      </Toolbar>
      <Divider />
      <List>
        {dashboardRoutes.map((route) => (
          <ListItem key={route.key} disablePadding>
            <ListItemButton onClick={() => navigate(route.path)}>
              <ListItemIcon>{route.icon}</ListItemIcon>
              <ListItemText primary={route.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        {authenticationRoutes.map((route) => (
          <ListItem key={route.key} disablePadding>
            <ListItemButton>
              <ListItemIcon>{route.icon}</ListItemIcon>
              <ListItemText primary={route.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
