import React from "react";
import { Avatar, Box, keyframes } from "@mui/material";
import { getUserAvatarUrl } from "utils/getImageUrl";

// Define keyframes for the typing bubble animation
const typingBubble = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0);
  }
`;

const TypingBubble = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        margin: "8px 0",
      }}
    >
      <Avatar
        src={getUserAvatarUrl("default-avatar-url")} // Replace with a real URL if needed
        alt="Typing"
        sx={{
          width: 32,
          height: 32,
          mr: 1,
        }}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: "8px 14px",
          maxWidth: "70%",
          wordWrap: "break-word",
          minWidth: "40px",
          bgcolor: "background.paper",
          color: "text.primary",
          borderRadius: "14px",
        }}
      >
        {[0, 0.2, 0.4].map((delay, index) => (
          <Box
            key={index}
            sx={{
              width: 8,
              height: 8,
              bgcolor: "grey.400",
              borderRadius: "50%",
              animation: `${typingBubble} 1s infinite`,
              animationDelay: `${delay}s`,
              mx: "2px",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default TypingBubble;
