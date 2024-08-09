import React, { useEffect, useState, useCallback, useRef } from "react";
import api from "api";
import {
  Box,
  Container,
  Grid,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import ProfileCard from "components/shared/ProfileCard";
import useAuth from "hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";

const ExplorePage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const observer = useRef();
  const lastUserElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, isFetching]
  );

  const getLimit = useCallback(() => {
    return matchDownSM ? 5 : 10;
  }, [matchDownSM]);

  const limit = getLimit();

  const fetchUsers = useCallback(async (pageNumber) => {
    setIsFetching(true);
    try {
      const response = await api.get(
        `/profile/all?page=${pageNumber}&${limit}`
      );
      console.log("response: ", response);
      const fetchedUsers = response.data.data.profiles;
      setUsers((prevUsers) => [...prevUsers, ...fetchedUsers]);
      setHasMore(response.data.data.hasNextPage);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    console.log("page: ", page);
    fetchUsers(page);
  }, [fetchUsers, page]);

  return (
    <Container sx={{ px: 2 }}>
      <h1>Explore Page</h1>
      
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

        {isFetching && (
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
    </Container>
  );
};

export default ExplorePage;
