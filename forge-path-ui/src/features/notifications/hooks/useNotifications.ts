import { useNotificationStore } from "@/shared/stores/notification.store";

export default function useNotifications() {
  const store = useNotificationStore();
  return {
    notifications: store.notifications,
    isCenterOpen: store.isCenterOpen,
    setCenterOpen: store.setCenterOpen,
    addNotification: store.addNotification,
    markRead: store.markRead,
    markAllRead: store.markAllRead,
    togglePin: store.togglePin,
    archiveNotification: store.archiveNotification,
  };
}
