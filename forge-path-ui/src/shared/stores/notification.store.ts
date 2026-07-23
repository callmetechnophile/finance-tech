import { create } from "zustand";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: "Financial" | "Approvals" | "AI" | "Background Jobs" | "System" | "Security";
  severity: "Critical" | "High" | "Medium" | "Low" | "Success" | "Info";
  isRead: boolean;
  isPinned: boolean;
  isArchived: boolean;
  timestamp: string;
  approvalData?: {
    type: "payment" | "report" | "reminder";
    status: "pending" | "approved" | "rejected";
    amount?: number;
  };
}

interface NotificationState {
  notifications: NotificationItem[];
  isCenterOpen: boolean;
  setCenterOpen: (open: boolean) => void;
  addNotification: (n: Omit<NotificationItem, "id" | "isRead" | "isPinned" | "isArchived" | "timestamp">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  togglePin: (id: string) => void;
  archiveNotification: (id: string) => void;
  actOnApproval: (id: string, action: "approved" | "rejected") => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  isCenterOpen: false,
  notifications: [],
  setCenterOpen: (isCenterOpen) => set({ isCenterOpen }),
  addNotification: (n) => set((s) => ({
    notifications: [
      {
        ...n,
        id: Math.random().toString(),
        isRead: false,
        isPinned: false,
        isArchived: false,
        timestamp: new Date().toISOString(),
      },
      ...s.notifications,
    ],
  })),
  markRead: (id) => set((s) => ({
    notifications: s.notifications.map((n) => n.id === id ? { ...n, isRead: true } : n),
  })),
  markAllRead: () => set((s) => ({
    notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
  })),
  togglePin: (id) => set((s) => ({
    notifications: s.notifications.map((n) => n.id === id ? { ...n, isPinned: !n.isPinned } : n),
  })),
  archiveNotification: (id) => set((s) => ({
    notifications: s.notifications.map((n) => n.id === id ? { ...n, isArchived: true } : n),
  })),
  actOnApproval: (id, action) => set((s) => ({
    notifications: s.notifications.map((n) => {
      if (n.id === id && n.approvalData) {
        return {
          ...n,
          isRead: true,
          approvalData: { ...n.approvalData, status: action },
        };
      }
      return n;
    }),
  })),
  clearAll: () => set({ notifications: [], isCenterOpen: false }),
}));
