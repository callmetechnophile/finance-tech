import { useLayoutStore } from "@/shared/stores/layout.store";

export default function useToast() {
  const store = useLayoutStore();
  return {
    toasts: store.toasts,
    addToast: store.addToast,
    dismissToast: store.dismissToast,
  };
}
