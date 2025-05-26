// React-related imports
import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";

// Redux-related imports
import { useSelector, useDispatch } from "react-redux";
import { getUserProfile } from "@/reducer/auth/auth.thunk";
import { SocketProvider } from "context/SocketContext";

// Component imports
import PageLoading from "components/global/PageLoading";
import { loadingTimer } from "constants";
import { PostDialogProvider } from "context/PostDialogContext";
import { fetchUserSettings } from "reducer/settings/settings.thunk";

const ProtectedRoutes = () => {
  const [isLoading, setIsLoading] = useState(true);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getUserProfile());
      await dispatch(fetchUserSettings());

      // Simulate a delay to show loading state
      // This is useful for UX to prevent flickering
      setTimeout(() => {
        setIsLoading(false);
      }, loadingTimer); // Delay of 1 second (1000 milliseconds)
    };
    fetchData();
  }, [dispatch]);

  if (isLoading) {
    return <PageLoading />;
  }

  if (!auth.user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SocketProvider>
      <PostDialogProvider>
        <Outlet />
      </PostDialogProvider>
    </SocketProvider>
  );
};

export default ProtectedRoutes;
