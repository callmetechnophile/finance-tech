import { useNotificationStore } from "@/shared/stores/notification.store";

export default function useUnread() {
  const store = useNotificationStore();
  const unreadCount = store.notifications.filter((n) => !n.isRead && !n.isArchived).length;
  return { unreadCount };
}
