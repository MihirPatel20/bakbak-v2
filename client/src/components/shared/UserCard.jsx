import React from "react";
import { Avatar, Box, Card, Grid, Typography } from "@mui/material";

const UserCard = ({ user, onClick }) => {
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
      onClick={onClick}
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

export default UserCard;
