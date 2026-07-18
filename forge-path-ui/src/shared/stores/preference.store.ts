import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PreferenceState {
  language: string;
  currency: string;
  dateFormat: string;
  timezone: string;
  setLanguage: (lang: string) => void;
  setCurrency: (currency: string) => void;
  setDateFormat: (format: string) => void;
  setTimezone: (zone: string) => void;
}

export const usePreferenceStore = create<PreferenceState>()(
  persist(
    (set) => ({
      language: "en-US",
      currency: "USD",
      dateFormat: "YYYY-MM-DD",
      timezone: "UTC",
      setLanguage: (language) => set({ language }),
      setCurrency: (currency) => set({ currency }),
      setDateFormat: (dateFormat) => set({ dateFormat }),
      setTimezone: (timezone) => set({ timezone }),
    }),
    { name: "forge-preferences" }
  )
);
