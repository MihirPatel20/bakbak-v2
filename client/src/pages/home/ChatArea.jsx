import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSocket } from "context/SocketContext";
import SendIcon from "@mui/icons-material/Send";

const ChatInterface = () => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Function to send a new message
  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      socket.emit("newMessage", { message: newMessage });
      setNewMessage("");
    }
  };

  // Listen for new messages from the server
  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("Connected to the server");
      });
      socket.on("messageReceived", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }
    return () => {
      if (socket) {
        socket.off("messageReceived");
      }
    };
  }, [socket]);

  return (
    <Paper
      sx={{
        height: {
          xs: "calc(100vh - 56px)",
          sm: "calc(100vh - 64px)",
        },
        border: "1px solid gray",
        // background: "linear-gradient(to right, #667eea, #764ba2)",
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
          sx={{
            flex: 1,
            overflowY: "auto",
          }}
        >
          {messages.map((message, index) => (
            <Typography key={index}>{message}</Typography>
          ))}
        </Box>

        <Box
          component="form"
          noValidate
          autoComplete="off"
          display="flex"
          flexDirection="row"
          gap={1}
        >
          <TextField
            name="message"
            label="Message"
            size="small"
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button
            sx={{ minWidth: "auto", p: "8px 12px" }}
            variant="contained"
            onClick={sendMessage}
          >
            <SendIcon />
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ChatInterface;
