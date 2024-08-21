import React, { useEffect, useState, useCallback } from "react";
import api from "api";
import { Box, Grid, CircularProgress, useMediaQuery } from "@mui/material";
import ProfileCard from "components/shared/ProfileCard";
import useAuth from "hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import useLastElementObserver from "hooks/useLastElementObserver";

const ExploreProfiles = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const limit = matchDownSM ? 5 : 10;

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get(
        `/profile/all?page=${page}&limit=${limit}`
      );
      const fetchedUsers = response.data.data.profiles;
      setUsers((prevUsers) => [...prevUsers, ...fetchedUsers]);
      setHasMore(response.data.data.hasNextPage);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoading, hasMore]);

  const lastUserElementRef = useLastElementObserver(
    isLoading,
    hasMore,
    loadMore
  );

  return (
    <Grid container spacing={3}>
      {users.length > 0 ? (
        users.map((user, index) => {
          if (auth.user._id === user.account._id) return null;

          return (
            <Grid
              item
              xs={12}
              sm={6}
              lg={4}
              key={user._id}
              ref={index === users.length - 1 ? lastUserElementRef : null}
            >
              <ProfileCard
                profile={user}
                showFollowButton
                onClick={() => navigate(`/profile/${user.account.username}`)}
              />
            </Grid>
          );
        })
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width={"100%"}
          my={4}
        >
          No users available
        </Box>
      )}

      {isLoading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width={"100%"}
          my={4}
        >
          <CircularProgress />
        </Box>
      )}
    </Grid>
  );
};

export default ExploreProfiles;
