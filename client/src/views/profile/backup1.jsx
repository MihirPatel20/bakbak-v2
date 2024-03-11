import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Divider,
  Grid,
  Button,
} from "@mui/material";
import { LocationOn, Email, Phone } from "@mui/icons-material";
import api from "api";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("profile");
        setProfile(response.data.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <Typography variant="h6">Loading...</Typography>;
  }
  const { account, bio, followersCount, followingCount, coverImage } = profile;
  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          height: "250px",
          backgroundImage: `url(${coverImage.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: -8,
        }}
      >
        <Avatar
          src={account.avatar.url}
          sx={{ width: 150, height: 150, border: "5px solid white" }}
        />
        <Typography variant="h5" gutterBottom>
          {fullName}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {bio}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mr: 4,
            }}
          >
            <Typography variant="h6">{followingCount}</Typography>
            <Typography variant="body2">Following</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              ml: 4,
            }}
          >
            <Typography variant="h6">{followersCount}</Typography>
            <Typography variant="body2">Followers</Typography>
          </Box>
        </Box>
        <Button variant="contained" sx={{ mt: 2 }}>
          Edit Profile
        </Button>
      </Box>
    </Box>
  );
};
export default ProfilePage;
