import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach bearer tokens & company headers
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("forge_token");
    const companyId = localStorage.getItem("forge_company_id");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (companyId) {
      config.headers["x-company-id"] = companyId;
    }
  }
  return config;
});

// Response Interceptor: Global Error Handling & Toast Notifications
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.error?.message || error.message;

      if (status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("forge_token");
        }
        toast.error("Session expired. Please log in again.");
      } else if (status === 422) {
        toast.error(`Validation Error: ${message}`);
      } else if (status && status >= 500) {
        toast.error(`Server Exception (${status}): ${message}`);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
