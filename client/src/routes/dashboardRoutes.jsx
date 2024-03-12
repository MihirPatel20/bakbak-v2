import AdminPanel from "pages/auth/AdminPanel";
import icons from "assets/tabler-icons";
import Home from "views/home/Home";
import ProfilePage from "views/profile";

const dashboardRoutes = [
  {
    title: "Home",
    id: "home",
    url: "/home",
    icon: icons.IconHome,
    element: <Home />,
  },
  {
    title: "Explore",
    id: "explore",
    url: "/explore",
    icon: icons.IconBrandSafari,
    element: <div>Welcome to Explore</div>,
  },
  {
    title: "Messages",
    id: "messages",
    url: "/messages",
    icon: icons.IconBrandMessenger,
    element: <div>Welcome to Messages</div>,
  },
  {
    title: "Notifications",
    id: "notifications",
    url: "/notifications",
    icon: icons.IconNotification,
    element: <div>Welcome to Notifications</div>,
  },
  {
    title: "Create",
    id: "create",
    url: "/create",
    icon: icons.IconSquareRoundedPlus,
    element: <div>Welcome to Create</div>,
  },
  {
    title: "Profile",
    id: "profile",
    url: "/profile",
    icon: icons.IconUserCircle,
    element: <ProfilePage />,
  },
  {
    title: "Settings",
    id: "settings",
    url: "/settings",
    icon: icons.IconSettings,
    element: <div>Welcome to Settings</div>,
  },
  {
    title: "Admin Panel",
    id: "admin",
    url: "/admin",
    icon: icons.IconShieldLock,
    element: <AdminPanel />,
  },
];

export default dashboardRoutes;
