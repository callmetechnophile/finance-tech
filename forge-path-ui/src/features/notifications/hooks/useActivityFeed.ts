import { useNotificationStore } from "@/shared/stores/notification.store";

export default function useActivityFeed() {
  const store = useNotificationStore();
  // Filter for system, dashboard metrics logging events
  const activityEvents = store.notifications.filter(
    (n) => n.category === "System" || n.category === "Background Jobs"
  );
  return { activityEvents };
}
