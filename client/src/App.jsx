import { CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";

// Material Dashboard 2 React themes
import theme from "assets/theme";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
import { useMaterialUIController } from "context";
import Ecommerce from "pages/Ecommerce";

const App = () => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  console.log("theme: ", theme);

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      <Ecommerce />
    </ThemeProvider>
  );
};

export default App;
