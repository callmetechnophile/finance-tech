import { useThemeStore } from "@/shared/stores/theme.store";
export default function useTheme() {
  const store = useThemeStore();
  return {
    theme: store.theme,
    density: store.density,
    setTheme: store.setTheme,
    setDensity: store.setDensity,
  };
}
