import { Box, Button } from "@mui/material";
import api from "api";
import React, { useState } from "react";
import { VisitorComponent } from "utils/AuthorizationComponents";
import useSnackbar from "hooks/useSnackbar";

const FolllowButton = (props) => {
  const { profile, ...restProps } = props;
  const showSnackbar = useSnackbar();
  const [isFollowing, setIsFollowing] = useState(profile?.isFollowing);

  if (!profile) return null;

  const handleFollowClick = async (e) => {
    e.stopPropagation();

    const prevState = isFollowing;

    // Update UI immediately for a snappy user experience (optimistic update)
    setIsFollowing(!isFollowing);

    try {
      // Send follow/unfollow request to server
      const response = await api.post(`/follow/${profile.account._id}`);

      // Sync local state with server response (in case it differs)
      setIsFollowing(response.data.data.following);
    } catch (error) {
      console.error("Follow/unfollow failed:", error);

      // Revert UI state on failure
      setIsFollowing(prevState);

      // Show error message (you still need to dispatch this!)
      showSnackbar(
        "error",
        isFollowing
          ? "Failed to unfollow user. Please try again."
          : "Failed to follow user. Please try again."
      );
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
