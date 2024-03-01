import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllUsers } from "@/redux/authReducer/authThunk";
import { Avatar, Box, Card, Grid, Typography } from "@mui/material";

const UserCard = ({ user }) => {
  return (
    <Card
      elevation={0}
      sx={{
        display: "flex",
        alignItems: "center",
        width: "auto",
        border: "1px solid grey",
        cursor: "pointer",
      }}
    >
      <Avatar
        src={user.avatar.url}
        alt={user.username}
        sx={{ width: 48, height: 48, margin: 1 }}
      />
      <Box>
        <Grid container direction="column">
          <Typography variant="body1" component="div">
            {user.username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Grid>
      </Box>
    </Card>
  );
};

const UsersList = () => {
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
        p: 1,
        height: {
          xs: "calc(100vh - 56px)",
          sm: "calc(100vh - 64px)",
        },
        border: "1px solid gray",
      }}
    >
      {users.map((user) => (
        <UserCard key={user._id} user={user} />
      ))}
    </Box>
  );
};

export default UsersList;
