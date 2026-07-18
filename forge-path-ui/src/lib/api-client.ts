import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach auth token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("forge_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const companyId = localStorage.getItem("forge_company_id");
    if (companyId) {
      config.headers["X-Company-ID"] = companyId;
    }
  }
  return config;
});

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("forge_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
