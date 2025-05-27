import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  CardActions,
  Badge,
  ClickAwayListener,
  Divider,
  Grid,
  Paper,
  Popper,
  Stack,
  TextField,
  List,
  Typography,
  useMediaQuery,
} from "@mui/material";

// third-party
import PerfectScrollbar from "react-perfect-scrollbar";

// project imports
import MainCard from "ui-component/cards/MainCard";
import Transitions from "ui-component/extended/Transitions";

// redux imports
import { useDispatch, useSelector } from "react-redux";
import fetchNotifications, {
  markAllAsRead,
} from "reducer/notification/notification.thunk";

// assets
import { IconBell } from "@tabler/icons-react";
import NotificationList from "./NotificationList";

// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = () => {
  const dispatch = useDispatch();
  const anchorRef = useRef(null);
  const { notifications, totalCount: notificationsCount } = useSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = useState(false);
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const handleMarkAllAsRead = async () => {
    try {
      await dispatch(markAllAsRead()).unwrap();
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  return (
    <>
      <Box
        sx={{
          [theme.breakpoints.down("md")]: { mr: 0 },
        }}
      >
        <ButtonBase sx={{ borderRadius: "12px" }}>
          <Badge
            badgeContent={notificationsCount}
            color="secondary"
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Avatar
              variant="rounded"
              sx={{
                ...theme.typography.commonAvatar,
                ...theme.typography.mediumAvatar,
                transition: "all .2s ease-in-out",
                background: theme.palette.primary.light,
                color: theme.palette.primary.dark,
                '&[aria-controls="menu-list-grow"],&:hover': {
                  background: theme.palette.primary.dark,
                  color: theme.palette.primary.light,
                },
              }}
              ref={anchorRef}
              aria-controls={open ? "menu-list-grow" : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
              color="inherit"
            >
              <IconBell stroke={1.5} size="1.3rem" />
            </Avatar>
          </Badge>
        </ButtonBase>
      </Box>
      <Popper
        placement={matchesXs ? "bottom" : "bottom-end"}
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
                offset: [matchesXs ? 5 : 0, 20],
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
                  <Grid container direction="column" spacing={2}>
                    <Grid item xs={12}>
                      <Grid
                        container
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ pt: 2, px: 2 }}
                      >
                        <Grid item>
                          <Stack direction="row" spacing={2}>
                            <Typography variant="subtitle1">
                              Notifications
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid item>
                          <Typography
                            component={Link}
                            to="#"
                            variant="subtitle2"
                            color="primary"
                            onClick={handleMarkAllAsRead}
                            sx={{ textDecoration: "none" }}
                          >
                            Mark all as read
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                      <PerfectScrollbar
                        style={{
                          height: "100%",
                          maxHeight: "calc(100vh - 205px)",
                          minWidth: "300px",
                          // overflowX: "hidden",
                        }}
                      >
                        <List
                          sx={{
                            width: "100%",
                            maxWidth: 330,
                            py: 0,
                            borderRadius: "10px",
                            [theme.breakpoints.down("md")]: { maxWidth: 300 },
                            "& .MuiListItemSecondaryAction-root": { top: 22 },
                            "& .MuiDivider-root": { my: 0 },
                            "& .list-container": { pl: 5 },
                          }}
                        >
                          {notifications?.length === 0 ? (
                            <ListItemWrapper>
                              <ListItem alignItems="center">
                                <Typography
                                  variant="subtitle1"
                                  width={"325px"}
                                  textAlign="center"
                                  sx={{ color: theme.palette.grey[500] }}
                                >
                                  You're all caught up! No new notifications.
                                </Typography>
                              </ListItem>
                            </ListItemWrapper>
                          ) : (
                            notifications.map((notif, i) => (
                              <React.Fragment key={notif._id || i}>
                                <NotificationList notification={notif} />
                                {i < notifications.length - 1 && <Divider />}
                              </React.Fragment>
                            ))
                          )}
                        </List>
                      </PerfectScrollbar>
                    </Grid>
                  </Grid>
                  <Divider />
                  <CardActions sx={{ p: 1.25, justifyContent: "center" }}>
                    <Button size="small" disableElevation>
                      View All
                    </Button>
                  </CardActions>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default NotificationSection;
