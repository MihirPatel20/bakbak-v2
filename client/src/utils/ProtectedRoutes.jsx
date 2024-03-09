// React-related imports
import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";

// Redux-related imports
import { useSelector, useDispatch } from "react-redux";
import { getUserProfile } from "@/reducer/auth/auth.thunk";

// Component imports
import PageLoading from "components/global/PageLoading";

const ProtectedRoutes = () => {
  const [isLoading, setIsLoading] = useState(true);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getUserProfile());
      setTimeout(() => {
        setIsLoading(false);
      }, 2000); // Delay of 1 second (1000 milliseconds)
    };
    fetchData();
  }, [dispatch]);

  if (isLoading) {
    return <PageLoading />;
  }

  if (!auth.user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
