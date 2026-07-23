import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SupportedCurrency } from "@/shared/utils/currency";

interface WorkspaceState {
  density: "compact" | "loose";
  currency: SupportedCurrency;
  setDensity: (density: "compact" | "loose") => void;
  setCurrency: (currency: SupportedCurrency) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      density: "loose",
      currency: "INR", // Default workspace currency — changeable from Settings
      setDensity: (density) => set({ density }),
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: "forge-workspace",
    }
  )
);
