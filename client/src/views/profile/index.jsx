import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Divider,
  Grid,
  Button,
  Container,
} from "@mui/material";
import { LocationOn, Email, Phone } from "@mui/icons-material";
import api from "api";
import { getUserAvatarUrl } from "utils/getImageUrl";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  OwnerComponent,
  VisitorComponent,
} from "utils/AuthorizationComponents";
import FolllowButton from "components/shared/FolllowButton";
import PostGrid from "../post/PostGrid";
import CoverImage from "./CoverImage";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);

  const auth = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const { username } = useParams();
  const currentProfileUsername = username || auth.user.username;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`profile/u/${currentProfileUsername}`);
        setProfile(response.data.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, [currentProfileUsername]);

  if (!profile) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  const getOrCreateChat = async (userId) => {
    try {
      const response = await api.post(`/chats/c/${userId}`);
      const chat = response.data.data;
      navigate(`/messages/direct/u/${chat._id}`, { state: { chat } });
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };

  const { followersCount, followingCount, totalPosts } = profile;
  const { bio, location, phoneNumber, account } = profile;
  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <Container sx={{ px: 2 }}>
      <CoverImage profile={profile} />

      <Grid container spacing={2}>
        <Grid
          item
          //  sx={{ flex: { xs: 1, sm: 0 } }}
        >
          <Box
            sx={{
              display: "flex",
              // flexDirection: { xs: "column", sm: "row" },
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              mt: -9,
              ml: 3,
            }}
          >
            <Avatar
              src={getUserAvatarUrl(profile?.account?.avatar)}
              sx={{ width: 150, height: 150, border: "5px solid white" }}
            />
            <OwnerComponent id={profile.account._id}>
              <Button
                variant="contained"
                onClick={() => navigate(`/profile/edit/${profile.account._id}`)}
              >
                Edit Profile
              </Button>
            </OwnerComponent>
          </Box>
        </Grid>

        <Grid item>
          <Box
            sx={{
              ml: { xs: 0, sm: 5 },
              mt: { xs: 2, sm: 2 },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h1">{fullName}</Typography>
            <Typography variant="body1" gutterBottom>
              @{account.username}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {bio}
            </Typography>
          </Box>
        </Grid>

        <Grid item>
          <VisitorComponent id={profile.account._id}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
              <FolllowButton profile={profile} />
              <Button
                disableElevation
                size="small"
                variant="contained"
                onClick={() => {
                  getOrCreateChat(profile.account._id);
                }}
              >
                Message
              </Button>
            </Box>
          </VisitorComponent>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid
          item
          xs={4}
          sx={{ textAlign: "center", cursor: "pointer" }}
          onClick={() => navigate(`/followers/${profile.account.username}`)}
        >
          <Typography variant="h6">{followersCount}</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Followers
          </Typography>
        </Grid>
        <Grid
          item
          xs={4}
          sx={{ textAlign: "center", cursor: "pointer" }}
          onClick={() => navigate(`/following/${profile.account.username}`)}
        >
          <Typography variant="h6">{followingCount}</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Following
          </Typography>
        </Grid>
        <Grid item xs={4} sx={{ textAlign: "center" }}>
          <Typography variant="h6">{totalPosts}</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Posts
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Box
        mb={4}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ m: 2 }}
        >
          <Typography variant="h1">Posts</Typography>
        </Box>

        <PostGrid currentProfileUsername={currentProfileUsername} />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <LocationOn sx={{ mr: 1 }} />
            <Typography variant="body1">{location}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Phone sx={{ mr: 1 }} />
            <Typography variant="body1">{phoneNumber}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Email sx={{ mr: 1 }} />
            <Typography variant="body1">{account.email}</Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
