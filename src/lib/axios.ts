import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://cafe-project-m0k3.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the JWT token
API.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;      