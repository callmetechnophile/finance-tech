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
  alerts: [
    { id: "1", type: "critical", title: "Overdue Invoice", message: "INV-2024-089 from Apex Steel is 45 days overdue — ₹47,500", timestamp: new Date().toISOString(), module: "Collections", action_label: "View Invoice", action_href: "/collections" },
    { id: "2", type: "warning", title: "Liquidity Alert", message: "Cash runway projected to drop below 60 days by end of month", timestamp: new Date(Date.now() - 3600000).toISOString(), module: "Liquidity" },
    { id: "3", type: "info", title: "Forecast Updated", message: "30-day cash flow forecast recalculated with latest data", timestamp: new Date(Date.now() - 7200000).toISOString(), module: "Cash Flow" },
    { id: "4", type: "success", title: "Payment Received", message: "Delta Fabrication paid ₹28,000 — Invoice INV-2024-074", timestamp: new Date(Date.now() - 86400000).toISOString(), module: "Collections" },
  ],
  unreadCount: 3,
  addAlert: (alert) => set((s) => ({ alerts: [alert, ...s.alerts], unreadCount: s.unreadCount + 1 })),
  markAllRead: () => set({ unreadCount: 0 }),
  dismissAlert: (id) => set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) })),
}));
