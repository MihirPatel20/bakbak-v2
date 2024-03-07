import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "context/SocketContext";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import MessageBubble from "components/shared/MessageBubble";
import { ChatEventEnum } from "@/constants";
import api from "api";

const ChatInterface = ({ activeChat }) => {
  const { socket } = useSocket();
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);
  const newMessageRef = useRef("");

  const getMessages = async (chatId) => {
    try {
      const response = await api.get(`/messages/${chatId}`);
      setMessages(response.data.data); // Update state with fetched messages
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (activeChat) {
      getMessages(activeChat);
    }
  }, [activeChat]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const newMessage = newMessageRef.current.value.trim();
    if (newMessage !== "") {
      try {
        const res = await api.post(`/messages/${activeChat}`, {
          content: newMessage,
        });
        setMessages((prevMessages) => [...prevMessages, res.data.data]);
        newMessageRef.current.value = ""; // Clear input value
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on(ChatEventEnum.MESSAGE_RECEIVED_EVENT, (payload) => {
        setMessages((prevMessages) => [...prevMessages, payload]);
      });
      return () => {
        socket.off(ChatEventEnum.MESSAGE_RECEIVED_EVENT);
      };
    }
  }, [socket]);

  useEffect(() => {
    // Scroll to the bottom of the chat interface when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Paper
      variant="outlined"
      sx={{
        height: {
          xs: "calc(100vh - 72px)",
          sm: "calc(100vh - 80px)",
        },
        // border: "1px solid gray",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: 1,
        }}
      >
        <Typography variant="h5" textAlign="center" gutterBottom>
          Chat Interface
        </Typography>
        <Box
        ref={chatContainerRef}
        sx={{
            flex: 1,
            overflowY: "auto",

            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              userId={user._id}
            />
          ))}
        </Box>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          display="flex"
          alignItems="center"
          onSubmit={sendMessage}
        >
          <TextField
            name="message"
            label="Message"
            size="small"
            fullWidth
            inputRef={newMessageRef}
          />
          <Button type="submit" sx={{ ml: 1 }} variant="contained">
            <SendIcon />
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ChatInterface;
