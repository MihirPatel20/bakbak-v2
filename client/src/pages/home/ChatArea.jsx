import { Box, Paper } from "@mui/material";
import React from "react";

const ChatBox = () => {
  return (
    <Paper
      sx={{
        height: {
          xs: "calc(100vh - 56px)",
          sm: "calc(100vh - 64px)",
        },
        border: "1px solid gray",
        // background: "linear-gradient(to right, #667eea, #764ba2)",
      }}
    >
      Chat
    </Paper>
  );
};

export default ChatBox;
