// Desc: Main entry point for the application

//import dependencies
import React from "react";

// Mui
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";

//import components
import Routes from "./routes/index.jsx";
import "./styles/keyframes.scss";
import NavigationScroll from "@/layout/NavigationScroll.js";

const App = () => {
  return (
    <StyledEngineProvider injectFirst>
      <CssBaseline />

      <NavigationScroll>
        <Routes />
      </NavigationScroll>
    </StyledEngineProvider>
  );
};

export default App;
