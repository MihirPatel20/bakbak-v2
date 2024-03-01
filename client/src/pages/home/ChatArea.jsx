import { Box } from "@mui/material";
import React from "react";

const ChatBox = () => {
  return (
    <Box
      sx={{
        height: {
          xs: "calc(100vh - 56px)",
          sm: "calc(100vh - 64px)",
        },
        background: "linear-gradient(to right, #667eea, #764ba2)",
      }}
    >
      Chat
    </Box>
  );
};

export default ChatBox;
