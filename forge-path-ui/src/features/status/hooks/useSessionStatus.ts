import { useSessionStore } from "@/shared/stores/session.store";

export default function useSessionStatus() {
  const store = useSessionStore();
  return {
    user: store.user,
    orgId: store.orgId,
    isAuthenticated: store.isAuthenticated,
  };
}
