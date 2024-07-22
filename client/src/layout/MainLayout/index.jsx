import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

// material-ui
import { styled, useTheme } from "@mui/material/styles";
import {
  AppBar,
  Box,
  CssBaseline,
  Toolbar,
  useMediaQuery,
} from "@mui/material";

// project imports
import Header from "./Header";
import Sidebar from "./Sidebar";
import { SET_MENU } from "reducer/customization/actions";
import { drawerWidth } from "reducer/customization/constant";
import useSocketDispatch from "hooks/useSocketDispatch";
import { fetchNotifications } from "reducer/notification/notification.thunk";
import PerfectScrollbar from "react-perfect-scrollbar";
import { AppBarHeight } from "constants";

// assets

// styles
const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "theme",
})(({ theme, open }) => ({
  ...theme.typography.mainContent,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  transition: theme.transitions.create(
    "margin",
    open
      ? {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }
      : {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }
  ),
  [theme.breakpoints.up("md")]: {
    paddingLeft: open ? 0 : -(drawerWidth - 20),
    width: `calc(100% - ${drawerWidth}px)`,
  },
  [theme.breakpoints.down("md")]: {
    // paddingLeft: "20px",
    width: `calc(100% - ${drawerWidth}px)`,
    // padding: "16px",
  },
  [theme.breakpoints.down("sm")]: {
    paddingLeft: "0px",
    width: `calc(100% - ${drawerWidth}px)`,
    // padding: "16px",
    paddingRight: "0px",
  },
}));

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));
  const matchUpMd = useMediaQuery(theme.breakpoints.up("md"));
  // Handle left drawer
  const leftDrawerOpened = useSelector((state) => state.customization.opened);
  const handleLeftDrawerToggle = () => {
    dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
  };

  // Use the socket dispatch hook only when user data is available
  useSocketDispatch();

  // Fetch notifications on component mount
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* header */}
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.default,
          transition: leftDrawerOpened
            ? theme.transitions.create("width")
            : "none",
        }}
      >
        <Toolbar sx={{ gap: { xs: 1, md: 2 }, px: { md: 2 } }}>
          <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
        </Toolbar>
      </AppBar>

      {/* drawer */}
      <Sidebar
        drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened}
        drawerToggle={handleLeftDrawerToggle}
      />

      {/* main content */}
      <Main theme={theme} open={leftDrawerOpened}>
        <PerfectScrollbar
          component="div"
          style={{
            height: !matchUpMd
              ? `calc(100vh - ${AppBarHeight}px)`
              : `calc(100vh - ${AppBarHeight}px)`,
          }}
        >
          <Outlet />
        </PerfectScrollbar>
      </Main>
    </Box>
  );
};

export default MainLayout;
