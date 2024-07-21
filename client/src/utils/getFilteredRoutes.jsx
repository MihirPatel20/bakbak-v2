import { useSelector } from "react-redux";

const getFilteredRoutes = (routes) => {
  const { role } = useSelector((state) => state.auth.user);

  return routes.filter((route) => !route.role || route.role === role);
};

export default getFilteredRoutes;
