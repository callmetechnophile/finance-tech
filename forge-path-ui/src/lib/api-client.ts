import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

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

export default api;
