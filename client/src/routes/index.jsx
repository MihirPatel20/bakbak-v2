import { Navigate, useRoutes } from "react-router-dom";

import ProtectedRoutes from "@/utils/ProtectedRoutes";
import dashboardRoutes from "./dashboardRoutes";
import AuthenticationRoutes from "./authenticationRoutes";
import MainLayout from "@/layout/MainLayout";
import appRoutes from "./appRoutes";
import RoleProtectedRoute from "utils/RoleProtectedRoutes";
import NotFound from "components/NotFound";

// ==============================|| ROUTING RENDER ||============================== //

export default function Routes() {
  return useRoutes([
    {
      path: "/",
      element: <Navigate to="/home" replace />,
    },
    {
      path: "",
      element: <ProtectedRoutes />,
      children: [
        {
          path: "",
          element: <MainLayout />,
          children: dashboardRoutes.map((route) => ({
            path: route.url,
            element: (
              <RoleProtectedRoute allowedRole={route.role}>
                {route.element}
              </RoleProtectedRoute>
            ),
          })),
        },
      ],
    },
    {
      path: "",
      element: <ProtectedRoutes />,
      children: [
        {
          path: "",
          element: <MainLayout />,
          children: appRoutes.map((route) => ({
            path: route.url,
            element: route.element,
          })),
        },
      ],
    },
    {
      path: "",
      children: AuthenticationRoutes.map((route) => ({
        path: route.url,
        element: route.element,
      })),
    },
    {
      path: "*",
      element: <NotFound/>,
    },
  ]);
}
