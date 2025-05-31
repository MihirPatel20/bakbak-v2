// Desc: Main entry point for the application

//import dependencies
import React from "react";

// Mui
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";

//import components
import Routes from "./routes/index.jsx";
import NavigationScroll from "@/layout/NavigationScroll.js";
import themes from "@/themes";
import { useSelector } from "react-redux";
import SnackbarAlert from "components/global/Snackbar.jsx";

// Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { setupInterceptors } from "api/setupInterceptors.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const App = () => {
  const customization = useSelector((state) => state.customization);
  setupInterceptors();

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <SnackbarAlert />

        <NavigationScroll>
          <Routes />
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
