import {
  Box,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import api from "api";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostGrid from "./PostGrid";
import ProfileCard from "components/shared/ProfileCard";

const SearchView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q");

  const [profiles, setProfiles] = React.useState([]);
  const [posts, setPosts] = React.useState([]);

  const fetchSearchResults = async (query) => {
    try {
      const response = await api.get(`/search?query=${query}`);

      const { socialProfiles, posts } = response.data.data;
      // console.log("socialProfiles:", socialProfiles);
      // console.log("posts:", posts);
      setProfiles(socialProfiles);
      setPosts(posts);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  useEffect(() => {
    fetchSearchResults(query);
  }, [query]);

  return (
    <Container>
      <Typography variant="h4">Search Results</Typography>

      {profiles?.length > 0 && (
        <>
          <Typography variant="h5" mt={4} mb={2}>
            Profiles
          </Typography>
          <Grid container spacing={3}>
            {profiles?.map((profile) => (
              <Grid item xs={12} sm={6} lg={4} key={profile._id}>
                <ProfileCard
                  profile={profile}
                  showFollowButton
                  onClick={() =>
                    navigate(`/profile/${profile.account.username}`)
                  }
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {posts?.length > 0 && (
        <>
          <Typography variant="h5" mt={4} mb={2}>
            Posts
          </Typography>
          <PostGrid posts={posts} />
        </>
      )}
    </Container>
  );
};

export default SearchView;
