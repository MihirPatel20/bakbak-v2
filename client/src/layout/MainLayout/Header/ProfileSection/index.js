import { useState, useRef, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  ClickAwayListener,
  Divider,
  Grid,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  Paper,
  Popper,
  Stack,
  Switch,
  Typography,
  useMediaQuery,
} from "@mui/material";

// third-party
import PerfectScrollbar from "react-perfect-scrollbar";

// project imports
import MainCard from "ui-component/cards/MainCard";
import Transitions from "ui-component/extended/Transitions";
import UpgradePlanCard from "./UpgradePlanCard";

// assets
import {
  IconLogout,
  IconSearch,
  IconSettings,
  IconUserCircle,
  IconUsers,
} from "@tabler/icons-react";
import { getUserAvatarUrl } from "utils/getImageUrl";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import { AppBarHeight } from "constants";
import useAuth from "hooks/useAuth";
import PreferencesCard from "./PreferencesCard";
import ProfileMenuList from "./ProfileMenuList";

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down("md"));
  const customization = useSelector((state) => state.customization);
  const { auth, logout } = useAuth();

  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListItemClick = (event, index, route = "") => {
    setSelectedIndex(index);
    handleClose(event);

    if (route && route !== "") {
      navigate(route);
    }
  };
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const greetingsPool = [
    "What's the gossip today? 👀",
    "Back on the BakBak grind 🔄",
    "Let's catch up with the crew 🧑‍🤝‍🧑",
    "Got something to share?",
    "Time to stir the pot... 🔥",
    "The timeline missed you!",
    "Bored? Let's bakbak! 🎤",
    "Welcome back, legend. 😎",
    "It's bakbak o'clock 🕐",
    "Feeling chatty today?",
  ];

  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const randomGreeting =
      greetingsPool[Math.floor(Math.random() * greetingsPool.length)];
    setGreeting(randomGreeting);
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: "4px",
          alignItems: "center",
          borderRadius: "50px",
          transition: "all .2s ease-in-out",
          borderColor: theme.palette.primary.light,
          backgroundColor: theme.palette.primary.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: `${theme.palette.primary.main}!important`,
            color: theme.palette.primary.light,
            "& svg": {
              stroke: theme.palette.primary.light,
            },
          },
        }}
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        color="inherit"
        onClick={handleToggle}
      >
        <Avatar
          src={getUserAvatarUrl(auth?.user?.avatar)}
          sx={{
            ...theme.typography.mediumAvatar,
            // margin: "8px 0 8px 8px !important",
            cursor: "pointer",
          }}
        />
      </Box>

      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 14],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions
            position={matchesXs ? "top" : "top-right"}
            in={open}
            {...TransitionProps}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  border={false}
                  elevation={16}
                  content={false}
                  boxShadow
                  shadow={theme.shadows[16]}
                >
                  <Box sx={{ p: 2, pb: 0 }}>
                    <Stack p={1}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="h4">Welcome Back,</Typography>
                        <Typography component="span" variant="h4">
                          {auth?.user?.username}
                        </Typography>
                      </Stack>
                      <Typography variant="subtitle2">
                        The timeline missed you!
                      </Typography>
                    </Stack>

                    {/* <OutlinedInput
                      sx={{ width: "100%", pr: 1, pl: 2, my: 2 }}
                      id="input-search-profile"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Search profile options"
                      startAdornment={
                        <InputAdornment position="start">
                          <IconSearch
                            stroke={1.5}
                            size="1rem"
                            color={theme.palette.grey[500]}
                          />
                        </InputAdornment>
                      }
                      aria-describedby="search-helper-text"
                      inputProps={{
                        "aria-label": "weight",
                      }}
                    /> 
                    */}
                    <Divider />
                  </Box>

                  <PerfectScrollbar
                    style={{
                      height: "100%",
                      height: `calc(100vh - ${AppBarHeight * 4}px)`,
                      overflowX: "hidden",
                    }}
                  >
                    <Box sx={{ p: 2, pt: 0 }}>
                      <ProfileMenuList
                        selectedIndex={selectedIndex}
                        handleClick={handleListItemClick}
                      />
                      <Divider />

                      <PreferencesCard />
                      <Divider />

                      <List
                        component="nav"
                        sx={{
                          width: "100%",
                          maxWidth: 350,
                          minWidth: 300,
                          borderRadius: "10px",
                          [theme.breakpoints.down("md")]: {
                            minWidth: "100%",
                          },
                        }}
                      >
                        <ListItemButton
                          sx={{
                            borderRadius: `${customization.borderRadius}px`,
                            backgroundColor: theme.palette.error[50],
                            "&:hover": {
                              backgroundColor: theme.palette.error[100],
                              "& .MuiListItemIcon-root": {
                                color: theme.palette.error.main,
                              },
                            },
                          }}
                          selected={selectedIndex === 4}
                          onClick={logout}
                        >
                          <ListItemIcon
                            sx={{
                              "&:hover": {
                                backgroundColor: theme.palette.error[100],
                                color: theme.palette.error.dark,
                              },
                            }}
                          >
                            <IconLogout stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body2">Logout</Typography>
                            }
                          />
                        </ListItemButton>
                      </List>
                      {/* <Divider />
                      
                       <UpgradePlanCard /> */}
                    </Box>
                  </PerfectScrollbar>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
