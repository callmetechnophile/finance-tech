import { useCommandStore } from "@/shared/stores/command.store";

export default function useCommandPalette() {
  const store = useCommandStore();
  return {
    isPaletteOpen: store.isPaletteOpen,
    recentCommands: store.recentCommands,
    pinnedCommands: store.pinnedCommands,
    setPaletteOpen: store.setPaletteOpen,
    addRecentCommand: store.addRecentCommand,
  };
}
