import React, { useEffect, useRef } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import useAuth from "hooks/useAuth";
import { getUserAvatarUrl } from "utils/getImageUrl";

const ChatMessageLayout = ({ chat, messages }) => {
  const { user } = useAuth();
  const chatContainerRef = useRef(null);

  const getMessageTime = (createdAt) => {
    return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  };

  useEffect(() => {
    // Scroll to the bottom of the chat interface when messages change
    const chatContainer = chatContainerRef?.current;
    const lastMessage = chatContainer?.lastElementChild;
    
    lastMessage?.scrollIntoView({ behavior: "smooth" });
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Check if there are new messages and if the user is not looking at previous messages
    const isNewMessages =
      messages.length > 0 &&
      chatContainer.scrollTop + chatContainer.clientHeight >=
        chatContainer.scrollHeight - 200;

    // Scroll to the bottom of the chat interface when there are new messages and the user is already viewing the latest messages
    if (isNewMessages) {
      lastMessage.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Box ref={chatContainerRef}>
      {messages.map((message, index) => {
        const isSender = message.sender._id === user._id;
        const isFirstMessage =
          index === 0 || messages[index - 1].sender._id !== message.sender._id;
        const isLastMessage =
          index === messages.length - 1 ||
          messages[index + 1].sender._id !== message.sender._id;

        return (
          <Box
            key={message._id}
            sx={{
              display: "flex",
              alignItems: "flex-end",
              mb: isLastMessage ? "8px" : "4px",
              flexDirection: isSender ? "row-reverse" : "row",
            }}
          >
            {!isSender && (
              <Avatar
                src={getUserAvatarUrl(message.sender.avatar)}
                alt={message.sender.username}
                sx={{
                  width: 32,
                  height: 32,
                  mr: 1,
                  visibility: isLastMessage ? "visible" : "hidden",
                }}
              />
            )}
            <Box
              sx={{
                bgcolor: isSender ? "primary.main" : "background.paper",
                color: isSender ? "common.white" : "text.primary",
                borderRadius: isFirstMessage
                  ? isSender
                    ? "14px 14px 4px 14px"
                    : "14px 14px 14px 4px"
                  : isLastMessage
                  ? isSender
                    ? "14px 4px 14px 14px"
                    : "4px 14px 14px 14px"
                  : isSender
                  ? "14px 4px 4px 14px"
                  : "4px 14px 14px 4px",

                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                p: "8px 14px",
                maxWidth: "70%",
                wordWrap: "break-word",
                minWidth: "40px",
              }}
            >
              <Typography variant="body1">{message.content}</Typography>
              <Typography
                variant="caption"
                color={isSender ? "grey.200" : "grey.600"}
                fontSize={10}
              >
                {getMessageTime(message.createdAt)}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default ChatMessageLayout;
