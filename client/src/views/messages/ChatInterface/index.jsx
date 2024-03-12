import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "context/SocketContext";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import MessageBubble from "components/shared/MessageBubble";
import { ChatEventEnum } from "constants";
import api from "api";
import { useLocation, useParams } from "react-router-dom";

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

  const { userId } = useParams();

  const getMessages = async (chatId) => {
    try {
      const response = await api.get(`/messages/${chatId}`);
      setMessages(response.data.data); // Update state with fetched messages
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      socket?.emit(ChatEventEnum.JOIN_CHAT_EVENT, userId);

      setActiveChat(userId);
      getMessages(userId);
    }
  }, [userId]);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (newMessage.trim() !== "") {
      try {
        const res = await api.post(`/messages/${activeChat}`, {
          content: newMessage,
        });
        setMessages((prevMessages) => [...prevMessages, res.data.data]);
        setNewMessage(""); // Clear message input

        // Emit a stop typing event to the server for the current chat
        socket.emit(ChatEventEnum.STOP_TYPING_EVENT, activeChat);

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
      socket.emit(ChatEventEnum.TYPING_EVENT, activeChat);
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
      socket.emit(ChatEventEnum.STOP_TYPING_EVENT, activeChat);

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
        if (chatId !== activeChat) return;
        setIsTyping(true);
      });
      socket.on(ChatEventEnum.STOP_TYPING_EVENT, (chatId) => {
        if (chatId !== activeChat) return;
        setIsTyping(false);
      });
      return () => {
        socket.off(ChatEventEnum.MESSAGE_RECEIVED_EVENT);
        socket.off(ChatEventEnum.TYPING_EVENT);
        socket.off(ChatEventEnum.STOP_TYPING_EVENT);
      };
    }
  }, [socket, activeChat]);

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
    <Paper
      variant="outlined"
      sx={{
        height: {
          xs: "calc(100vh - 72px)",
          sm: "calc(100vh - 80px)",
        },
        width: "100%",
        maxWidth: "600px",
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
          {/* Display typing indicator if someone is typing */}
          {isTyping && <Typography variant="body2">Typing...</Typography>}
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
            value={newMessage} // Bind value to state
            onChange={handleOnMessageChange} // Handle input change
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
