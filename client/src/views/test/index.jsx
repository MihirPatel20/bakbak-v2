import React, { useState, useEffect, useRef } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { Box, Typography, Avatar } from "@mui/material";
import api from "api";
import { getUserAvatarUrl } from "utils/getImageUrl";
import { format } from "date-fns";

const ChatMessages = ({ chatId = "66c2782ba50e5ba857d934cc" }) => {
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchMessages(page);
  }, []);

  const fetchMessages = async (page) => {
    try {
      const response = await api.get(`/messages/${chatId}`, {
        params: { page, limit: 10 },
      });
      const newMessages = response.data.data.messages;

      setMessages((prevMessages) => [...newMessages, ...prevMessages]);

      setHasMore(response.data.data.hasNextPage);
      setPage(response.data.data.page);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleScroll = () => {
    const perfectScrollbar = scrollRef.current._container;

    // Detect if we are near the top of the scroll container
    let { scrollTop, scrollHeight } = perfectScrollbar;
    if (perfectScrollbar.scrollTop < 100 && hasMore) {
      fetchMessages(page + 1).then(() => {
        // Adjust scroll position after loading more messages
        perfectScrollbar.scrollTop =
          perfectScrollbar.scrollHeight - scrollHeight + scrollTop;
      });
    }

    // Show or hide scroll-to-bottom button
    const shouldShow =
      perfectScrollbar.scrollHeight -
        perfectScrollbar.scrollTop -
        perfectScrollbar.clientHeight >
      350;
    setShowScrollToBottom(shouldShow);
  };

  const scrollToBottom = () => {
    const perfectScrollbar = scrollRef.current._container;
    if (perfectScrollbar)
      perfectScrollbar.scrollTop = perfectScrollbar.scrollHeight;
  };

  useEffect(() => {
    if (!showScrollToBottom) {
      scrollToBottom();
    }
  }, [messages]);

  return (
    <PerfectScrollbar
      ref={scrollRef}
      onScrollY={handleScroll}
      sx={{ height: "100%", width: "100%", overflow: "hidden" }}
    >
      <Box sx={{ display: "flex", flexDirection: "column-reverse", p: 2 }}>
        {messages.map((message) => (
          <Box
            key={message._id}
            sx={{
              display: "flex",
              mb: 2,
              alignSelf:
                message.sender._id === "65f1679b4d305dda1fc529f0"
                  ? "flex-end"
                  : "flex-start",
            }}
          >
            {message.sender._id !== "65f1679b4d305dda1fc529f0" && (
              <Avatar
                src={getUserAvatarUrl(message.sender.avatar)}
                alt={message.sender.username}
                sx={{
                  width: 32,
                  height: 32,
                  mr: 1,
                }}
              />
            )}
            <Box sx={{ maxWidth: "75%" }}>
              <Typography
                variant="body2"
                sx={{
                  backgroundColor:
                    message.sender._id === "65f1679b4d305dda1fc529f0"
                      ? "primary.main"
                      : "grey.300",
                  color:
                    message.sender._id === "65f1679b4d305dda1fc529f0"
                      ? "primary.contrastText"
                      : "text.primary",
                  borderRadius: 1,
                  p: 1,
                }}
              >
                {message.content}
              </Typography>
              <Typography variant="caption" sx={{ mt: 0.5, display: "block" }}>
                {format(new Date(message.createdAt), "PPpp")}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </PerfectScrollbar>
  );
};

export default ChatMessages;
