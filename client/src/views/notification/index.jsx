import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// material-ui
import { useTheme, styled } from "@mui/material/styles";
import { blue, orange, yellow } from "@mui/material/colors";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  ListItemSecondaryAction,
  Box,
  Chip,
  Divider,
  Grid,
  Stack,
  Container,
} from "@mui/material";

import { getUserAvatarUrl } from "utils/getImageUrl";
import { getRelativeTime } from "utils/getRelativeTime";
import fetchNotifications, {
  markAsRead,
} from "reducer/notification/notification.thunk";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, isLoading } = useSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    dispatch(fetchNotifications({ isRead: "true", page: 1, limit: 10 }));
  }, [dispatch]);

  const handleMarkAsRead = (notificationId) => {
    dispatch(markAsRead(notificationId));
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h3" sx={{ mb: 2 }} component="h1">
        Notifications
      </Typography>

      <List
        sx={{
          width: "100%",
          py: 0,
          borderRadius: "10px",
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
    </Container>
  );
};

export default Notifications;

// styles
const ListItemWrapper = styled("div")(({ theme }) => ({
  cursor: "pointer",
  padding: 16,
  "&:hover": {
    // background: theme.palette.primary.light,
  },
  "& .MuiListItem-root": {
    padding: 0,
  },
}));

const MessageNotification = ({ notification }) => {
  const theme = useTheme();
  const url = `/messages/direct/u/${notification.referenceId.chat}`;

  const navigate = useNavigate();
  const handleClick = () => {
    navigate(url);
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

      <Grid container direction="column" className="list-container" pl={7}>
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
                label={notification.isRead ? "mark as unread" : "mark as read"}
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

      <Grid
        container
        direction="column"
        className="list-container"
        pl={7}
        pt={1}
      >
        <Box width={200}>
          <Stack direction="row">
            <img
              src={notification.referenceId.images[0].url}
              alt={`notification-img`}
              style={{ width: "100%", height: "100px", borderRadius: 4 }}
            />
          </Stack>
        </Box>
      </Grid>
    </ListItemWrapper>
  );
};
