// hooks/useSnackbar.js
import { useDispatch } from "react-redux";
import { showSnackbar } from "reducer/snackbar/snackbar.slice";

const useSnackbar = () => {
  const dispatch = useDispatch();

  return (type, message) => {
    dispatch(showSnackbar(type, message));
  };
};

export default useSnackbar;
