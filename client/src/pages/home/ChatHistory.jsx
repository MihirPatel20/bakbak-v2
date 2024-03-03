import React from "react";
import { Box, Typography } from "@mui/material";
import UserCard from "components/shared/UserCard";

const ChatHistory = ({ activeChat }) => {
  return (
    <Box
      sx={{
        height: {
          xs: "calc(100vh - 72px)",
          sm: "calc(100vh - 80px)",
        },
        // border: "1px solid gray",
      }}
    >
      <Typography variant="h6" component="div" textAlign={"center"}>
        Chats
      </Typography>
      {activeChat.username ? (
        <UserCard user={activeChat} />
      ) : (
        <Box>
          <Typography variant="body1" component="div" textAlign={"center"}>
            No chat selected
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatHistory;
