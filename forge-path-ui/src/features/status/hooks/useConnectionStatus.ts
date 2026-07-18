import { useStatusStore } from "@/shared/stores/status.store";

export default function useConnectionStatus() {
  const store = useStatusStore();
  return {
    connectionStatus: store.connectionStatus,
    databaseLatency: store.databaseLatency,
    toggleConnection: store.toggleConnection,
  };
}
