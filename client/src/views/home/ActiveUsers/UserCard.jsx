import React from "react";
import { Avatar, Box, Card, Grid, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";

const UserCard = ({ user, onClick }) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        bgcolor: theme.palette.primary.light,
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        minHeight: 70,
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
          <Typography variant="body2" color="text.secondary" noWrap>
            {user.email}
          </Typography>
        </Grid>
      </Box>
    </Card>
  );
};

export default UserCard;
