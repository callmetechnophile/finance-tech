import { useDrawerStore } from "@/shared/stores/drawer.store";

export default function useDrawerNavigation() {
  const store = useDrawerStore();
  const activeDrawer = store.stack[store.stack.length - 1] || null;

  return {
    activeTab: activeDrawer ? activeDrawer.activeTab : "overview",
    updateTab: store.updateActiveTab,
  };
}
