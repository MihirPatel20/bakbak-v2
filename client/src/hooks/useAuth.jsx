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

  const register = async (userData) => dispatch(registerUser(userData));
  const login = async (userData) => dispatch(loginUser(userData));
  const refreshToken = async () => dispatch(refreshAccessToken());
  const verifyEmailToken = async (verificationToken) =>
    dispatch(verifyEmail(verificationToken));
  const forgotPasswordRequest = async (email) =>
    dispatch(forgotPassword(email));
  const resetPassword = async ({ resetPassToken, newPassword }) =>
    dispatch(resetForgottenPassword({ resetPassToken, newPassword }));
  const logout = async () => dispatch(logoutUser());
  const getProfile = async () => dispatch(getUserProfile());
  const updateAvatar = async (avatarFile) =>
    dispatch(updateUserAvatar(avatarFile));
  const resendVerificationEmail = async () =>
    dispatch(resendEmailVerification());
  const setProfile = async (profileData) =>
    dispatch(setUserProfile(profileData));

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
