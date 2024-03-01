import React from "react";
import { Box } from "@mui/material";

const ChatHistory = () => {
  return (
    <Box
      sx={{
        height: {
          xs: "calc(100vh - 56px)",
          sm: "calc(100vh - 64px)",
        },
        border: "1px solid gray",
      }}
    >
      ChatHistory
    </Box>
  );
};

export default ChatHistory;
