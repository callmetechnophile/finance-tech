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

import { useDocumentStatusStore } from "./document-status.store";

export const initialNotifications: NotificationItem[] = [
  {
    id: "alert-1",
    title: "Critical Ingestion Exception",
    message: "OCR processing failed for INV-2024-099 due to format variance.",
    category: "System",
    severity: "Critical",
    isRead: false,
    isPinned: true,
    isArchived: false,
    timestamp: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: "alert-2",
    title: "Supplier Payment Authorization",
    message: "Approve pending payout of $45,000 to Iron Ore Supply Inc.",
    category: "Approvals",
    severity: "High",
    isRead: false,
    isPinned: false,
    isArchived: false,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    approvalData: { type: "payment", status: "pending", amount: 45000 },
  },
  {
    id: "alert-3",
    title: "Treasury Run Complete",
    message: "AP optimizations executed. 3 discount captures flagged.",
    category: "Background Jobs",
    severity: "Success",
    isRead: true,
    isPinned: false,
    isArchived: false,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
];

export const useNotificationStore = create<NotificationState>((set) => ({
  isCenterOpen: false,
  notifications: typeof window !== "undefined" && useDocumentStatusStore.getState().uploadedCount > 0 ? initialNotifications : [],
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

// Subscribe to document status store and update notifications list
if (typeof window !== "undefined") {
  useDocumentStatusStore.subscribe((state) => {
    if (state.uploadedCount > 0) {
      useNotificationStore.setState({ notifications: initialNotifications });
    } else {
      useNotificationStore.setState({ notifications: [] });
    }
  });
}
