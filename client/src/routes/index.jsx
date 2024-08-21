import { Navigate, useRoutes } from "react-router-dom";

import ProtectedRoutes from "@/utils/ProtectedRoutes";
import dashboardRoutes from "./dashboardRoutes";
import AuthenticationRoutes from "./authenticationRoutes";
import MainLayout from "@/layout/MainLayout";
import appRoutes from "./appRoutes";
import RoleProtectedRoute from "utils/RoleProtectedRoutes";
import NotFound from "components/NotFound";
import PostView from "views/post";
import Test from "views/test";
import SearchView from "views/search";

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
          children: [
            ...dashboardRoutes.map((route) => ({
              path: route.url,
              element: (
                <RoleProtectedRoute allowedRole={route.role}>
                  {route.element}
                </RoleProtectedRoute>
              ),
            })),
            {
              path: "/p/:postId",
              element: <PostView />,
            },
            {
              path: "/search",
              element: <SearchView />,
            },
            {
              path: "/test",
              element: <Test />,
            },
          ],
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
      element: <NotFound />,
    },
  ]);
}
