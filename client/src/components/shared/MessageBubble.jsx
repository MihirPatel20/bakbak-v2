import React from "react";
import { Box, Typography } from "@mui/material";

const MessageBubble = ({ message, userId }) => {
  const isOwnMessage = message.sender._id === userId;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: isOwnMessage ? "flex-end" : "flex-start",
      }}
    >
      <Box
        sx={{
          backgroundColor: isOwnMessage ? "lightblue" : "lightgray",
          borderRadius: "8px",
          padding: "4px 10px",
          maxWidth: "70%",
          wordWrap: "break-word",
        }}
      >
        <Typography>{message?.content}</Typography>
      </Box>
    </Box>
  );
};

export default MessageBubble;
