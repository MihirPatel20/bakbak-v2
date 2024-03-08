import Login from "pages/auth/Login";

// Array of authentication routes
export const authenticationRoutes = [
  {
    name: "Login",
    key: "login",
    icon: null,
    path: "/login",
    element: <Login />,
  },
  {
    name: "Register",
    key: "register",
    icon: null,
    path: "/register",
    element: <div>Register</div>,
  },
  {
    name: "Forgot Password",
    key: "forgot-password",
    icon: null,
    path: "/forgot-password",
    element: <div>Forgot Password</div>,
  },
];

export const additionalRoutes = [
  {
    name: "Ecommerce",
    key: "ecommerce",
    icon: null,
    element: <div>Welcome to Ecommerce</div>,
  },
  {
    name: "More",
    key: "more",
    icon: null,
    element: <div>Welcome to More</div>,
  },
];

export default authenticationRoutes;
