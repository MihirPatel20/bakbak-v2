import React from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      p={3}
      mt={10}
    >
      <Typography variant="h4" gutterBottom>
        Sorry, this page isn't available.
      </Typography>
      <Typography variant="body1" paragraph>
        The link you followed may be broken, or the page may have been removed.
        <Typography
          variant="body2"
          component={Link}
          to="/"
          style={{ textDecoration: "none" }}
        >
          {" "}
          Go back to BAKBAK
        </Typography>
      </Typography>
    </Box>
  );
};

export default NotFound;
