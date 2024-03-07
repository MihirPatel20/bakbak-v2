import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import UserCard from "components/shared/UserCard";
import api from "api";
import { useSelector } from "react-redux";
import { ChatEventEnum } from "@/constants";
import { useSocket } from "context/SocketContext";
import { LocalStorage } from "@/utils/LocalStorage";

const ChatHistory = ({ setActiveChat }) => {
  const { socket } = useSocket();
  const auth = useSelector((state) => state.auth);
  const [chats, setChats] = useState([]);

  const deleteChat = async (chatId) => {
    try {
      await api.delete("/chats/remove/" + chatId);
      setChats((prev) => prev.filter((chat) => chat._id !== chatId));
    } catch (error) {
      console.log(error);
    }
  };

  // getAllChats form server
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await api.get("/chats");
        setChats(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchChats();
  }, []);

  // Listen for new messages from the server
  useEffect(() => {
    if (socket) {
      // Listener for the initiation of a new chat.
      socket.on(ChatEventEnum.NEW_CHAT_EVENT, (chat) => {
        setChats((prev) => [chat, ...prev]);
      });

      socket.on(ChatEventEnum.LEAVE_CHAT_EVENT, (chat) => {
        setChats((prev) => prev.filter((c) => c._id !== chat._id));
      });
    }
    return () => {
      if (socket) {
        socket.off(ChatEventEnum.NEW_CHAT_EVENT);
        socket.off(ChatEventEnum.LEAVE_CHAT_EVENT);
      }
    };
  }, [socket]);

  return (
    <Box
      sx={{
        height: {
          xs: "calc(100vh - 72px)",
          sm: "calc(100vh - 80px)",
        },
        // border: "1px solid gray",
      }}
    >
      <Typography variant="h6" component="div" textAlign={"center"}>
        Chats
      </Typography>
      {chats.length > 0 ? (
        chats.map((chat) => {
          const participant = chat.participants.find(
            (participant) => participant._id !== auth.user._id
          );

          return (
            <UserCard
              key={chat._id}
              user={participant}
              onClick={() => {
                // deleteChat(chat._id);
                setActiveChat(chat._id);
                LocalStorage.set("activeChat", chat._id);
              }}
            />
          );
        })
      ) : (
        <Box>
          <Typography variant="body1" component="div" textAlign={"center"}>
            No chats found
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatHistory;
