import { useStatusStore } from "@/shared/stores/status.store";

export default function useSyncStatus() {
  const store = useStatusStore();
  return {
    isSyncing: store.isSyncing,
    lastSyncTime: store.lastSyncTime,
    triggerSync: store.triggerSync,
  };
}
