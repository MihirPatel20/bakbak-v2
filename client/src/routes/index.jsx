import AppLayout from "@/layout/app";
import { useRoutes } from "react-router-dom";

import ProtectedRoutes from "@/utils/ProtectedRoutes";
import AppRoutes from "./appRoutes";
import AuthenticationRoutes from "./authenticationRoutes";
import MainLayout from "@/layout/MainLayout";

// ==============================|| ROUTING RENDER ||============================== //

export default function Routes() {
  return useRoutes([
    {
      path: "",
      element: <ProtectedRoutes />,
      children: [
        {
          path: "",
          element: <MainLayout />,
          children: AppRoutes.map((route) => ({
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
  ]);
}
