import { usePreferenceStore } from "@/shared/stores/preference.store";
export default function usePreferences() {
  const store = usePreferenceStore();
  return {
    language: store.language,
    currency: store.currency,
    dateFormat: store.dateFormat,
    timezone: store.timezone,
    setLanguage: store.setLanguage,
    setCurrency: store.setCurrency,
    setDateFormat: store.setDateFormat,
    setTimezone: store.setTimezone,
  };
}
