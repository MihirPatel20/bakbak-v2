import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import useAuth from "hooks/useAuth";
import PerfectScrollbar from "react-perfect-scrollbar";
import { getUserAvatarUrl } from "utils/getImageUrl";
import TypingBubble from "./TypingBubble";

const ChatMessageLayout = ({ chat, messages, isTyping }) => {
  const { user } = useAuth();
  const chatContainerRef = useRef(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const getMessageTime = (createdAt) => {
    return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  };

  const handleScroll = () => {
    const chatContainer = chatContainerRef.current._container;
    if (!chatContainer) return;

    const shouldShow =
      chatContainer.scrollHeight -
        chatContainer.scrollTop -
        chatContainer.clientHeight >
      350;
    setShowScrollToBottom(shouldShow);
  };

  const scrollToBottom = () => {
    const chatContainer = chatContainerRef.current._container;
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
  };

  useEffect(() => {
    const chatContainer = chatContainerRef.current._container;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (!showScrollToBottom) {
      scrollToBottom();
    }
  }, [messages]);

  return (
    <PerfectScrollbar
      ref={chatContainerRef}
      component="div"
      style={{ padding: "16px" }}
    >
      {showScrollToBottom && (
        <Box
          onClick={scrollToBottom}
          sx={{
            position: "fixed",
            bottom: "100px",
            right: "50%",
            transform: "translateX(50%)",
            backgroundColor: "primary.main",
            color: "white",
            borderRadius: "50%",
            width: "40px",
            // width: "100%",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          ↓
        </Box>
      )}

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

      {isTyping && <TypingBubble />}
    </PerfectScrollbar>
  );
};

export default ChatMessageLayout;
