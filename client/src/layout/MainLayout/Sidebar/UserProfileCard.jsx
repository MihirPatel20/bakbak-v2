import React from "react";
import useAuth from "hooks/useAuth";

// material-ui
import { styled, useTheme } from "@mui/material/styles";
import {
  Avatar,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Chip,
  Box,
  LinearProgress,
  linearProgressClasses,
} from "@mui/material";

// assets
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { getUserAvatarUrl } from "utils/getImageUrl";

// styles
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 6,
  borderRadius: 30,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "#fff",
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.primary[200],
  },
}));

const CardStyle = styled(Card)(({ theme }) => ({
  background: theme.palette.primary.light,
  marginBottom: "22px",
  overflow: "hidden",
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    width: "157px",
    height: "157px",
    background: theme.palette.primary[200],
    borderRadius: "50%",
    top: "-105px",
    right: "-96px",
  },
}));

// ==============================|| SIDEBAR USER PROFILE CARD ||============================== //

const UserProfileCard = () => {
  const theme = useTheme();
  const { user } = useAuth();

  return (
    <CardStyle>
      <CardContent sx={{ p: 2, "&:last-child": { pb: 1 } }}>
        <List sx={{ p: 0, m: 0 }}>
          <ListItem alignItems="flex-start" disableGutters sx={{ p: 0 }}>
            <ListItemAvatar sx={{ mt: 0 }}>
              <Avatar
                src={getUserAvatarUrl(user.avatar)}
                variant="rounded"
                sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.largeAvatar,
                  width: 48,
                  height: 48,
                  marginRight: "12px",
                }}
              >
                {!user.avatar.url && !user.avatar.localPath && (
                  <PersonOutlineIcon fontSize="inherit" />
                )}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              sx={{ mt: 0 }}
              primary={
                <Typography
                  variant="h5"
                  fontSize={16}
                  sx={{ color: theme.palette.primary[800] }}
                >
                  {user.username}
                </Typography>
              }
              secondary={
                <Typography variant="subtitle2">{user.email}</Typography>
              }
            />
          </ListItem>

          <Box display="flex" justifyContent="center" pt={1} pb={2}>
            <Chip
              label={user.role}
              color="primary"
              size="small"
              sx={{ fontSize: 12, height: "20px" }}
            />
          </Box>

          <BorderLinearProgress variant="determinate" value={100} />
        </List>
      </CardContent>
    </CardStyle>
  );
};

export default UserProfileCard;
