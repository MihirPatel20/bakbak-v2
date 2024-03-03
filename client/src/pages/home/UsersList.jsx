import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllUsers } from "@/redux/authReducer/authThunk";
import { Box, Typography } from "@mui/material";
import UserCard from "components/shared/UserCard";
import { LocalStorage } from "@/utils/LocalStorage";

const UsersList = ({ setActiveChat }) => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await dispatch(getAllUsers()).unwrap();
        setUsers(res);
      } catch (error) {
        console.log("error: ", error);
      }
    };

    fetchUsers();
  }, [dispatch]);

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
            setActiveChat(user);

            // Store in local storage
            LocalStorage.set("activeChat", user);
          }}
        />
      ))}
    </Box>
  );
};

export default UsersList;
