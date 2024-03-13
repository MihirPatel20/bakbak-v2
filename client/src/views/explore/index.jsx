import React, { useEffect, useState } from "react";
import api from "api";
import { Grid } from "@mui/material";
import ProfileCard from "components/shared/ProfileCard";
import useAuth from "hooks/useAuth";
import { useNavigate } from "react-router-dom";

const ExplorePage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/profile/all");
        setUsers(response.data.data);
        console.log("Users:", response.data.data[0]);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Explore Page</h1>
      <Grid container spacing={3}>
        {users &&
          users.map((user) => {
            if (auth.user._id === user.account._id) return null;
            
            return (
              <Grid item xs={12} sm={6} lg={4} key={user._id}>
                <ProfileCard
                  profile={user}
                  showFollowButton
                  onClick={() => navigate(`/profile/${user.account.username}`)}
                />
              </Grid>
            );
          })}
      </Grid>
    </div>
  );
};

export default ExplorePage;
