import { create } from "zustand";

interface StatusState {
  connectionStatus: "online" | "offline";
  databaseLatency: number;
  lastSyncTime: string;
  cpuUsage: number;
  memoryUsage: string;
  storageUsage: string;
  workerCount: number;
  isSyncing: boolean;
  toggleConnection: () => void;
  triggerSync: () => void;
  updateLatency: (l: number) => void;
  updateCpu: (c: number) => void;
}

export const useStatusStore = create<StatusState>((set) => ({
  connectionStatus: "online",
  databaseLatency: 24,
  lastSyncTime: new Date().toLocaleTimeString(),
  cpuUsage: 12,
  memoryUsage: "420MB / 1024MB",
  storageUsage: "1.2GB / 10GB",
  workerCount: 2,
  isSyncing: false,
  toggleConnection: () => set((s) => ({
    connectionStatus: s.connectionStatus === "online" ? "offline" : "online",
  })),
  triggerSync: () => set({ isSyncing: true }),
  updateLatency: (databaseLatency) => set({ databaseLatency }),
  updateCpu: (cpuUsage) => set({ cpuUsage }),
}));
