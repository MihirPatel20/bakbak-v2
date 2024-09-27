import DirectMessage from "views/messages/DirectMessage";
import ProfilePage from "views/profile";
import EditProfile from "views/profile/EditProfile";

const appRoutes = [
  {
    desc: "profile page for user with id :userId",
    url: "/profile/:username",
    element: <ProfilePage />,
  },
  {
    desc: "direct messages with user with id :userId",
    url: "messages/direct/u/:chatId",
    element: <DirectMessage />,
  },
  {
    desc: "edit profile page for user with id :userId",
    url: "/profile/edit/:userId",
    element: <EditProfile />,
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
