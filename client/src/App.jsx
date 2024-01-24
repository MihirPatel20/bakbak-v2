import { CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";

// Material UI themes
import theme from "assets/theme";

// Material UI Dark Mode themes
import themeDark from "assets/theme-dark";
import { useMaterialUIController } from "context";
import LoginPage from "pages/Auth/LoginPage";
import { Route, Routes } from "react-router-dom";
import ExperimentsPage from "pages/Experiments";

const App = () => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />

      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<div>Sign Up</div>} />
        <Route path="/forgot" element={<div>Forgot Password</div>} />
        <Route path="/experiment-page" element={<ExperimentsPage />} />

        {/* Catch-all route for routes not matching any specified route */}
        <Route
          path="*"
          element={<div>The page you're looking for doesn't exist</div>}
        />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
