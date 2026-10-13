import axios, { AxiosRequestConfig } from "axios";
import { isIamMode } from "@/libs/auth/auth-mode";
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
  // Sign-in through VTK IAM keeps the tokens in cookies, which the browser
  // only sends to another origin when asked to.
  withCredentials: isIamMode,
});

// Sign-in through VTK IAM. The page holds no token: the cookies travel by
// themselves. A 401 means the access token has expired, so the session is
// refreshed once and the request sent again; when the refresh fails the
// session is over. A 403 with one of the known reasons means the person may
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

axiosCustom.interceptors.request.use(
  (config) => {
    if (isIamMode) return config;

    // API calls use the access token; the refresh token only goes to the
    // refresh endpoint below
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Single-flight refresh: while one refresh is in progress, queue the other
// failed requests and replay them once the new token is available, so a burst
// of concurrent 401s triggers only one refresh call.
let isRefreshing = false;
let pendingQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const flushQueue = (error: unknown, token: string | null) => {
  pendingQueue.forEach((pending) => {
    if (token) {
      pending.resolve(token);
    } else {
      pending.reject(error);
    }
  });
  pendingQueue = [];
};

axiosCustom.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (isIamMode) return answerIamError(error);

    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${token}`,
        };
        return axiosCustom(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const currentToken = localStorage.getItem("refresh_token");
      // Use raw axios (not axiosCustom) so a 401 on refresh does not recurse
      // back into this interceptor.
      const response = await axios.get(
        import.meta.env.VITE_BASE_URL + import.meta.env.VITE_URL_REFRESH_TOKEN,
        { headers: { Authorization: `Bearer ${currentToken}` } }
      );

      // The backend wraps payloads as { message, data }
      const { access_token: newToken, refresh_token: newRefreshToken } =
        response.data.data;
      localStorage.setItem("access_token", newToken);
      localStorage.setItem("refresh_token", newRefreshToken);
      flushQueue(null, newToken);

      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${newToken}`,
      };
      return axiosCustom(originalRequest);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      localStorage.clear();
      window.location.href = "/auth/logout";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosCustom;
