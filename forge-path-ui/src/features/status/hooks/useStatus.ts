import { useStatusStore } from "@/shared/stores/status.store";

export default function useStatus() {
  const store = useStatusStore();
  return {
    connectionStatus: store.connectionStatus,
    databaseLatency: store.databaseLatency,
    lastSyncTime: store.lastSyncTime,
    cpuUsage: store.cpuUsage,
    memoryUsage: store.memoryUsage,
    storageUsage: store.storageUsage,
    workerCount: store.workerCount,
    isSyncing: store.isSyncing,
    toggleConnection: store.toggleConnection,
    triggerSync: store.triggerSync,
  };
}
