import { useSelector, useDispatch } from "react-redux";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  verifyEmail,
  forgotPassword,
  resetForgottenPassword,
  logoutUser,
  getUserProfile,
  updateUserAvatar,
  resendEmailVerification,
} from "reducer/auth/auth.thunk.js";
import { setUserProfile } from "reducer/auth/auth.slice.js";

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isLoading, error } = useSelector((state) => state.auth);

  const register = (userData) => dispatch(registerUser(userData));
  const login = (userData) => dispatch(loginUser(userData));
  const refreshToken = () => dispatch(refreshAccessToken());
  const verifyEmailToken = (verificationToken) =>
    dispatch(verifyEmail(verificationToken));
  const forgotPasswordRequest = (email) => dispatch(forgotPassword(email));
  const resetPassword = ({ resetPassToken, newPassword }) =>
    dispatch(resetForgottenPassword({ resetPassToken, newPassword }));
  const logout = () => dispatch(logoutUser());
  const getProfile = () => dispatch(getUserProfile());
  const updateAvatar = (avatarFile) => dispatch(updateUserAvatar(avatarFile));
  const resendVerificationEmail = () => dispatch(resendEmailVerification());
  const setProfile = (profileData) => dispatch(setUserProfile(profileData));

  return {
    user,
    token,
    isLoading,
    error,
    register,
    login,
    refreshToken,
    verifyEmailToken,
    forgotPasswordRequest,
    resetPassword,
    logout,
    getProfile,
    updateAvatar,
    resendVerificationEmail,
    setProfile,
  };
};

export default useAuth;
