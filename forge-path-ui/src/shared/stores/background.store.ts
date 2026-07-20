import { create } from "zustand";

export interface BackgroundJob {
  id: string;
  name: string;
  progress: number;
  status: "running" | "completed" | "failed";
  eta: string;
}

interface BackgroundState {
  jobs: BackgroundJob[];
  addJob: (job: BackgroundJob) => void;
  updateProgress: (id: string, progress: number) => void;
  completeJob: (id: string) => void;
  failJob: (id: string) => void;
  clearAll: () => void;
}

export const useBackgroundStore = create<BackgroundState>((set) => ({
  jobs: [],
  addJob: (job) => set((s) => ({ jobs: [...s.jobs, job] })),
  updateProgress: (id, progress) => set((s) => ({
    jobs: s.jobs.map((j) => j.id === id ? { ...j, progress } : j)
  })),
  completeJob: (id) => set((s) => ({
    jobs: s.jobs.map((j) => j.id === id ? { ...j, status: "completed", progress: 100 } : j)
  })),
  failJob: (id) => set((s) => ({
    jobs: s.jobs.map((j) => j.id === id ? { ...j, status: "failed" } : j)
  })),
  clearAll: () => set({ jobs: [] }),
}));
