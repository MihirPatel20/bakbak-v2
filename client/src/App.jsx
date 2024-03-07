import Login from "pages/auth/Login";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoutes from "@/utils/ProtectedRoutes";
import Home from "pages/home/Home";
import AdminPanel from "pages/auth/AdminPanel";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<div>Register</div>} />
        <Route path="/forgot-password" element={<div>ForgotPassword</div>} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/home" element={<Home />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Route>
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
