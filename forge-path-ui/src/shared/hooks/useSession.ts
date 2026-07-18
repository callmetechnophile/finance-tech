import { useSessionStore } from "@/shared/stores/session.store";
export default function useSession() {
  const store = useSessionStore();
  return {
    isAuthenticated: store.isAuthenticated,
    user: store.user,
    orgId: store.orgId,
    expiration: store.expiration,
    setSession: store.setSession,
    clearSession: store.clearSession,
  };
}
