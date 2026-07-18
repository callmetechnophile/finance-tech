import { useDrawerStore } from "@/shared/stores/drawer.store";

export default function useDrawer() {
  const store = useDrawerStore();
  const activeDrawer = store.stack[store.stack.length - 1] || null;

  return {
    isOpen: store.stack.length > 0,
    activeDrawer,
    closeDrawer: store.popDrawer,
    closeAllDrawers: store.closeAll,
    openDrawer: (title: string, id: string = Math.random().toString()) => {
      store.pushDrawer({ id, title });
    },
  };
}
