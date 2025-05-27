import React, { useMemo } from "react";
import {
  Avatar,
  Box,
  Card,
  Chip,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import { getUserAvatarUrl } from "utils/getImageUrl";
import { blue, orange, yellow } from "@mui/material/colors";
import { formatRelativeTime } from "utils/getRelativeTime";
import { NotificationTypes } from "constants";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { markAsRead } from "reducer/notification/notification.thunk";

// ==============================|| STYLES ||============================== //
const ListItemWrapper = styled("div")(({ theme }) => ({
  cursor: "pointer",
  padding: 16,
  "&:hover": { background: theme.palette.primary.light },
  "& .MuiListItem-root": { padding: 0 },
}));

const useChipStyles = () => {
  const theme = useTheme();
  return useMemo(() => {
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
      warning: {
        ...base,
        color: orange[600],
        backgroundColor: yellow[50],
      },
      success: {
        ...base,
        height: 28,
        color: theme.palette.success.dark,
        backgroundColor: theme.palette.success.light,
      },
      error: {
        ...base,
        color: theme.palette.orange.dark,
        backgroundColor: theme.palette.orange.light,
      },
    };
  }, [theme]);
};

// ==============================|| SHARED COMPONENTS ||============================== //
const NotificationHeader = ({ sender, secondaryText, time }) => (
  <>
    <ListItemAvatar>
      <Avatar alt={sender.username} src={getUserAvatarUrl(sender.avatar)} />
    </ListItemAvatar>
    <ListItemText
      primary={sender.username}
      secondary={<Typography variant="caption">{secondaryText}</Typography>}
    />
    <ListItemSecondaryAction>
      <Typography variant="caption">{formatRelativeTime(time)}</Typography>
    </ListItemSecondaryAction>
  </>
);

const PreviewBox = ({ items = [], repetitionCount = 0 }) => {
  const theme = useTheme();
  return (
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
      {repetitionCount > 2 && (
        <Typography variant="caption">
          +{repetitionCount - 2} messages
        </Typography>
      )}
      {items.map((text, idx) => (
        <Typography key={idx} variant="body2" color="textSecondary">
          {text}
        </Typography>
      ))}
    </Grid>
  );
};

// ==============================|| MAIN COMPONENT ||============================== //
const NotificationList = ({ notification }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const chipSX = useChipStyles();
  const n = notification;

  const commonClick = (e, path) => {
    if (!n.isRead) handleMarkAsRead(e, n._id);
    if (path) navigate(path);
  };

  const handleMarkAsRead = async (event, id) => {
    event.stopPropagation();
    try {
      await dispatch(markAsRead({ notificationId: id })).unwrap();
    } catch (err) {
      console.error("Mark as read failed:", err);
    }
  };

  switch (n.type) {
    case NotificationTypes.MESSAGE:
      return (
        <ListItemWrapper
          onClick={(e) => commonClick(e, `messages/direct/u/${n.referenceId}`)}
        >
          <ListItem alignItems="center">
            <NotificationHeader
              sender={n.sender}
              secondaryText="sent you a message"
              time={n.updatedAt}
            />
          </ListItem>
          <Grid container direction="column" className="list-container">
            <PreviewBox items={n.preview} repetitionCount={n.repetitionCount} />
            <Grid item>
              <Chip label="reply" sx={chipSX.info} />
              <Chip
                label={n.isRead ? "mark as unread" : "mark as read"}
                sx={chipSX.warning}
                onClick={(e) => handleMarkAsRead(e, n._id)}
              />
            </Grid>
          </Grid>
        </ListItemWrapper>
      );

    case NotificationTypes.LIKE_POST:
      return (
        <ListItemWrapper onClick={(e) => handleMarkAsRead(e, n._id)}>
          <ListItem alignItems="center">
            <NotificationHeader
              sender={n.sender}
              secondaryText="liked your post"
              time={n.updatedAt}
            />
          </ListItem>
          <Grid container className="list-container">
            <Card sx={{ backgroundColor: theme.palette.primary.light }}>
              <Box p={1}>
                <img
                  src={n?.referenceDoc?.images?.[0]?.url}
                  alt="notification-img"
                  style={{ width: "100%", height: "100px", borderRadius: 8 }}
                />
              </Box>
            </Card>
          </Grid>
        </ListItemWrapper>
      );

    case NotificationTypes.COMMENT:
      return (
        <ListItemWrapper>
          <ListItem alignItems="center">
            <NotificationHeader
              sender={n.sender}
              secondaryText="commented on your post"
              time={n.updatedAt}
            />
          </ListItem>
          <Grid container direction="column" className="list-container">
            <PreviewBox items={n.preview} />
            <Grid item>
              <Chip label="reply" sx={chipSX.info} />
              <Chip
                label={n.isRead ? "mark as unread" : "mark as read"}
                sx={chipSX.warning}
                onClick={(e) => handleMarkAsRead(e, n._id)}
              />
            </Grid>
          </Grid>
        </ListItemWrapper>
      );

    case NotificationTypes.FOLLOW_REQUEST:
      return (
        <ListItemWrapper
          onClick={(e) => commonClick(e, `/profile/${n.sender.username}`)}
        >
          <ListItem alignItems="center">
            <NotificationHeader
              sender={n.sender}
              secondaryText="sent you a follow request"
              time={n.updatedAt}
            />
          </ListItem>
        </ListItemWrapper>
      );

    default:
      return (
        <ListItemWrapper
          onClick={(e) => commonClick(e, `/profile/${n.sender.username}`)}
        >
          <ListItem alignItems="center">
            <NotificationHeader
              sender={n.sender}
              secondaryText="sent you a follow request"
              time={n.updatedAt}
            />
          </ListItem>
        </ListItemWrapper>
      );
  }
};

export default NotificationList;
