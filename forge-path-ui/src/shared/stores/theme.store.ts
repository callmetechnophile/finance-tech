import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  theme: "light" | "dark" | "system";
  density: "compact" | "loose";
  setTheme: (theme: "light" | "dark" | "system") => void;
  setDensity: (density: "compact" | "loose") => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "dark",
      density: "loose",
      setTheme: (theme) => set({ theme }),
      setDensity: (density) => set({ density }),
    }),
    { name: "forge-theme" }
  )
);
