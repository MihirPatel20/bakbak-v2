import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import store from "reducer/store.js";
import { Provider } from "react-redux";
import { SocketProvider } from "context/SocketContext.jsx";
import { BrowserRouter } from "react-router-dom";

import "assets/scss/style.scss";
import "assets/scss/keyframes.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <SocketProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SocketProvider>
  </Provider>
);
