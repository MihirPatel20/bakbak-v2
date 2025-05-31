// setupInterceptors.js
import store from "reducer/store";
import { logoutUser, refreshAccessToken } from "reducer/auth/auth.thunk";
import api from "api";

export const setupInterceptors = () => {
  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const resultAction = await store.dispatch(refreshAccessToken());

          if (refreshAccessToken.fulfilled.match(resultAction)) {
            const newAccessToken = resultAction.payload.data.accessToken;

            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            api.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;

            return api(originalRequest);
          } else {
            throw new Error("Token refresh failed");
          }
        } catch (err) {
          store.dispatch(logoutUser());

          // Optional: Show snackbar
          store.dispatch(
            showSnackbar("error", "Session expired. Please log in again.")
          );

          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );
};
