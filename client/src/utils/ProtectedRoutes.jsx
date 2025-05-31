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
      try {
        const userResult = await dispatch(getUserProfile()).unwrap();
        // Only fetch settings if user profile was successfully retrieved
        if (userResult) {
          await dispatch(fetchUserSettings());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        // Always set loading to false after attempts are complete
        setTimeout(() => {
          setIsLoading(false);
        }, loadingTimer);
      }
    };
    fetchData();
  }, [dispatch]);

  if (isLoading) {
    return <PageLoading />;
  }

  if (!auth.user) {
    return <Navigate to="/login" />;
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
