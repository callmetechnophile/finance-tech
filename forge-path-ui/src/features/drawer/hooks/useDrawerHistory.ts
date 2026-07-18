import { useDrawerStore } from "@/shared/stores/drawer.store";

export default function useDrawerHistory() {
  const store = useDrawerStore();
  return {
    history: store.history,
  };
}
