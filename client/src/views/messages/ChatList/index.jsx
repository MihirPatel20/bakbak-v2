import React, { useEffect, useState } from "react";
import { Box, Divider, Typography } from "@mui/material";
import UserCard from "components/shared/UserCard";
import api from "api";
import { useSelector } from "react-redux";
import { ChatEventEnum } from "@/constants";
import { useSocket } from "context/SocketContext";
import { LocalStorage } from "@/utils/LocalStorage";
import { useNavigate } from "react-router-dom";
import ProfileCard from "components/shared/ProfileCard";

const ChatList = ({ setActiveChat }) => {
  const { socket } = useSocket();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const [chats, setChats] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);

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
    const fetchFollowingUsers = async () => {
      try {
        const res = await api.get(
          `follow/list/following/${auth.user.username}`
        );
        setFollowingUsers(res.data.data.following);
      } catch (error) {
        console.log("error: ", error);
      }
    };

    fetchChats();
    fetchFollowingUsers();
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

  const getOrCreateChat = async (userId) => {
    try {
      const response = await api.post(`/chats/c/${userId}`);
      const chat = response.data.data;
      navigate(`/messages/direct/u/${chat._id}`, { state: { chat } });
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        pr: "12px",
        pl: "6px",
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          bgcolor: "background.paper",
        }}
      >
        <Typography
          variant="h3"
          component="div"
          sx={{ paddingLeft: 1, paddingTop: 1 }}
        >
          Chats
        </Typography>

        <Divider sx={{ mt: 1.5 }} />
      </Box>
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
                getOrCreateChat(participant._id);
              }}
            />
          );
        })
      ) : (
        <Box mb={4}>
          <Typography variant="body1" component="div" textAlign={"center"}>
            No chats found
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          bgcolor: "background.paper",
        }}
      >
        <Typography
          variant="h3"
          component="div"
          sx={{ paddingLeft: 1, paddingTop: 1 }}
        >
          Start New Chat
        </Typography>

        <Divider sx={{ mt: 1.5 }} />
      </Box>

      {followingUsers.length > 0
        ? followingUsers.map((user) => (
            <ProfileCard
              key={user._id}
              profile={user}
              onClick={() => getOrCreateChat(user.account._id)}
            />
          ))
        : null}
    </Box>
  );
};

export default ChatList;
