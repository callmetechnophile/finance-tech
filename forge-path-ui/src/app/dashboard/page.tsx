"use client";

import { useLayoutStore } from "@/shared/stores/layout.store";
import { useDrawerStore } from "@/shared/stores/drawer.store";
import { useBackgroundStore } from "@/shared/stores/background.store";
import { useNotificationStore } from "@/shared/stores/notification.store";

export default function DashboardPage() {
  const { addToast } = useLayoutStore();
  const { pushDrawer } = useDrawerStore();
  const { addJob, updateProgress, completeJob, failJob } = useBackgroundStore();
  const { addNotification, setCenterOpen } = useNotificationStore();

  const handleOpenDemoDrawer = () => {
    pushDrawer({
      id: "inv-1",
      title: "Invoice Inspector (INV-2024-089)",
      subtitle: "Apex Steel Works • $47,500 overdue",
      mode: "normal",
      activeTab: "overview",
    });
    addToast({
      type: "info",
      title: "Drawer Pushed",
      message: "Opening details stack: Level 1",
    });
  };

  // Simulates a background job run
  const handleTriggerMockJob = () => {
    const id = Math.random().toString();
    addJob({
      id,
      name: "OCR Document Extraction",
      progress: 0,
      status: "running",
      eta: "45s",
    });
    
    addToast({
      type: "task",
      title: "Task Queued",
      message: "OCR parsing background process started.",
    });

    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      if (current >= 100) {
        clearInterval(interval);
        completeJob(id);
        addToast({
          type: "success",
          title: "OCR Task Finished",
          message: "NeonDB ingestion completed successfully.",
        });
      } else {
        updateProgress(id, current);
      }
    }, 1000);
  };

  const handlePostApprovalAlert = () => {
    addNotification({
      title: "Action Required: Forecast Release",
      message: "Q3 liquidity cash forecast is generated and awaits CEO approval release.",
      category: "Approvals",
      severity: "High",
      approvalData: { type: "report", status: "pending", amount: 0 },
    });
    addToast({
      type: "info",
      title: "Approval Released",
      message: "Forecast release action sent to CEO/CFO panel.",
    });
    setCenterOpen(true);
  };

  return (
    <div className="p-12 space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">CFO Command Center</h2>
        <p className="text-xs text-[#cccccc] leading-relaxed max-w-xl">
          This is the primary executive workspace dashboard showing daily morning briefs, key cash flow drivers, and liquidity buffers.
        </p>
      </div>

      <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Drawer stack trigger test */}
        <div className="p-6 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] space-y-4">
          <h3 className="text-xs font-bold text-[#faff69] uppercase tracking-wider">Drawer Stacking & History</h3>
          <p className="text-[10px] text-[#888888] leading-relaxed">
            Verify the nesting capability by pushing the first drawer overlay, and inspect client timeline histories.
          </p>
          <div className="flex gap-2">
            <button 
              onClick={handleOpenDemoDrawer}
              className="px-3 py-1.5 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] text-xs font-bold rounded-md transition-colors cursor-pointer"
            >
              Open Invoice Drawer
            </button>
            <button 
              onClick={() => {
                pushDrawer({
                  id: "cust-1",
                  title: "Customer File: Apex Steel Works",
                  subtitle: "Credit Rating: 68/100 • Total Overdue: $47,500",
                  mode: "wide"
                });
              }}
              className="px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#343434] text-white text-xs font-bold rounded-md border border-[#3a3a3a] transition-colors cursor-pointer"
            >
              Push Customer Drawer
            </button>
          </div>
        </div>

        {/* Notification system trigger test */}
        <div className="p-6 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] space-y-4">
          <h3 className="text-xs font-bold text-[#faff69] uppercase tracking-wider">Telemetry & Alerts Center</h3>
          <p className="text-[10px] text-[#888888] leading-relaxed">
            Trigger simulated operational events to verify progress loaders, unread indicators, and toast triggers.
          </p>
          <div className="flex gap-2">
            <button 
              onClick={handleTriggerMockJob}
              className="px-3 py-1.5 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] text-xs font-bold rounded-md transition-colors cursor-pointer"
            >
              Simulate Background OCR
            </button>
            <button 
              onClick={handlePostApprovalAlert}
              className="px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#343434] text-white text-xs font-bold rounded-md border border-[#3a3a3a] transition-colors cursor-pointer"
            >
              Post Approval Request
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
