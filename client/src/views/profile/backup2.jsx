import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Divider,
  Grid,
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
  const { coverImage, bio, location, email, phoneNumber, account } = profile;

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
      
      <Box sx={{ mt: -10, ml: 3, display: "flex" }}>
        <Avatar
          alt={`${firstName} ${lastName}`}
          src={account.avatar.url}
          sx={{ width: 160, height: 160 }}
        />
      </Box>
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="h5">{`${firstName} ${lastName}`}</Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          {bio}
        </Typography>
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
          <IconButton>
            <Email />
          </IconButton>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {email}
          </Typography>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <LocationOn sx={{ mr: 1 }} />
        <Typography variant="body1">{location}</Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Phone sx={{ mr: 1 }} />
        <Typography variant="body1">{phoneNumber}</Typography>
      </Box>
    </Box>
  );
};

export default ProfilePage;
