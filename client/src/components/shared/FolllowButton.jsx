import { Box, Button } from "@mui/material";
import api from "api";
import React, { useState } from "react";
import { VisitorComponent } from "utils/AuthorizationComponents";

const FolllowButton = (props) => {
  const { profile, ...restProps } = props;
  const [isFollowing, setIsFollowing] = useState(profile?.isFollowing);

  if (!profile) return null;

  const handleFollowClick = async (e) => {
    e.stopPropagation();
    try {
      const response = await api.post(`/follow/${profile.account._id}`);
      setIsFollowing(response.data.data.following);
      console.log("Follow response:", response.data.data);
    } catch (error) {
      console.error("Failed to follow:", error);
    }
  };

  return (
    <VisitorComponent id={profile.account._id}>
      <Button
        disableElevation
        size="small"
        variant={isFollowing ? "outlined" : "contained"}
        onClick={handleFollowClick}
        {...restProps}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
    </VisitorComponent>
  );
};

export default FolllowButton;
