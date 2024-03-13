import React, { useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import useAuth from "hooks/useAuth";
import { getUserAvatarUrl } from "utils/getImageUrl";

const getMessageTime = (createdAt) => {
  return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
};

const ChatMessage = ({ message, user }) => {
  const [showTime, setShowTime] = useState(false);

  const handleMouseEnter = () => {
    setShowTime(true);
  };

  const handleMouseLeave = () => {
    setShowTime(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-end",
        mb: "4px",
        flexDirection: message.sender._id === user._id ? "row-reverse" : "row",
      }}
    >
      {message.sender._id !== user._id && (
        <Avatar
          src={getUserAvatarUrl(message.sender.avatar)}
          alt={message.sender.username}
          sx={{
            width: 32,
            height: 32,
            mr: 1,
            visibility: islast ? "hidden" : "visible",
          }}
        />
      )}
      <Box
        sx={{
          bgcolor:
            message.sender._id === user._id
              ? "primary.main"
              : "background.paper",
          color:
            message.sender._id === user._id ? "common.white" : "text.primary",
          borderRadius: "14px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          p: "8px 14px",
          maxWidth: "70%",
          wordWrap: "break-word",
          minWidth: "40px",
          position: "relative",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Typography variant="body1">{message.content}</Typography>
      </Box>
      {showTime && (
        <Typography
          variant="caption"
          color={message.sender._id === user._id ? "grey.600" : "grey.600"}
          fontSize={10}
          sx={{ position: "absolute", bottom: "16px", right: "4px" }}
        >
          {getMessageTime(message.createdAt)}
        </Typography>
      )}
    </Box>
  );
};

const ChatMessageLayout = ({ chat, messages }) => {
  const { user } = useAuth();

  return (
    <Box>
      {messages.map((message, index) => (
        <ChatMessage key={message._id} message={message} user={user} />
      ))}
    </Box>
  );
};

export default ChatMessageLayout;
