import { useNotificationStore } from "@/shared/stores/notification.store";

export default function useApprovalNotifications() {
  const store = useNotificationStore();
  const pendingApprovals = store.notifications.filter(
    (n) => n.category === "Approvals" && n.approvalData?.status === "pending"
  );
  
  return {
    pendingApprovals,
    approveTarget: (id: string) => store.actOnApproval(id, "approved"),
    rejectTarget: (id: string) => store.actOnApproval(id, "rejected"),
  };
}
