import { create } from "zustand";
import type { Alert } from "@/types";

interface NotificationsStore {
  alerts: Alert[];
  unreadCount: number;
  addAlert: (alert: Alert) => void;
  markAllRead: () => void;
  dismissAlert: (id: string) => void;
}

export const useNotificationsStore = create<NotificationsStore>((set) => ({
  alerts: [],
  unreadCount: 0,
  addAlert: (alert) => set((s) => ({ alerts: [alert, ...s.alerts], unreadCount: s.unreadCount + 1 })),
  markAllRead: () => set({ unreadCount: 0 }),
  dismissAlert: (id) => set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) })),
}));
