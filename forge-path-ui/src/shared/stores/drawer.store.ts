import { create } from "zustand";

interface DrawerState {
  isOpen: boolean;
  activeTab: string;
  openDrawer: (tab?: string) => void;
  closeDrawer: () => void;
}

export const useDrawerStore = create<DrawerState>((set) => ({
  isOpen: false,
  activeTab: "overview",
  openDrawer: (tab = "overview") => set({ isOpen: true, activeTab: tab }),
  closeDrawer: () => set({ isOpen: false }),
}));
