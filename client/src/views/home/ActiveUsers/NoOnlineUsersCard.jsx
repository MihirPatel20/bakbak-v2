import { Card, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const NoOnlineUsersCard = () => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        bgcolor: theme.palette.primary.light,
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        minHeight: 70,
        justifyContent: "center", // Center the text horizontally
      }}
    >
      <Typography variant="body1" color="textSecondary">
        No users online
      </Typography>
    </Card>
  );
};

export default NoOnlineUsersCard;
