import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import NotFound from "components/NotFound";
import { registerSW } from "@/serviceWorkerRegistration";

const RoleProtectedRoute = ({ children, allowedRole }) => {
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (auth.user) {
      registerSW();
    }
  }, [auth.user]);

  if (!auth.user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && allowedRole !== auth.user.role) {
    return <NotFound />;
  }

  return children;
};

export default RoleProtectedRoute;
