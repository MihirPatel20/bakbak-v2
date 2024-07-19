import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  addNotification,
  updateNotification,
} from "../reducer/notification/notification.slice"; // Adjust the import path
import { useSocket } from "../context/SocketContext"; // Adjust the import path

const useSocketDispatch = () => {
  const { socket } = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;

    // Handle incoming notifications
    socket.on("notification", (notification) => {
      console.log("notification socket response: ", notification)
      dispatch(addNotification(notification));
    });

    // Handle notification updates
    socket.on("notificationUpdate", (update) => {
      dispatch(updateNotification(update));
    });

    // Cleanup on unmount
    return () => {
      socket.off("notification");
      socket.off("notificationUpdate");
    };
  }, [socket, dispatch]);
};

export default useSocketDispatch;
