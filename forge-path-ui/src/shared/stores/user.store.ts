import { create } from "zustand";

// Duplicate of session.store UserProfile — kept minimal so user.store
// can be deprecated in favour of session.store.
interface UserProfile {
  id: string;
  name: string;
  role: string;
}

interface UserState {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
}

// Default null — no user until session is established.
// Any component that previously consumed this store should instead use
// useSessionStore from @/shared/stores/session.store.
export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
