import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Box, Typography } from "@mui/material";
import UserCard from "components/shared/UserCard";
import api from "api";

const UsersList = ({ setActiveChat }) => {
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

  const createNewChat = async (reciepentId) => {
    try {
      const response = await api.post("/chats/c/" + reciepentId);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        height: {
          xs: "calc(100vh - 72px)",
          sm: "calc(100vh - 80px)",
        },
        overflow: "auto",
        // border: "1px solid gray",
      }}
    >
      <Typography variant="h6" component="div" textAlign={"center"}>
        Users
      </Typography>
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

export default UsersList;
