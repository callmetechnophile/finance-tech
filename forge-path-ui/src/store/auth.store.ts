import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Company } from "@/types";

interface AuthStore {
  user: User | null;
  company: Company | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, company: Company, token: string) => void;
  logout: () => void;
  setLoading: (v: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      company: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      setAuth: (user, company, token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("forge_token", token);
          localStorage.setItem("forge_company_id", company.id);
        }
        set({ user, company, token, isAuthenticated: true });
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("forge_token");
          localStorage.removeItem("forge_company_id");
        }
        set({ user: null, company: null, token: null, isAuthenticated: false });
      },
      setLoading: (v) => set({ isLoading: v }),
    }),
    { name: "forge-auth", partialize: (s) => ({ user: s.user, company: s.company, token: s.token, isAuthenticated: s.isAuthenticated }) }
  )
);
