import AppLayout from "@/layout/app";
import { useRoutes } from "react-router-dom";

import ProtectedRoutes from "@/utils/ProtectedRoutes";
import AppRoutes from "./appRoutes";
import AuthenticationRoutes from "./authenticationRoutes";

// ==============================|| ROUTING RENDER ||============================== //

export default function Routes() {
  return useRoutes([
    {
      path: "",
      element: <ProtectedRoutes />,
      children: [
        {
          path: "",
          element: <AppLayout />,
          children: AppRoutes.map((route, index) => ({
            path: route.path,
            element: route.element,
          })),
        },
      ],
    },
    {
      path: "",
      children: AuthenticationRoutes.map((route, index) => ({
        path: route.path,
        element: route.element,
      })),
    },
  ]);
}
