import axios from "axios";

export const baseURL = import.meta.env.VITE_API_URL;

export const httpClient = axios.create({
  baseURL: baseURL,
});

// Automatically attach JWT token to every request if available
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// Automatically handle 401 Unauthorized responses
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to home page to force re-render in unauthenticated state
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      } else {
        // If already on the home page, just reload to clear state
        window.location.reload();
      }
    }
    return Promise.reject(error);
  },
);
