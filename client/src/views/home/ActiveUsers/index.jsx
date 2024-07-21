import { Box, Divider, Typography } from "@mui/material";
import api from "api";
import UserCard from "./UserCard";
import { AppBarHeight } from "constants";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSocket } from "context/SocketContext";
import { ChatEventEnum } from "constants";

const ActiveUsers = () => {
  const { socket } = useSocket();
  const auth = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]); // Add this line
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get(
          `follow/list/following/${auth.user.username}`
        );
        setUsers(res.data.data.following);
        // console.log("following: ", res.data.data.following[0]);
      } catch (error) {
        console.log("error: ", error);
      }
    };

    const fetchOnlineUsers = async () => {
      // Add this block
      try {
        const res = await api.get("users/online-users");
        setOnlineUsers(res.data.data);
      } catch (error) {
        console.log("error: ", error);
      }
    };

    fetchUsers();
    fetchOnlineUsers(); // Add this line
  }, [dispatch]);

  useEffect(() => {
    if (socket) {
      socket.on(ChatEventEnum.USER_ONLINE_EVENT, (user) => {
        setOnlineUsers((prev) => [...prev, user]);
      });
      socket.on(ChatEventEnum.USER_OFFLINE_EVENT, ({ user }) => {
        setOnlineUsers((prev) => prev.filter((u) => u._id !== user._id));
      });
    }
  }, [socket]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {onlineUsers.length >= 0 && (
        <>
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
              Online Users
            </Typography>

            <Divider sx={{ mt: 1.5 }} />
          </Box>

          {onlineUsers.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              onClick={() =>
                navigate(`/profile/${user.username}`, { state: { user } })
              }
            />
          ))}
        </>
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
          Friends
        </Typography>

        <Divider sx={{ mt: 1.5 }} />
      </Box>

      {users.map((user) => (
        <UserCard
          key={user._id}
          user={user}
          onClick={() =>
            navigate(`/profile/${user.username}`, { state: { user } })
          }
        />
      ))}
    </Box>
  );
};

export default ActiveUsers;
