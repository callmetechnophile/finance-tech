import { create } from "zustand";

export interface ToastMessage {
  id: string;
  type: "success" | "warning" | "error" | "info" | "task";
  title: string;
  message: string;
}

interface LayoutState {
  // Sidebar
  sidebarWidth: number;
  isSidebarCollapsed: boolean;
  setSidebarWidth: (w: number) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // AI Panel
  aiPanelWidth: number;
  isAiPanelCollapsed: boolean;
  aiPanelMode: "pinned" | "floating" | "hidden";
  setAiPanelWidth: (w: number) => void;
  setAiPanelCollapsed: (collapsed: boolean) => void;
  setAiPanelMode: (mode: "pinned" | "floating" | "hidden") => void;

  // Drawer
  isDrawerOpen: boolean;
  drawerTab: string;
  openDrawer: (tab?: string) => void;
  closeDrawer: () => void;

  // Modal
  activeModal: string | null;
  openModal: (modalId: string) => void;
  closeModal: () => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  dismissToast: (id: string) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  // Sidebar defaults
  sidebarWidth: 240,
  isSidebarCollapsed: false,
  setSidebarWidth: (w) => set({ sidebarWidth: w }),
  setSidebarCollapsed: (c) => set({ isSidebarCollapsed: c }),

  // AI Panel defaults
  aiPanelWidth: 320,
  isAiPanelCollapsed: false,
  aiPanelMode: "pinned",
  setAiPanelWidth: (w) => set({ aiPanelWidth: w }),
  setAiPanelCollapsed: (c) => set({ isAiPanelCollapsed: c }),
  setAiPanelMode: (m) => set({ aiPanelMode: m }),

  // Drawer defaults
  isDrawerOpen: false,
  drawerTab: "overview",
  openDrawer: (tab = "overview") => set({ isDrawerOpen: true, drawerTab: tab }),
  closeDrawer: () => set({ isDrawerOpen: false }),

  // Modal defaults
  activeModal: null,
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),

  // Toasts defaults
  toasts: [],
  addToast: (t) => set((s) => ({ toasts: [...s.toasts, { ...t, id: Math.random().toString() }] })),
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
