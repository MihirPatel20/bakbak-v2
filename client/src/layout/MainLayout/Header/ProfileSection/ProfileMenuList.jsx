import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Typography,
  Grid,
} from "@mui/material";
import {
  IconSettings,
  IconUserCircle,
  IconUsers,
} from "@tabler/icons-react";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useAuth from "hooks/useAuth";

const ProfileMenuList = ({ selectedIndex, handleClick }) => {
  const theme = useTheme();
  const { auth } = useAuth();
  const customization = useSelector((state) => state.customization);

  return (
    <List
      component="nav"
      sx={{
        width: "100%",
        maxWidth: 350,
        minWidth: 300,
        backgroundColor: theme.palette.background.paper,
        borderRadius: "10px",
        [theme.breakpoints.down("md")]: {
          minWidth: "100%",
        },
      }}
    >
      <ListItemButton
        sx={{ borderRadius: `${customization.borderRadius}px` }}
        selected={selectedIndex === 0}
        onClick={(e) => handleClick(e, 0, "/settings")}
      >
        <ListItemIcon>
          <IconSettings stroke={1.5} size="1.3rem" />
        </ListItemIcon>
        <ListItemText
          primary={<Typography variant="body2">Account Settings</Typography>}
        />
      </ListItemButton>

      <ListItemButton
        sx={{ borderRadius: `${customization.borderRadius}px` }}
        selected={selectedIndex === 1}
        onClick={(e) => handleClick(e, 1, "/profile")}
      >
        <ListItemIcon>
          <IconUserCircle stroke={1.5} size="1.3rem" />
        </ListItemIcon>
        <ListItemText
          primary={
            <Grid container spacing={1} justifyContent="space-between">
              <Grid item>
                <Typography variant="body2">My Profile</Typography>
              </Grid>
              <Grid item>
                <Chip
                  label="02"
                  size="small"
                  sx={{
                    bgcolor: theme.palette.warning.dark,
                    color: theme.palette.background.default,
                  }}
                />
              </Grid>
            </Grid>
          }
        />
      </ListItemButton>

      <ListItemButton
        sx={{ borderRadius: `${customization.borderRadius}px` }}
        selected={selectedIndex === 2}
        onClick={(e) =>
          handleClick(e, 2, `/following/${auth?.user?.username || ""}`)
        }
      >
        <ListItemIcon>
          <IconUsers stroke={1.5} size="1.3rem" />
        </ListItemIcon>
        <ListItemText
          primary={
            <Grid container spacing={1} justifyContent="space-between">
              <Grid item>
                <Typography variant="body2">Friends</Typography>
              </Grid>
              <Grid item>
                <Chip
                  label="5"
                  size="small"
                  sx={{
                    bgcolor: theme.palette.success.dark,
                    color: theme.palette.background.default,
                  }}
                />
              </Grid>
            </Grid>
          }
        />
      </ListItemButton>
    </List>
  );
};

export default ProfileMenuList;
