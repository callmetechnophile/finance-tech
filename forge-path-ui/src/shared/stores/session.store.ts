import { create } from "zustand";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "CEO" | "CFO" | "Finance Manager" | "Collections Officer" | "Treasury Officer";
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
  isAuthenticated: true,
  user: {
    id: "usr-1",
    name: "Alexander Miller",
    email: "finance@apex.com",
    role: "CFO",
    permissions: ["read", "write", "approve", "export", "share"],
  },
  orgId: "apex-manufacturing-uuid",
  expiration: null,
  setSession: (user, orgId) => set({ isAuthenticated: true, user, orgId }),
  clearSession: () => set({ isAuthenticated: false, user: null, orgId: null }),
}));
