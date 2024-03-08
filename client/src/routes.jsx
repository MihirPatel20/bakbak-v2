// routes.js
import AdminPanel from "pages/auth/AdminPanel";

const routes = [
  {
    name: "Home",
    key: "home",
    path: "/home",
    icon: null,
    element: <div>Welcome to Home</div>,
  },
  {
    name: "Explore",
    key: "explore",
    path: "/explore",
    icon: null,
    element: <div>Welcome to Explore</div>,
  },
  {
    name: "Messages",
    key: "messages",
    path: "/messages",
    icon: null,
    element: <div>Welcome to Messages</div>,
  },
  {
    name: "Notifications",
    key: "notifications",
    path: "/notifications",
    icon: null,
    element: <div>Welcome to Notifications</div>,
  },
  {
    name: "Create",
    key: "create",
    path: "/create",
    icon: null,
    element: <div>Welcome to Create</div>,
  },
  {
    name: "Profile",
    key: "profile",
    path: "/profile",
    icon: null,
    element: <div>Welcome to Profile</div>,
  },
  {
    name: "Settings",
    key: "settings",
    path: "/settings",
    icon: null,
    element: <div>Welcome to Settings</div>,
  },
  {
    name: "Admin Panel",
    key: "admin",
    path: "/admin",
    icon: null,
    element: <AdminPanel />,
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

export default routes;
