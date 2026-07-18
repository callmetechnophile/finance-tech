import { useDrawerStore, DrawerInstance } from "@/shared/stores/drawer.store";

export default function useDrawerStack() {
  const store = useDrawerStore();
  
  return {
    stack: store.stack,
    depth: store.stack.length,
    pushDrawer: store.pushDrawer,
    popDrawer: store.popDrawer,
    closeAll: store.closeAll,
  };
}
