import React, { Children } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import NotFound from "components/NotFound";

const RoleProtectedRoute = ({ children, allowedRole }) => {
  const auth = useSelector((state) => state.auth);

  console.log("allowedRole:", allowedRole);
  console.log("auth.user.role:", auth.user.role);

  if (!auth.user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && allowedRole !== auth.user.role) {
    return <NotFound />;
  }

  console.log("show outlet");
  return children;
};

export default RoleProtectedRoute;
