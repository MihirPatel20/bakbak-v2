import React, { useEffect, useState } from "react";

// material-ui
import { useTheme, styled } from "@mui/material/styles";
import { blue, orange, yellow } from "@mui/material/colors";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

// redux imports
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markAsRead,
} from "@/reducer/notification/notification.thunk";

// assets
import { IconPhoto } from "@tabler/icons-react";
import User1 from "assets/images/users/user-round.svg";
import { getUserAvatarUrl } from "utils/getImageUrl";
import { getRelativeTime } from "utils/getRelativeTime";
import { useNavigate } from "react-router-dom";

// styles
const ListItemWrapper = styled("div")(({ theme }) => ({
  cursor: "pointer",
  padding: 16,
  "&:hover": {
    background: theme.palette.primary.light,
  },
  "& .MuiListItem-root": {
    padding: 0,
  },
}));

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

const NotificationList = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const notifications = useSelector(
    (state) => state.notifications.notifications
  );

  // Fetch notifications on component mount
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Handle marking a notification as read
  const handleMarkAsRead = async (event, notificationId) => {
    event.stopPropagation();
    try {
      await dispatch(markAsRead(notificationId)).unwrap();
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const chipSX = {
    height: 24,
    padding: "0 6px",
  };
  const chipErrorSX = {
    ...chipSX,
    color: theme.palette.orange.dark,
    backgroundColor: theme.palette.orange.light,
    marginRight: "5px",
  };

  const chipWarningSX = {
    ...chipSX,
    color: orange[600],
    backgroundColor: yellow[50],
    marginRight: "5px",
    // border: `1px solid ${yellow[600]}`,
  };

  const chipSuccessSX = {
    ...chipSX,
    color: theme.palette.success.dark,
    backgroundColor: theme.palette.success.light,
    height: 28,
  };

  const chipInfoSX = {
    ...chipSX,
    color: theme.palette.primary.dark,
    // border: `1px solid ${theme.palette.primary[200]}`,
    backgroundColor: blue[50],
    marginRight: "5px",
  };

  const MessageNotification = ({ notification }) => {
    const url = `messages/direct/u/${notification.referenceId}`;

    const navigate = useNavigate();
    const handleClick = () => {
      navigate(url);
    };

    return (
      <ListItemWrapper key={notification._id} onClick={handleClick}>
        <ListItem alignItems="center">
          <ListItemAvatar>
            <Avatar
              alt={notification.sender.username}
              src={getUserAvatarUrl(notification.sender.avatar)}
            />
          </ListItemAvatar>
          <ListItemText
            primary={notification.sender.username}
            secondary={
              <Typography variant="caption" display="block">
                sent message
              </Typography>
            }
          />

          <ListItemSecondaryAction>
            <Grid container justifyContent="flex-end">
              <Grid item xs={12}>
                <Typography variant="caption" display="block" gutterBottom>
                  {getRelativeTime(notification.createdAt)}
                </Typography>
              </Grid>
            </Grid>
          </ListItemSecondaryAction>
        </ListItem>

        <Grid container direction="column" className="list-container">
          <Grid item xs={12} sx={{ pb: 2 }}>
            {notification.repetitionCount > 2 && (
              <Typography variant="caption" display="block">
                +{notification.repetitionCount - 2} messages
              </Typography>
            )}
            {notification?.preview?.map((message, index) => (
              <Typography key={index} variant="subtitle2">
                {message}
              </Typography>
            ))}
          </Grid>

          <Grid item xs={12}>
            <Grid container>
              <Grid item>
                <Chip label="reply" sx={chipInfoSX} />
              </Grid>
              <Grid item>
                <Chip
                  label={
                    notification.isRead ? "mark as unread" : "mark as read"
                  }
                  sx={chipWarningSX}
                  onClick={(event) => handleMarkAsRead(event, notification._id)}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </ListItemWrapper>
    );
  };

  const LikeNotification = ({ notification }) => {
    const senderUsername = notification.sender.username;
    // console.log("notification: ", notification);

    return (
      <ListItemWrapper>
        <ListItem alignItems="center">
          <ListItemAvatar>
            <Avatar
              alt={senderUsername}
              src={getUserAvatarUrl(notification.sender.avatar)}
            />
          </ListItemAvatar>
          <ListItemText
            primary={notification.sender.username}
            secondary={
              <Typography variant="caption" display="block">
                liked your post
              </Typography>
            }
          />

          <ListItemSecondaryAction>
            <Grid container justifyContent="flex-end">
              <Grid item xs={12}>
                <Typography variant="caption" display="block" gutterBottom>
                  {getRelativeTime(notification.createdAt)}
                </Typography>
              </Grid>
            </Grid>
          </ListItemSecondaryAction>
        </ListItem>

        <Grid container direction="column" className="list-container">
          <Card
            sx={{
              backgroundColor: theme.palette.primary.light,
            }}
          >
            <Box p={1}>
              <Stack direction="row">
                <img
                  src={notification.referenceId.images[0].url}
                  alt={`notification-img`}
                  style={{ width: "100%", height: "100px", borderRadius: 8 }}
                />
              </Stack>
            </Box>
          </Card>
        </Grid>
      </ListItemWrapper>
    );
  };

  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 330,
        py: 0,
        borderRadius: "10px",
        [theme.breakpoints.down("md")]: { maxWidth: 300 },
        "& .MuiListItemSecondaryAction-root": { top: 22 },
        "& .MuiDivider-root": { my: 0 },
        "& .list-container": { pl: 7 },
      }}
    >
      {notifications?.length === 0 ? (
        <Typography variant="subtitle1" sx={{ p: 2 }}>
          No notifications found
        </Typography>
      ) : (
        notifications?.map((notification, index) => (
          <React.Fragment key={notification.id || index}>
            {notification.type === "message" && (
              <MessageNotification notification={notification} />
            )}
            {notification.type === "like" && (
              <LikeNotification notification={notification} />
            )}
            {/* Render Divider for all but the last notification */}
            {index < notifications.length - 1 && <Divider />}
          </React.Fragment>
        ))
      )}
    </List>
  );
};

export default NotificationList;
