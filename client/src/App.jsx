import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<div>Login</div>} />
        <Route path="/register" element={<div>Register</div>} />
        <Route path="/forgotpassword" element={<div>ForgotPassword</div>} />
        <Route path="/" element={<div>Home</div>} />
        <Route path="*" render={() => <div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
