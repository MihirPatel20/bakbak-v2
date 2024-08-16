import {
  Avatar,
  Box,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { useParams } from "react-router-dom";
import { AppBarHeight } from "constants";
import { getUserAvatarUrl } from "utils/getImageUrl";
import { MobileHeightBuffer } from "constants";
import ChatMessageLayout from "./ChatMessageLayout";
import useChatSocket from "hooks/useChatSocket";

const ChatInterface = () => {
  const { chatId } = useParams();
  const {
    activeChat,
    recipient,
    messages,
    newMessage,
    isTyping,
    handleOnMessageChange,
    sendMessage,
  } = useChatSocket(chatId);

  const boxRef = useRef(null);
  const [chatBoxDimensions, setChatBoxDimensions] = useState({
    left: 0,
    width: 0,
  });

  useEffect(() => {
    if (boxRef.current) {
      const rect = boxRef.current.getBoundingClientRect();
      setChatBoxDimensions({
        left: rect.left,
        width: rect.width,
      });
    }
  }, [boxRef.current]);

  if (!activeChat) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "primary.light",
          borderRadius: 4,
          height: {
            xs: `calc(100vh - ${AppBarHeight}px)`,
            sm: `calc(100vh - ${AppBarHeight}px)`,
          },
          width: "100%",
          maxWidth: "600px",
        }}
      >
        <Typography variant="h3" align="center" gutterBottom fontWeight={200}>
          Welcome to the BAKBAK chat app! 🎉
        </Typography>
        <Typography variant="h4" align="center" fontWeight={200}>
          Select a chat to start messaging
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      ref={boxRef}
      sx={{
        bgcolor: "primary.light",
        borderRadius: 3,
        height: {
          xs: `calc(100vh - ${AppBarHeight + MobileHeightBuffer}px)`,
          sm: `calc(100vh - ${AppBarHeight}px)`,
        },
        width: "100%",
        maxWidth: "600px",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box
          sx={{
            bgcolor: "primary.light",
            top: 0,
            display: "flex",
            alignItems: "center",
            gap: 2,
            cursor: "pointer",
            borderBottom: 1,
            borderBottomColor: "grey.400",
            p: "8px 14px",
          }}
        >
          <Avatar
            src={getUserAvatarUrl(recipient.avatar)}
            alt={recipient.username}
            sx={{ width: 40, height: 40 }}
          />
          <Box>
            <Grid container direction="column">
              <Typography variant="body1" component="div">
                {recipient.username}
              </Typography>
            </Grid>
          </Box>
        </Box>

        <ChatMessageLayout
          chat={activeChat}
          messages={messages}
          isTyping={isTyping}
          chatBoxDimensions={chatBoxDimensions}
        />

        <Box
          component="form"
          noValidate
          autoComplete="off"
          display="flex"
          alignItems="center"
          onSubmit={sendMessage}
          p={2}
          borderTop={1}
          borderTopColor="grey.400"
          position={"fixed"}
          width={chatBoxDimensions.width || "100%"}
          bottom={0}
          sx={{
            bgcolor: "primary.light",
          }}
        >
          <TextField
            name="message"
            label="Message"
            size="small"
            fullWidth
            value={newMessage}
            onChange={handleOnMessageChange}
          />
          <IconButton type="submit" sx={{ ml: 1 }} color="primary">
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatInterface;
