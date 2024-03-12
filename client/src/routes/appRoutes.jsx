import ProfilePage from "views/profile";

const appRoutes = [
  {
    desc: "profile page for user with id :userId",
    url: "/profile/:userId",
    element: <ProfilePage />,
  },
  {
    desc: "direct messages with user with id :userId",
    url: "messages/direct/u/:userId",
    element: <div>direct</div>,
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

export default appRoutes;
