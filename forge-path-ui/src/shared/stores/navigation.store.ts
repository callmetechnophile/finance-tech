import { create } from "zustand";

interface NavigationState {
  activeRoute: string;
  setActiveRoute: (route: string) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeRoute: "/",
  setActiveRoute: (activeRoute) => set({ activeRoute }),
}));
