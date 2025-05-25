import React, { useEffect } from "react";

// material-ui
import { useTheme, styled } from "@mui/material/styles";
import { blue, orange, yellow } from "@mui/material/colors";
import {
  Avatar,
  Box,
  Card,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@mui/material";

// redux imports
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markAsRead,
} from "@/reducer/notification/notification.thunk";

// assets
import { getUserAvatarUrl } from "utils/getImageUrl";
import { formatRelativeTime } from "utils/getRelativeTime";
import { useNavigate } from "react-router-dom";
import { NotificationTypes } from "constants";

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

const useChipStyles = () => {
  const theme = useTheme();
  const base = {
    height: 24,
    padding: "0 6px",
    marginRight: "5px",
  };
  return {
    info: {
      ...base,
      color: theme.palette.primary.dark,
      backgroundColor: blue[50],
    },
    warning: { ...base, color: orange[600], backgroundColor: yellow[50] },
    success: {
      ...base,
      color: theme.palette.success.dark,
      backgroundColor: theme.palette.success.light,
      height: 28,
    },
    error: {
      ...base,
      color: theme.palette.orange.dark,
      backgroundColor: theme.palette.orange.light,
    },
  };
};

// ==============================|| NOTIFICATION LIST ITEM ||============================== //
// [no change in import statements]

const NotificationList = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const chipSX = useChipStyles();

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
      await dispatch(markAsRead({ notificationId })).unwrap();
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const MessageNotification = ({ notification }) => {
    const url = `messages/direct/u/${notification.referenceId}`;
    const navigate = useNavigate();

    const handleClick = (event) => {
      // Mark as read if not already read
      if (!notification.isRead) {
        handleMarkAsRead(event, notification._id);
      }
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
            secondary={<Typography variant="caption">sent message</Typography>}
          />
          <ListItemSecondaryAction>
            <Typography variant="caption">
              {formatRelativeTime(notification.updatedAt)}
            </Typography>
          </ListItemSecondaryAction>
        </ListItem>

        <Grid container direction="column" className="list-container">
          <Grid
            item
            xs={12}
            mb={1}
            sx={{
              px: 2,
              py: 1,
              bgcolor: theme.palette.primary.light,
              borderRadius: 1,
              border: `1px solid ${theme.palette.grey[300]}`,
            }}
          >
            {notification.repetitionCount > 2 && (
              <Typography variant="caption">
                +{notification.repetitionCount - 2} messages
              </Typography>
            )}
            {notification?.preview?.map((message, index) => (
              <Typography key={index} variant="body2" color="textSecondary">
                {message}
              </Typography>
            ))}
          </Grid>
          <Grid item>
            <Chip label="reply" sx={chipSX.info} />
            <Chip
              label={notification.isRead ? "mark as unread" : "mark as read"}
              sx={chipSX.warning}
              onClick={(event) => handleMarkAsRead(event, notification._id)}
            />
          </Grid>
        </Grid>
      </ListItemWrapper>
    );
  };

  const LikeNotification = ({ notification }) => {
    return (
      <ListItemWrapper
        onClick={(event) => handleMarkAsRead(event, notification._id)}
      >
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
              <Typography variant="caption">liked your post</Typography>
            }
          />
          <ListItemSecondaryAction>
            <Typography variant="caption">
              {formatRelativeTime(notification.updatedAt)}
            </Typography>
          </ListItemSecondaryAction>
        </ListItem>

        <Grid container className="list-container">
          <Card sx={{ backgroundColor: theme.palette.primary.light }}>
            <Box p={1}>
              <img
                src={notification?.referenceDoc?.images?.[0]?.url}
                alt="notification-img"
                style={{ width: "100%", height: "100px", borderRadius: 8 }}
              />
            </Box>
          </Card>
        </Grid>
      </ListItemWrapper>
    );
  };

  const CommentNotification = ({ notification }) => (
    <ListItemWrapper>
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
            <Typography variant="caption">liked your comment</Typography>
          }
        />
        <ListItemSecondaryAction>
          <Typography variant="caption">
            {formatRelativeTime(notification.updatedAt)}
          </Typography>
        </ListItemSecondaryAction>
      </ListItem>

      <Grid container direction="column" className="list-container">
        <Grid
          item
          xs={12}
          mb={1}
          sx={{
            px: 2,
            py: 1,
            bgcolor: theme.palette.primary.light,
            borderRadius: 1,
            border: `1px solid ${theme.palette.grey[300]}`,
          }}
        >
          {notification?.preview?.map((comment, index) => (
            <Typography key={index} variant="body2" color="textSecondary">
              {comment}
            </Typography>
          ))}
        </Grid>
        <Grid item>
          <Chip label="reply" sx={chipSX.info} />
          <Chip
            label={notification.isRead ? "mark as unread" : "mark as read"}
            sx={chipSX.warning}
            onClick={(event) => handleMarkAsRead(event, notification._id)}
          />
        </Grid>
      </Grid>
    </ListItemWrapper>
  );

  const FollowNotification = ({ notification }) => {
    const navigate = useNavigate();

    const handleClick = (event) => {
      if (!notification.isRead) {
        handleMarkAsRead(event, notification._id);
      }
      navigate(`/u/${notification.sender.username}`);
    };

    return (
      <ListItemWrapper onClick={handleClick}>
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
              <Typography variant="caption">started following you</Typography>
            }
          />
          <ListItemSecondaryAction>
            <Typography variant="caption">
              {formatRelativeTime(notification.updatedAt)}
            </Typography>
          </ListItemSecondaryAction>
        </ListItem>
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
        notifications.map((notification, index) => (
          <React.Fragment key={notification.id || index}>
            {notification.type === NotificationTypes.MESSAGE && (
              <MessageNotification notification={notification} />
            )}
            {notification.type === NotificationTypes.LIKE_POST && (
              <LikeNotification notification={notification} />
            )}
            {notification.type === NotificationTypes.COMMENT && (
              <CommentNotification notification={notification} />
            )}
            {notification.type === NotificationTypes.FOLLOW_REQUEST && (
              <FollowNotification notification={notification} />
            )}

            {index < notifications.length - 1 && <Divider />}
          </React.Fragment>
        ))
      )}
    </List>
  );
};

export default NotificationList;
