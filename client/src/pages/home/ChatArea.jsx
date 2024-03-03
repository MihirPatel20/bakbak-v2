import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "context/SocketContext";
import SendIcon from "@mui/icons-material/Send";
import { useSelector, useDispatch } from "react-redux";
import MessageBubble from "components/shared/MessageBubble";
import { ChatEventEnum } from "@/constants";

const ChatInterface = ({ activeChat }) => {
  const { socket } = useSocket();
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const newMessageRef = useRef(""); // Create a ref for newMessage

  // Function to send a new message
  const sendMessage = (event) => {
    event.preventDefault();

    const newMessage = newMessageRef.current.value.trim(); // Access value from ref
    if (newMessage !== "") {
      socket.emit(ChatEventEnum.SEND_MESSAGE_EVENT, {
        recipientId: activeChat?._id,
        message: newMessage,
      });
      newMessageRef.current.value = ""; // Clear input value via ref
    }
  };

  // Listen for new messages from the server
  useEffect(() => {
    if (socket) {
      // Listener for when a new message is received.
      socket.on(ChatEventEnum.MESSAGE_RECEIVED_EVENT, (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }
    return () => {
      if (socket) {
        socket.off(ChatEventEnum.MESSAGE_RECEIVED_EVENT);
      }
    };
  }, [socket]);

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
          sx={{
            flex: 1,
            overflowY: "auto",

            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} userId={user._id} />
          ))}
        </Box>

        <Box
          component="form"
          noValidate
          autoComplete="off"
          display="flex"
          flexDirection="row"
          gap={1}
          onSubmit={sendMessage}
        >
          <TextField
            name="message"
            label="Message"
            size="small"
            fullWidth
            inputRef={newMessageRef} // Attach ref to input
          />
          <Button
            type="submit"
            sx={{ minWidth: "auto", p: "8px 12px" }}
            variant="contained"
          >
            <SendIcon />
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ChatInterface;
