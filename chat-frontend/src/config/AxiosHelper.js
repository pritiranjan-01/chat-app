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
