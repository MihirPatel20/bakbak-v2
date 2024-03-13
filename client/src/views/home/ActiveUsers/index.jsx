import { Box, Divider, Typography } from "@mui/material";
import api from "api";
import UserCard from "./UserCard";
import { AppBarHeight } from "constants";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ActiveUsers = () => {
  const auth = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
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
          Friends
        </Typography>

        <Divider sx={{ mt: 1.5 }} />
      </Box>

      {users.map((user) => (
        <UserCard
          key={user._id}
          user={user}
          onClick={() => navigate(`/profile/${user._id}`, { state: { user } })}
        />
      ))}
    </Box>
  );
};

export default ActiveUsers;
