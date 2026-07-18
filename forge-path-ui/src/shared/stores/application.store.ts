import { create } from "zustand";

interface ApplicationState {
  isReady: boolean;
  isLoading: boolean;
  version: string;
  maintenanceMode: boolean;
  featureFlags: Record<string, boolean>;
  setReady: (ready: boolean) => void;
  setLoading: (loading: boolean) => void;
  setFeatureFlag: (flag: string, value: boolean) => void;
}

export const useApplicationStore = create<ApplicationState>((set) => ({
  isReady: false,
  isLoading: false,
  version: "1.0.0",
  maintenanceMode: false,
  featureFlags: {
    useAiCollections: true,
    useForecastingBeta: false,
  },
  setReady: (isReady) => set({ isReady }),
  setLoading: (isLoading) => set({ isLoading }),
  setFeatureFlag: (flag, value) => set((s) => ({ featureFlags: { ...s.featureFlags, [flag]: value } })),
}));
