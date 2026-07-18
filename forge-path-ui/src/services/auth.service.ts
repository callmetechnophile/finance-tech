import api from "@/lib/api-client";
import type { User, Company } from "@/types";

export interface LoginPayload { company_id: string; email: string; password: string; }
export interface LoginResponse { user: User; company: Company; token: string; }

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/api/v1/auth/login", payload);
    return data;
  },
  async logout(): Promise<void> {
    await api.post("/api/v1/auth/logout");
  },
  async getProfile(): Promise<{ user: User; company: Company }> {
    const { data } = await api.get<{ user: User; company: Company }>("/api/v1/auth/profile");
    return data;
  },
};
