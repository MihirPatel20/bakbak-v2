import Login from "pages/auth/Login";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<div>Register</div>} />
        <Route path="/forgot-password" element={<div>ForgotPassword</div>} />
        <Route path="/" element={<div>Home</div>} />
        <Route path="*" render={() => <div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
