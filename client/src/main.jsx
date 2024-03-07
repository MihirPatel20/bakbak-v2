import React from "react";
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App.jsx";
import store from "@/reducer/store.js";
import { Provider } from "react-redux";
import { SocketProvider } from "context/SocketContext.jsx";
import SnackbarAlert from "components/global/Snackbar.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <CssBaseline />

    <Provider store={store}>
      <SocketProvider>
        <SnackbarAlert />
        
        <App />
      </SocketProvider>
    </Provider>
  </>
);
