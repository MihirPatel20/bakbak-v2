import React, { useEffect, useState, useCallback } from "react";
import api from "api";
import {
  Box,
  Grid,
  CircularProgress,
  useMediaQuery,
  Container,
  Typography,
} from "@mui/material";
import ProfileCard from "components/shared/ProfileCard";
import useAuth from "hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@emotion/react";
import useLastElementObserver from "hooks/useLastElementObserver";

const FollowersList = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const { username } = useParams();

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const limit = matchDownSM ? 5 : 10;

  const fetchFollowers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get(
        `/follow/list/followers/${username}?page=${page}&limit=${limit}`
      );
      const fetchedUsers = res.data.data.followers || [];
      setUsers((prev) => [...prev, ...fetchedUsers]);
      setHasMore(res.data.data.hasNextPage);
    } catch (err) {
      console.error("Failed to fetch followers list:", err);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, username]);

  useEffect(() => {
    fetchFollowers();
  }, [fetchFollowers]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [isLoading, hasMore]);

  const lastUserRef = useLastElementObserver(isLoading, hasMore, loadMore);

  return (
    <Container sx={{ mb: matchDownSM ? 2 : 4 }}>
      <Typography variant="h4" fontWeight={200} component="h1" mb={3}>
        Followers
      </Typography>

      <Grid container spacing={{ sm: 1, md: 2 }}>
        {users.length > 0 ? (
          users.map((user, index) => {
            if (auth.user._id === user._id) return null;

            return (
              <Grid
                item
                xs={12}
                sm={6}
                lg={4}
                key={user._id}
                ref={index === users.length - 1 ? lastUserRef : null}
              >
                <ProfileCard
                  profile={user}
                  showFollowButton
                  onClick={() => navigate(`/profile/${user.account.username}`)}
                />
              </Grid>
            );
          })
        ) : !isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            my={4}
          >
            No one found
          </Box>
        ) : null}

        {isLoading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            my={4}
          >
            <CircularProgress />
          </Box>
        )}
      </Grid>
    </Container>
  );
};

export default FollowersList;
