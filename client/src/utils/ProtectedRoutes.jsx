// React-related imports
import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUserProfile } from "@/reducer/auth/auth.thunk";

// Custom component and asset imports

const ProtectedRoutes = () => {
  const [isLoading, setIsLoading] = useState(true);
  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getUserProfile());
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!auth.user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
