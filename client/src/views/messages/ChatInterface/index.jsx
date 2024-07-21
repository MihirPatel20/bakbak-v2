import {
  Avatar,
  Box,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "context/SocketContext";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import { ChatEventEnum } from "constants";
import api from "api";
import { useLocation, useParams } from "react-router-dom";
import { AppBarHeight } from "constants";
import { getUserAvatarUrl } from "utils/getImageUrl";
import { MobileHeightBuffer } from "constants";
import ChatMessageLayout from "./ChatMessageLayout";

const ChatInterface = () => {
  const { socket } = useSocket();
  const { user } = useSelector((state) => state.auth);
  const [activeChat, setActiveChat] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(""); // State to handle message input

  const [isTyping, setIsTyping] = useState(false); // To track if someone is currently typing
  const [selfTyping, setSelfTyping] = useState(false); // To track if the current user is typing

  const typingTimeoutRef = useRef(null);

  const location = useLocation();
  const { chatId } = useParams();

  useEffect(() => {
    const getActiveChat = async (chatId) => {
      try {
        const response = await api.get(`/chats/c/${chatId}`);
        const chat = response.data.data;
        setActiveChat(chat);
        setRecipient(
          chat.participants.find((participant) => participant._id !== user._id)
        );
      } catch (error) {
        console.error("Error fetching chat:", error);
      }
    };

    const getMessages = async (chatId) => {
      try {
        const response = await api.get(`/messages/${chatId}`);
        setMessages(response.data.data); // Update state with fetched messages
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (chatId) {
      getActiveChat(chatId);
      getMessages(chatId);
      socket?.emit(ChatEventEnum.JOIN_CHAT_EVENT, chatId);

      // Cleanup function to leave chat when component unmounts or chatId changes
      return () => {
        socket?.emit(ChatEventEnum.LEAVE_CHAT_EVENT, chatId);
      };
    }
  }, [chatId, socket]);

  useEffect(() => {
    if (socket) {
      const handleMessageReceived = (payload) => {
        setMessages((prevMessages) => [...prevMessages, payload]);
      };
      const handleTyping = () => setIsTyping(true);
      const handleStopTyping = () => setIsTyping(false);

      socket.on(ChatEventEnum.MESSAGE_RECEIVED_EVENT, handleMessageReceived);
      socket.on(ChatEventEnum.TYPING_EVENT, handleTyping);
      socket.on(ChatEventEnum.STOP_TYPING_EVENT, handleStopTyping);

      return () => {
        socket.off(ChatEventEnum.MESSAGE_RECEIVED_EVENT, handleMessageReceived);
        socket.off(ChatEventEnum.TYPING_EVENT, handleTyping);
        socket.off(ChatEventEnum.STOP_TYPING_EVENT, handleStopTyping);
      };
    }
  }, [socket]);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (newMessage.trim() !== "") {
      try {
        const res = await api.post(`/messages/${chatId}`, {
          content: newMessage,
        });
        setMessages((prevMessages) => [...prevMessages, res.data.data]);
        setNewMessage(""); // Clear message input

        // Emit a stop typing event to the server for the current chat
        socket.emit(ChatEventEnum.STOP_TYPING_EVENT, chatId);

        // Reset the user's typing state
        setSelfTyping(false);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleOnMessageChange = (e) => {
    // Update the message state with the current input value
    setNewMessage(e.target.value);

    // If socket doesn't exist, exit the function
    if (!socket) return;

    // Check if the user isn't already set as typing
    if (!selfTyping) {
      // Set the user as typing
      setSelfTyping(true);

      // Emit a typing event to the server for the current chat
      socket.emit(ChatEventEnum.TYPING_EVENT, chatId);
    }

    // Clear the previous timeout (if exists) to avoid multiple setTimeouts from running
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Define a length of time (in milliseconds) for the typing timeout
    const timerLength = 2000;

    // Set a timeout to stop the typing indication after the timerLength has passed
    typingTimeoutRef.current = setTimeout(() => {
      // Emit a stop typing event to the server for the current chat
      socket.emit(ChatEventEnum.STOP_TYPING_EVENT, chatId);

      // Reset the user's typing state
      setSelfTyping(false);
    }, timerLength);
  };

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
        <Typography variant="h4" align="center">
          Select a chat
        </Typography>
        <Typography variant="h4" align="center">
          to start messaging
        </Typography>
      </Box>
    );
  }

  return (
    <Box
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
        >
          <TextField
            name="message"
            label="Message"
            size="small"
            fullWidth
            value={newMessage} // Bind value to state
            onChange={handleOnMessageChange} // Handle input change
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
