import { create } from "zustand";

interface PreferenceState {
  currency: string;
  setCurrency: (currency: string) => void;
  timezone: string;
  setTimezone: (timezone: string) => void;
}

export const usePreferenceStore = create<PreferenceState>((set) => ({
  currency: "USD",
  setCurrency: (currency) => set({ currency }),
  timezone: "UTC",
  setTimezone: (timezone) => set({ timezone }),
}));
