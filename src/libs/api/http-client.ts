import axios, { AxiosRequestConfig } from "axios";

const axiosCustom = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosCustom.interceptors.request.use(
  (config) => {
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
