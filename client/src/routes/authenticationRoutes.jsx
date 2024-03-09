import Login from "pages/auth/Login";

// Array of authentication routes
export const authenticationRoutes = [
  {
    title: "Login",
    id: "login",
    icon: null,
    url: "/login",
    element: <Login />,
  },
  {
    title: "Register",
    id: "register",
    icon: null,
    url: "/register",
    element: <div>Register</div>,
  },
  {
    title: "Forgot Password",
    id: "forgot-password",
    icon: null,
    url: "/forgot-password",
    element: <div>Forgot Password</div>,
  },
];

export const additionalRoutes = [
  {
    title: "Ecommerce",
    id: "ecommerce",
    icon: null,
    element: <div>Welcome to Ecommerce</div>,
  },
  {
    title: "More",
    id: "more",
    icon: null,
    element: <div>Welcome to More</div>,
  },
];

export default authenticationRoutes;
