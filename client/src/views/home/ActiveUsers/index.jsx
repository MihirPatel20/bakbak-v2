import { Box, Divider, Typography } from "@mui/material";
import api from "api";
import UserCard from "./UserCard";
import { AppBarHeight } from "constants";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const ActiveUsers = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("chats/users");
        setUsers(res.data.data);
      } catch (error) {
        console.log("error: ", error);
      }
    };

    fetchUsers();
  }, [dispatch]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
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
          Active Users
        </Typography>

        <Divider sx={{ mt: 1.5 }} />
      </Box>

      {users.map((user) => (
        <UserCard
          key={user._id}
          user={user}
          onClick={() => {
            createNewChat(user._id);
          }}
        />
      ))}
    </Box>
  );
};

export default ActiveUsers;
