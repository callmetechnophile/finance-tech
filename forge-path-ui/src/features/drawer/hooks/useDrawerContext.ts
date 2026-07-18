import { useDrawerStore } from "@/shared/stores/drawer.store";

export default function useDrawerContext() {
  const store = useDrawerStore();
  const activeDrawer = store.stack[store.stack.length - 1] || null;

  return {
    context: activeDrawer ? activeDrawer.objectContext : null,
  };
}
