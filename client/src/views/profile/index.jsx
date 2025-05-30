import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Divider,
  Grid,
  Button,
  Container,
  Skeleton,
  Stack,
  Link,
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
import { BrowserView, MobileView } from "react-device-detect";
import SkeletonProfileView from "./SkeletonProfileView";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [showMore, setShowMore] = useState(false);

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

  const getOrCreateChat = async (userId) => {
    try {
      const response = await api.post(`/chats/c/${userId}`);
      const chat = response.data.data;
      navigate(`/messages/direct/u/${chat._id}`, { state: { chat } });
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };

  if (!profile) return <SkeletonProfileView />;

  const { followersCount, followingCount, totalPosts } = profile;
  const { bio, location, phoneNumber, account } = profile;
  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <Container>
      <CoverImage
        profile={profile}
        sx={{
          height: { xs: "100px", sm: "200px" },
          borderRadius: 0.5,
          // Add overlay container
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.3) 0%, rgba(0, 0, 0, 0.0) 60%)",
            pointerEvents: "none", // Allows clicks to pass through
            // zIndex: 1,
          },
        }}
      />

      {/* MOBILE VIEW */}
      <MobileView>
        <Grid container direction="column" spacing={2}>
          {/* Top Row: Avatar + Buttons */}
          <Grid item>
            <Box
              sx={{
                display: "flex",
                // justifyContent: "space-between",
                alignItems: "center",
                px: 0.5,
              }}
            >
              <Box sx={{ textAlign: "left", mt: -8 }}>
                <Avatar
                  src={getUserAvatarUrl(profile?.account?.avatar)}
                  sx={{
                    width: 120,
                    height: 120,
                    border: "5px solid white",
                  }}
                />
              </Box>

              <Box sx={{ textAlign: "left", ml: 3, mt: -2 }}>
                <OwnerComponent id={profile.account._id}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() =>
                      navigate(`/profile/edit/${profile.account._id}`)
                    }
                  >
                    Edit Profile
                  </Button>
                </OwnerComponent>

                <VisitorComponent id={profile.account._id}>
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    <FolllowButton profile={profile} />
                    <Button
                      // sx={{ borderRadius: 2 }}
                      disableElevation
                      size="small"
                      variant="contained"
                      onClick={() => getOrCreateChat(profile.account._id)}
                    >
                      Message
                    </Button>
                  </Box>
                </VisitorComponent>
              </Box>
            </Box>

            {/* Buttons */}
            <Box sx={{ textAlign: "left", ml: 2, mt: 1 }}>
              <Grid item>
                {/* Name, Username, Bio */}
                <Typography variant="h4">{fullName}</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  lineHeight={0.8}
                  fontSize={12}
                >
                  @{account.username}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {bio}
                </Typography>

                {/* Links */}
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ flexWrap: "wrap", gap: 1, mt: 1 }}
                >
                  {profile?.links?.map((link, index) => (
                    <Link
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {new URL(link).hostname.replace("www.", "")}
                    </Link>
                  ))}
                </Stack>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </MobileView>

      {/* DESKTOP VIEW */}
      <BrowserView>
        {/* Main container */}
        <Grid container spacing={2} px={3} sx={{ mt: -12, zIndex: 2 }}>
          {/* Avatar + Edit button */}
          <Grid item mt={-1}>
            <Avatar
              src={getUserAvatarUrl(profile?.account?.avatar)}
              sx={{ width: 150, height: 150, border: "5px solid white", mb: 1 }}
            />
          </Grid>

          {/* Right Side */}
          <Grid item xs sx={{ zIndex: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              mt={2}
              ml={3}
            >
              {/* Name + Username */}
              <Box>
                <Typography variant="h1">{fullName}</Typography>
                <Typography variant="body1">@{account.username}</Typography>
              </Box>

              {/* Follow + Message / Edit -- Buttons */}
              <Box>
                <OwnerComponent id={profile.account._id}>
                  <Button
                    variant="contained"
                    onClick={() =>
                      navigate(`/profile/edit/${profile.account._id}`)
                    }
                  >
                    Edit Profile
                  </Button>
                </OwnerComponent>
                <VisitorComponent id={profile.account._id}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <FolllowButton profile={profile} />
                    <Button
                      disableElevation
                      size="small"
                      variant="contained"
                      onClick={() => getOrCreateChat(profile.account._id)}
                    >
                      Message
                    </Button>
                  </Box>
                </VisitorComponent>
              </Box>
            </Box>

            <Box mt={2} ml={3}>
              {/* Bio */}
              <Typography variant="body1">{bio}</Typography>

              {/* Links */}
              <Stack
                direction="row"
                spacing={1}
                sx={{ flexWrap: "wrap", gap: 1, mt: 1 }}
              >
                {profile?.links?.map((link, index) => (
                  <Link
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {new URL(link).hostname.replace("www.", "")}
                  </Link>
                ))}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </BrowserView>

      <Divider sx={{ mt: 2, mb: { xs: 1, sm: 2 } }} />

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

      <Divider sx={{ mb: 2, mt: { xs: 1, sm: 2 } }} />

      <Box mb={4}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          my={{ xs: 1, sm: 2 }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: 20, sm: 32 },
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Posts
          </Typography>
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
