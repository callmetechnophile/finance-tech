import { create } from "zustand";

interface UserProfile {
  id: string;
  name: string;
  role: string;
}

interface UserState {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: { id: "usr-1", name: "Alexander Miller", role: "CFO" },
  setUser: (user) => set({ user }),
}));
