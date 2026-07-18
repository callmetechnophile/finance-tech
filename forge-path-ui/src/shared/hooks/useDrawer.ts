import { useDrawerStore } from "@/shared/stores/drawer.store";
export default function useDrawer() {
  const store = useDrawerStore();
  return {
    isOpen: store.isOpen,
    activeTab: store.activeTab,
    openDrawer: store.openDrawer,
    closeDrawer: store.closeDrawer,
  };
}
