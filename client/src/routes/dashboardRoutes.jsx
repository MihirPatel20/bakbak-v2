import icons from "assets/tabler-icons";
import Home from "views/home";
import ProfilePage from "views/profile";
import MessagesPage from "views/messages";
import ExplorePage from "views/explore";
import AdminPanel from "views/admin";
import NotificationView from "views/notification";

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
    element: <ExplorePage />,
  },
  {
    title: "Messages",
    id: "messages",
    url: "/messages",
    icon: icons.IconBrandMessenger,
    element: <MessagesPage />,
  },
  {
    title: "Notifications",
    id: "notifications",
    url: "/notifications",
    icon: icons.IconNotification,
    element: <NotificationView />,
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
