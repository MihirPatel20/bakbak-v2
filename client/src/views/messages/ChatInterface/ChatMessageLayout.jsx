import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Avatar, Collapse } from "@mui/material";
import { format, formatDistanceToNow } from "date-fns";
import useAuth from "hooks/useAuth";
import PerfectScrollbar from "react-perfect-scrollbar";
import { getUserAvatarUrl } from "utils/getImageUrl";
import TypingBubble from "./TypingBubble";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const ChatMessageLayout = ({ chat, messages, isTyping, chatBoxDimensions }) => {
  const { user } = useAuth();
  const chatContainerRef = useRef(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [shownTimeMessageId, setShownTimeMessageId] = useState(null);

  const sender = chat.participants.find(
    (participant) => participant._id !== user._id
  );

  const handleToggleTime = (messageId) => {
    setShownTimeMessageId((prevId) =>
      prevId === messageId ? null : messageId
    );
  };

  const handleScroll = (psContainer) => {
    const shouldShow =
      psContainer.scrollHeight -
        psContainer.scrollTop -
        psContainer.clientHeight >
      350;
    setShowScrollToBottom(shouldShow);
  };

  const scrollToBottom = () => {
    const chatContainer = chatContainerRef.current._container;
    console.log("PerfectScrollbar", chatContainerRef.current);

    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
  };

  useEffect(() => {
    if (!showScrollToBottom) {
      scrollToBottom();
    }
  }, [messages, isTyping]);

  return (
    <PerfectScrollbar
      ref={chatContainerRef}
      onScrollY={handleScroll}
      onYReachStart={() => {
        console.log("reached start");
      }}
      component="div"
      style={{
        padding: "16px",
        height: "100%",
        // overflowY: "auto",
        // marginBottom: chatBoxDimensions.width < 300 ? "50px" : "70px",
      }}
    >
      {/* Your chat messages go here */}
      {showScrollToBottom && (
        <Box
          onClick={scrollToBottom}
          sx={{
            position: "fixed",
            bottom: "100px", // Adjust as needed
            left: chatBoxDimensions.left + chatBoxDimensions.width / 2,
            transform: "translateX(-50%)",
            backgroundColor: "primary.main",
            color: "white",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <ArrowDownwardIcon />
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
          <>
            <Box
              key={message._id}
              sx={{
                display: "flex",
                // alignItems: "flex-end",
                mt: isFirstMessage ? "8px" : "4px",
                flexDirection: isSender ? "row-reverse" : "row",
              }}
              onClick={() => handleToggleTime(message._id)}
            >
              {!isSender && (
                <Avatar
                  src={getUserAvatarUrl(message.sender.avatar)}
                  alt={message.sender.username}
                  sx={{
                    width: 32,
                    height: 32,
                    mr: 1,
                    visibility: isFirstMessage ? "visible" : "hidden",
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
                  // minWidth: "40px",
                }}
              >
                <Typography variant="body1" sx={{ cursor: "default" }}>
                  {message.content}
                </Typography>
              </Box>
            </Box>

            <Box
              display="flex"
              justifyContent={isSender ? "flex-end" : "flex-start"}
              paddingLeft={isSender ? 0 : 6}
              paddingRight={isSender ? 1 : 0}
            >
              <Collapse in={shownTimeMessageId === message._id}>
                <Typography
                  variant="caption"
                  // color={isSender ? "grey.200" : "grey.600"}
                  color={"black"}
                  fontSize={10}
                  sx={{ textAlign: "right" }}
                >
                  {format(new Date(message.createdAt), "PPpp")}
                </Typography>
              </Collapse>
            </Box>
          </>
        );
      })}

      {isTyping && (
        <TypingBubble
          avatar={sender.avatar}
          showAvatar={
            messages.length === 0 ||
            messages[messages.length - 1].sender._id === user._id
          }
        />
      )}
    </PerfectScrollbar>
  );
};

export default ChatMessageLayout;
