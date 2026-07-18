"use client";

import { useNotificationStore } from "@/shared/stores/notification.store";

export default function NotificationBell() {
  const { notifications, isCenterOpen, setCenterOpen } = useNotificationStore();
  const unreadCount = notifications.filter((n) => !n.isRead && !n.isArchived).length;

  return (
    <button
      onClick={() => setCenterOpen(!isCenterOpen)}
      className="relative w-8 h-8 rounded-full bg-[#1a1a1a] hover:bg-[#2a2a2a] flex items-center justify-center border border-[#2a2a2a] cursor-pointer transition-colors"
      aria-label="Notifications Panel"
    >
      <span className="text-xs">🔔</span>
      {unreadCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#faff69] text-[#0a0a0a] text-[8px] font-black rounded-full flex items-center justify-center ring-2 ring-[#0a0a0a] animate-pulse">
          {unreadCount}
        </span>
      )}
    </button>
  );
}
