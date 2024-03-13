import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "context/SocketContext";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import MessageBubble from "components/shared/MessageBubble";
import { ChatEventEnum } from "constants";
import api from "api";
import { useLocation, useParams } from "react-router-dom";
import { AppBarHeight } from "constants";
import { getUserAvatarUrl } from "utils/getImageUrl";

const ChatInterface = () => {
  const [activeChat, setActiveChat] = useState(null); // State to track the active chat [1]
  const { socket } = useSocket();
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(""); // State to handle message input

  const [isTyping, setIsTyping] = useState(false); // To track if someone is currently typing
  const [selfTyping, setSelfTyping] = useState(false); // To track if the current user is typing

  const typingTimeoutRef = useRef(null);
  const chatContainerRef = useRef(null);

  const location = useLocation();
  const { chatId } = useParams();
  console.log("chat: ", chatId);

  const recipient = location.state?.chat.participants.find(
    (participant) => participant._id !== user._id
  );

  console.log("recipient: ", recipient);

  if (!chatId) {
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

  const getMessages = async (chatId) => {
    try {
      const response = await api.get(`/messages/${chatId}`);
      setMessages(response.data.data); // Update state with fetched messages
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const getChatInfo = async (chatId) => {
    try {
      const response = await api.get(`/chats/${chatId}`);
      setMessages(response.data.data); // Update state with fetched messages
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (chatId) {
      socket?.emit(ChatEventEnum.JOIN_CHAT_EVENT, chatId);

      getMessages(chatId);
    }
  }, [chatId]);

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

  useEffect(() => {
    if (socket) {
      socket.on(ChatEventEnum.MESSAGE_RECEIVED_EVENT, (payload) => {
        setMessages((prevMessages) => [...prevMessages, payload]);
      });
      socket.on(ChatEventEnum.TYPING_EVENT, (chatId) => {
        // if (chatId !== activeChat._id) return;
        setIsTyping(true);
      });
      socket.on(ChatEventEnum.STOP_TYPING_EVENT, (chatId) => {
        // if (chatId !== activeChat._id) return;
        setIsTyping(false);
      });
      return () => {
        socket.off(ChatEventEnum.MESSAGE_RECEIVED_EVENT);
        socket.off(ChatEventEnum.TYPING_EVENT);
        socket.off(ChatEventEnum.STOP_TYPING_EVENT);
      };
    }
  }, [socket, chatId]);

  useEffect(() => {
    // Scroll to the bottom of the chat interface when messages change
    const chatContainer = chatContainerRef.current;
    const lastMessage = chatContainer.lastElementChild;

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
    <Grid
      container
      style={{
        height: `calc(100vh - ${AppBarHeight}px)`,
        maxWidth: "600px",
        overflow: "hidden",
      }}
    >
      <Grid
        item
        xs={12}
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <Grid
          item
          xs={12}
          style={{
            flex: 1,
            overflowY: "auto",
            gap: "4px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              cursor: "pointer",
              borderBottom: 1,
              padding: 2,
            }}
          >
            <Avatar
              src={getUserAvatarUrl(recipient.avatar)}
              alt={recipient.username}
              style={{ width: 40, height: 40 }}
            />
            <Typography variant="body1">{recipient.username}</Typography>
          </Grid>

          {messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              userId={user._id}
            />
          ))}
          {/* Display typing indicator if someone is typing */}
          {isTyping && <Typography variant="body2">Typing...</Typography>}
        </Grid>
        <Grid
          item
          xs={12}
          style={{ display: "flex", alignItems: "center" }}
          onSubmit={sendMessage}
        >
          <TextField
            name="message"
            label="Message"
            size="small"
            fullWidth
            value={newMessage}
            onChange={handleOnMessageChange}
          />
          <IconButton type="submit" style={{ marginLeft: 1 }} color="primary">
            <SendIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ChatInterface;
