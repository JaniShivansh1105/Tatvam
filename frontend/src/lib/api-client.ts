import axios from "axios";
import { useAuthStore } from "../store/auth-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const token = useAuthStore.getState().accessToken;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      // Requirements: 
      // "The refresh endpoint should only be called when: an access token previously existed"
      // "Do NOT call /refresh during the initial anonymous application load."
      if (!token) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post(`${API_URL}/auth/refresh`, {}, { withCredentials: true })
            .then((res) => {
              const newToken = res.data.data.accessToken;
              useAuthStore.getState().setToken(newToken);
              return newToken;
            })
            .catch((err) => {
              // Refresh failed on a previously authenticated session, meaning their session expired.
              // Clear their state and prompt them to log back in.
              useAuthStore.getState().logout();
              return Promise.reject(err);
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const newAccessToken = await refreshPromise;
        
        // Retry original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    // Handle Network Errors (no response from server)
    if (!error.response) {
      return Promise.reject(new Error("Network failure. Please check your connection."));
    }

    return Promise.reject(error);
  }
);
