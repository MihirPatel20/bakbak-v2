// material-ui
import { Link, Typography, Stack, Box } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
  <Stack direction="row" justifyContent="space-between">
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <GitHubIcon sx={{ mr: 1 }} />
      <Typography
        variant="subtitle2"
        component={Link}
        mt={0.3}
        href="https://github.com/MihirPatel20/bakbak-v2"
        target="_blank"
        underline="hover"
      >
        View on GitHub
      </Typography>
    </Box>
    <Typography variant="subtitle2" component={Link} href="#" underline="hover">
      &copy; bakbak.com
    </Typography>
  </Stack>
);

export default AuthFooter;
