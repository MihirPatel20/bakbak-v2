import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import { logoutUser } from "reducer/auth/auth.thunk";

const NavBar = () => {
  const auth = useSelector((state) => state?.auth);
  const dispatch = useDispatch();
  // console.log("auth: ", auth);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    dispatch(logoutUser());
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Chat App
        </Typography>

        <Box display="flex" alignItems={"center"} gap={2}>
          <Typography variant="h6" component="div">
            {auth?.user?.username}
          </Typography>
          <Avatar
            alt={auth?.user?.username}
            src={auth?.user?.avatar?.url}
            onClick={handleClick}
          />
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
