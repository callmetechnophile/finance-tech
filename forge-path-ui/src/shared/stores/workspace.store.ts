import { create } from "zustand";

interface WorkspaceState {
  density: "compact" | "loose";
  setDensity: (density: "compact" | "loose") => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  density: "loose",
  setDensity: (density) => set({ density }),
}));
