import Login from "pages/auth/Login";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoutes from "@/utils/ProtectedRoutes";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<div>Register</div>} />
        <Route path="/forgot-password" element={<div>ForgotPassword</div>} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/home" element={<div>Home</div>} />
        </Route>
        <Route path="*" render={() => <div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
