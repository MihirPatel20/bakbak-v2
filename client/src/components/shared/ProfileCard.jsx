import React from "react";
import { Avatar, Box, Button, Card, Grid, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import { getUserAvatarUrl } from "utils/getImageUrl";
import api from "api";
import FolllowButton from "./FolllowButton";

const ProfileCard = ({ profile, onClick, showFollowButton }) => {
  const theme = useTheme();

  if (!profile) return null;

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
        src={getUserAvatarUrl(profile.account.avatar)}
        alt={profile.username}
        sx={{ width: 48, height: 48, margin: 1 }}
      />
      <Box>
        <Grid container direction="column">
          <Typography variant="body1" component="div">
            {profile.firstName} {profile.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            @{profile.account.username}
          </Typography>
        </Grid>
      </Box>

      {showFollowButton && (
        <Box sx={{ marginLeft: "auto", marginRight: 2 }}>
          <FolllowButton profile={profile} />
        </Box>
      )}
    </Card>
  );
};

export default ProfileCard;
