import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  addNotification,
  updateNotification,
} from "../reducer/notification/notification.slice"; // Adjust the import path
import { useSocket } from "../context/SocketContext"; // Adjust the import path
import { showSnackbar } from "reducer/snackbar/snackbar.slice";
import { ChatEventEnum } from "constants";

const useSocketDispatch = () => {
  const { socket } = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;

    // Handle incoming notifications
    socket.on(ChatEventEnum.NOTIFICATION_EVENT, (notification) => {
      // console.log("notification add socket response: ", notification);
      if (notification.type === "message") {
        dispatch(
          showSnackbar(
            "info",
            `${notification.sender.username} sent you a message`
          )
        );
      }
      dispatch(addNotification(notification));
    });

    // Handle notification updates
    socket.on(
      ChatEventEnum.NOTIFICATION_UPDATE_EVENT,
      (updatedNotification) => {
        // console.log("notification update socket response: ", updatedNotification);
        if (updatedNotification.type === "message") {
          dispatch(
            showSnackbar(
              "info",
              `${updatedNotification.sender.username} sent you a message`
            )
          );
        }
        dispatch(updateNotification(updatedNotification));
      }
    );

    // Cleanup on unmount
    return () => {
      socket.off("notification");
      socket.off("notificationUpdate");
    };
  }, [socket, dispatch]);
};

export default useSocketDispatch;
