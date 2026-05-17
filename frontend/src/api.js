import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// request interceptor
api.interceptors.request.use((config) => {

  const token = localStorage.getItem("token"); // ✅ yahan define karo

  console.log("TOKEN FROM LOCALSTORAGE:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;