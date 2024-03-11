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

  const { firstName, lastName, followersCount, followingCount } = profile;
  const { bio, location, email, phoneNumber, account } = profile;
  const fullName = `${profile.firstName} ${profile.lastName}`;

  const coverImageUrl = profile?.coverImage?.localPath
    ? `${
        import.meta.env.VITE_SERVER_BASE_URI +
        "/" +
        profile?.coverImage?.localPath
      }`
    : profile?.coverImage?.url;

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          height: "250px",
          backgroundImage: `url(${coverImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <Box sx={{ display: "flex" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            // alignItems: "center",
            justifyContent: "center",
            mt: -8,
            ml: 4,
          }}
        >
          <Avatar
            src={account.avatar.url}
            sx={{ width: 150, height: 150, border: "5px solid white" }}
          />
          <Button variant="contained" sx={{ mt: 1 }}>
            Edit Profile
          </Button>
        </Box>

        <Box sx={{ ml: 5, display: "flex", flexDirection: "column" }}>
          <Typography variant="h1">{fullName}</Typography>
          <Typography variant="body1" gutterBottom>
            @{account.username}
          </Typography>

          <Typography variant="body1" gutterBottom>
            {bio}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={4} sx={{ textAlign: "center" }}>
          <Typography variant="h6">{followersCount}</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Followers
          </Typography>
        </Grid>
        <Grid item xs={4} sx={{ textAlign: "center" }}>
          <Typography variant="h6">{followingCount}</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Following
          </Typography>
        </Grid>
        <Grid item xs={4} sx={{ textAlign: "center" }}>
          <Typography variant="h6">21</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Posts
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 2,
          height: "200px",
        }}
      >
        <Typography variant="h1" sx={{ mt: 2 }}>
          Posts
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <LocationOn sx={{ mr: 1 }} />
        <Typography variant="body1">{location}</Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Phone sx={{ mr: 1 }} />
        <Typography variant="body1">{phoneNumber}</Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Email sx={{ mr: 1 }} />
        <Typography variant="body1">{account.email}</Typography>
      </Box>
    </Box>
  );
};

export default ProfilePage;
