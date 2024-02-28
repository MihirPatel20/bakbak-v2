import { CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";

// Material Dashboard 2 React themes
import theme from "assets/theme";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
import { useMaterialUIController } from "context";
import LoginPage from "pages/Auth/LoginPage";
import SnackbarAlert from "components/common/Snackbar";

const App = () => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      <SnackbarAlert />
      <LoginPage />
    </ThemeProvider>
  );
};

export default App;
