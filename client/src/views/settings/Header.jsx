import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Header = ({ title, onBack }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      borderBottom: "1px solid #ddd",
      mb: 2,
      pb: 1,
    }}
  >
    <IconButton onClick={onBack} edge="start" aria-label="back">
      <ArrowBackIcon />
    </IconButton>
    <Typography variant="h5" component="div" sx={{ ml: 1, pt: "1px" }}>
      {title}
    </Typography>
  </Box>
);

export default Header;
