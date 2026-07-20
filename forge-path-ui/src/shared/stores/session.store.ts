import { create } from "zustand";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "CEO" | "CFO" | "Finance Manager" | "Collections Officer" | "Treasury Officer";
  avatar?: string;
  organization?: string;
  permissions: string[];
}

interface SessionState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  orgId: string | null;
  expiration: string | null;
  setSession: (user: UserProfile, orgId: string, token: string) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  // Default: unauthenticated — UI should derive display from user being null
  isAuthenticated: false,
  user: null,
  orgId: null,
  expiration: null,

  setSession: (user, orgId, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("forge_token", token);
      localStorage.setItem("forge_org_id", orgId);
      localStorage.setItem("forge_user", JSON.stringify(user));
    }
    set({ isAuthenticated: true, user, orgId });
  },

  clearSession: () => {
    if (typeof window !== "undefined") {
      // Auth tokens
      localStorage.removeItem("forge_token");
      localStorage.removeItem("forge_refresh_token");
      localStorage.removeItem("forge_org_id");
      localStorage.removeItem("forge_user");
      localStorage.removeItem("forge_company_id");
      // Clear all other forge_ keys
      Object.keys(localStorage)
        .filter((k) => k.startsWith("forge_"))
        .forEach((k) => localStorage.removeItem(k));
      // Session storage
      sessionStorage.clear();
      // Cookies — clear forge auth cookies
      document.cookie.split(";").forEach((c) => {
        const key = c.split("=")[0].trim();
        if (key.startsWith("forge_") || key === "session" || key === "token") {
          document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        }
      });
    }
    set({ isAuthenticated: false, user: null, orgId: null, expiration: null });
  },
}));
