import axios, { AxiosRequestConfig } from "axios";
import {
  markRefused,
  markSignedOut,
  refreshSession,
  refusalReasonOf,
} from "@/libs/auth/session-store";

const axiosCustom = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  // VTK IAM's tokens are in cookies, which the browser only sends to another
  // origin when asked to.
  withCredentials: true,
});

// The page holds no token: the cookies travel by themselves. A 401 means the
// access token has expired, so the session is refreshed once and the request
// sent again; when the refresh fails the session is over. A 403 with one of the known reasons means the person may
// no longer use the application at all (disabled, for example).
const answerIamError = async (error: unknown) => {
  const failed = error as {
    config?: AxiosRequestConfig & { _retry?: boolean };
    response?: { status?: number };
  };
  const originalRequest = failed.config;

  const reason = refusalReasonOf(error);
  if (reason) {
    markRefused(reason);
    window.location.href = `/auth/sign-in-failed?reason=${reason}`;
    return Promise.reject(error);
  }
  if (failed.response?.status !== 401 || !originalRequest || originalRequest._retry) {
    return Promise.reject(error);
  }

  originalRequest._retry = true;
  try {
    await refreshSession();
  } catch (refreshError) {
    markSignedOut();
    window.location.href = "/auth/login";
    return Promise.reject(refreshError);
  }
  return axiosCustom(originalRequest);
};

axiosCustom.interceptors.response.use(
  (response) => response,
  answerIamError
);

export default axiosCustom;
