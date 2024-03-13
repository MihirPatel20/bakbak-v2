import { lazy } from "react";

import Loadable from "ui-component/Loadable";
const AuthLogin3 = Loadable(
  lazy(() => import("views/authentication/authentication3/Login3"))
);
const AuthRegister3 = Loadable(
  lazy(() => import("views/authentication/authentication3/Register3"))
);

// Array of authentication routes
export const authenticationRoutes = [
  {
    title: "Login",
    id: "login",
    icon: null,
    url: "/login",
    element: <AuthLogin3 />,
  },
  {
    title: "Register",
    id: "register",
    icon: null,
    url: "/register",
    element: <AuthRegister3 />,
  },
  {
    title: "Forgot Password",
    id: "forgot-password",
    icon: null,
    url: "/forgot-password",
    element: <div>Forgot Password</div>,
  },
];

export default authenticationRoutes;
