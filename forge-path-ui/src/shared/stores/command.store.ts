import { create } from "zustand";

interface CommandItem {
  id: string;
  label: string;
  shortcut?: string;
  action: () => void;
}

interface CommandState {
  isPaletteOpen: boolean;
  recentCommands: string[];
  pinnedCommands: string[];
  commandHistory: string[];
  setPaletteOpen: (open: boolean) => void;
  addRecentCommand: (cmdId: string) => void;
}

export const useCommandStore = create<CommandState>((set) => ({
  isPaletteOpen: false,
  recentCommands: [],
  pinnedCommands: ["run-forecast", "upload-docs"],
  commandHistory: [],
  setPaletteOpen: (isPaletteOpen) => set({ isPaletteOpen }),
  addRecentCommand: (c) => set((s) => ({ recentCommands: [c, ...s.recentCommands.filter((x) => x !== c)].slice(0, 5) })),
}));
