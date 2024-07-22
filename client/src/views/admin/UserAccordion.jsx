// UserAccordion.js
import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Typography,
  Avatar,
  Box,
  Pagination,
  useMediaQuery,
  useTheme,
  Divider,
  Chip,
  Skeleton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import api from "api";
import { getUserAvatarUrl } from "utils/getImageUrl";
import SearchSection from "components/global/SearchSection";

const UserAccordion = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const usersPerPage = 5;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/users`, {
        params: {
          page,
          limit: usersPerPage,
          search,
        },
      });
      setUsers(response.data.data.users);
      setTotalUsers(response.data.data.totalUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1); // Reset to first page on new search
  };

  const UserSkeleton = () => (
    <Accordion>
      <AccordionSummary>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Skeleton variant="circular" width={40} height={40} />
          </Grid>
          {!isMobile ? (
            <>
              <Grid item xs={3}>
                <Skeleton variant="text" width="80%" />
              </Grid>
              <Grid item xs={5}>
                <Skeleton variant="text" width="90%" />
              </Grid>
              <Grid item xs={2}>
                <Skeleton variant="rectangular" width={60} height={24} />
              </Grid>
            </>
          ) : (
            <Grid item>
              <Skeleton variant="text" width={120} />
              <Skeleton variant="text" width={150} />
              <Skeleton variant="text" width={80} />
            </Grid>
          )}
        </Grid>
      </AccordionSummary>
    </Accordion>
  );

  return (
    <Box>
      <Box display={"flex"} justifyContent={"space-between"} mb={2}>
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <Typography variant="h2">Users</Typography>
        </Box>
        <SearchSection
          searchValue={search}
          handleSearchChange={handleSearchChange}
        />
      </Box>

      {loading
        ? // Display skeletons while loading
          [...Array(usersPerPage)].map((_, index) => (
            <UserSkeleton key={index} />
          ))
        : // Display actual user data when loaded
          users.map((user) => (
            <Accordion key={user._id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${user._id}-content`}
                id={`panel-${user._id}-header`}
              >
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Avatar
                      src={getUserAvatarUrl(user.avatar)}
                      alt={user.username}
                    />
                  </Grid>
                  {!isMobile ? (
                    <>
                      <Grid item xs={3}>
                        <Typography>{user.username}</Typography>
                      </Grid>
                      <Grid item xs={5}>
                        <Typography>{user.email}</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Chip
                          label={user.role}
                          size="small"
                          color={
                            user.role === "ADMIN" ? "secondary" : "default"
                          }
                        />
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item>
                        <Typography>{user.username}</Typography>
                        <Typography>{user.email}</Typography>
                        <Typography>{user.role}</Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>First Name:</strong> {user.firstName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Last Name:</strong> {user.lastName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Login Type:</strong> {user.loginType}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Email Verified:</strong>{" "}
                      {user.isEmailVerified ? "Yes" : "No"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Online:</strong> {user.online ? "Yes" : "No"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Last Seen:</strong>{" "}
                      {new Date(user.lastSeen).toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Created At:</strong>{" "}
                      {new Date(user.createdAt).toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Updated At:</strong>{" "}
                      {new Date(user.updatedAt).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}

      <Box mt={2} display="flex" justifyContent="flex-end">
        <Pagination
          count={Math.ceil(totalUsers / usersPerPage)}
          page={page}
          onChange={handleChangePage}
        />
      </Box>

      <Divider sx={{ my: 2 }} />
    </Box>
  );
};

export default UserAccordion;
