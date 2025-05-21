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
import { updatePushSubscriptionStatus } from "@/serviceWorkerRegistration";

const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { user, token, isLoading, error } = auth;

  const register = async (userData) => dispatch(registerUser(userData));
  const login = async (userData) => {
    const res = await dispatch(loginUser(userData));
    await updatePushSubscriptionStatus("activate");
    return res.payload;
  };
  const refreshToken = async () => dispatch(refreshAccessToken());
  const verifyEmailToken = async (verificationToken) =>
    dispatch(verifyEmail(verificationToken));
  const forgotPasswordRequest = async (email) =>
    dispatch(forgotPassword(email));
  const resetPassword = async ({ resetPassToken, newPassword }) =>
    dispatch(resetForgottenPassword({ resetPassToken, newPassword }));

  const getProfile = async () => dispatch(getUserProfile());
  const updateAvatar = async (avatarFile) =>
    dispatch(updateUserAvatar(avatarFile));
  const resendVerificationEmail = async () =>
    dispatch(resendEmailVerification());
  const setProfile = async (profileData) =>
    dispatch(setUserProfile(profileData));

  const logout = async () => {
    await updatePushSubscriptionStatus("deactivate");
    await dispatch(logoutUser());
  };

  return {
    auth,
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
