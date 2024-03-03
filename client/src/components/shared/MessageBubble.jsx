import React from "react";
import { Box, Typography } from "@mui/material";

const MessageBubble = ({ message, userId }) => {
  const isOwnMessage = message.sender === userId;

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
        <Typography>{message?.message}</Typography>
      </Box>
    </Box>
  );
};

export default MessageBubble;
