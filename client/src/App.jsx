// Desc: Main entry point for the application

//import dependencies
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "./routes.jsx";

//import components
import AppLayout from "@/layout/app/index.jsx";
import ProtectedRoutes from "@/utils/ProtectedRoutes";
import Login from "pages/auth/Login";
import "./styles/keyframes.scss";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<div>Register</div>} />
        <Route path="/forgot-password" element={<div>Forgot Password</div>} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<AppLayout />}>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Route>
        </Route>

        {/* Catch-all route for routes not matching any specified route */}
        <Route
          path="*"
          element={<div>The page you're looking for doesn't exist</div>}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
