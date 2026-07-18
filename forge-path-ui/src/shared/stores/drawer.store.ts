import { create } from "zustand";

export interface DrawerInstance {
  id: string;
  title: string;
  subtitle?: string;
  activeTab: string;
  width: number;
  mode: "compact" | "normal" | "wide" | "fullscreen";
  objectContext?: any;
}

interface DrawerState {
  stack: DrawerInstance[];
  history: string[];
  pushDrawer: (drawer: Omit<DrawerInstance, "width" | "activeTab" | "mode"> & Partial<Pick<DrawerInstance, "width" | "activeTab" | "mode">>) => void;
  popDrawer: () => void;
  updateActiveWidth: (w: number) => void;
  updateActiveTab: (tab: string) => void;
  closeAll: () => void;
}

export const useDrawerStore = create<DrawerState>((set) => ({
  stack: [],
  history: [],
  pushDrawer: (d) => set((s) => {
    const defaultWidth = d.mode === "compact" ? 360 : d.mode === "wide" ? 640 : d.mode === "fullscreen" ? window.innerWidth : 480;
    const newDrawer: DrawerInstance = {
      width: defaultWidth,
      activeTab: "overview",
      mode: "normal",
      ...d,
    };
    return {
      stack: [...s.stack, newDrawer],
      history: [d.title, ...s.history.filter((x) => x !== d.title)].slice(0, 10),
    };
  }),
  popDrawer: () => set((s) => ({
    stack: s.stack.slice(0, -1),
  })),
  updateActiveWidth: (w) => set((s) => {
    if (s.stack.length === 0) return {};
    const updated = [...s.stack];
    updated[updated.length - 1] = { ...updated[updated.length - 1], width: w };
    return { stack: updated };
  }),
  updateActiveTab: (tab) => set((s) => {
    if (s.stack.length === 0) return {};
    const updated = [...s.stack];
    updated[updated.length - 1] = { ...updated[updated.length - 1], activeTab: tab };
    return { stack: updated };
  }),
  closeAll: () => set({ stack: [] }),
}));
