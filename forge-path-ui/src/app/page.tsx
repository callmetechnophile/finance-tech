"use client";

import AppShell from "@/shared/components/shell/AppShell";
import { useLayoutStore } from "@/shared/stores/layout.store";

export default function Home() {
  const { openDrawer, openModal, addToast, aiPanelMode, setAiPanelMode } = useLayoutStore();

  const handleTriggerToast = (type: "success" | "warning" | "error" | "info" | "task") => {
    addToast({
      type,
      title: `${type.toUpperCase()} ALERT`,
      message: `System validation trigger completed successfully for style: ${type}.`,
    });
  };

  return (
    <AppShell>
      <div className="p-8 max-w-4xl mx-auto space-y-8 select-none">
        {/* Workspace Title */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white tracking-tight">Mission Control Workspace</h2>
          <p className="text-xs text-[#cccccc]">
            Use this interactive workspace to verify all container nodes, resizers, drawers, modals, and toasts.
          </p>
        </div>

        {/* Global Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Overlay Triggers */}
          <div className="p-6 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] space-y-4">
            <h3 className="text-xs font-bold text-[#faff69] uppercase tracking-wider">Overlay Systems</h3>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => openDrawer("overview")}
                className="px-3 py-1.5 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] text-xs font-bold rounded-md transition-colors cursor-pointer"
              >
                Trigger Drawer
              </button>
              <button 
                onClick={() => openModal("demo-modal")}
                className="px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#343434] text-white text-xs font-bold rounded-md border border-[#3a3a3a] transition-colors cursor-pointer"
              >
                Trigger Modal
              </button>
            </div>
          </div>

          {/* Toast Notification Triggers */}
          <div className="p-6 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] space-y-4">
            <h3 className="text-xs font-bold text-[#faff69] uppercase tracking-wider">Toast Notifications</h3>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => handleTriggerToast("success")}
                className="px-2.5 py-1.5 bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] text-[10px] font-bold rounded-md hover:bg-[#22c55e]/20 transition-all cursor-pointer"
              >
                Success
              </button>
              <button 
                onClick={() => handleTriggerToast("warning")}
                className="px-2.5 py-1.5 bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[#f59e0b] text-[10px] font-bold rounded-md hover:bg-[#f59e0b]/20 transition-all cursor-pointer"
              >
                Warning
              </button>
              <button 
                onClick={() => handleTriggerToast("error")}
                className="px-2.5 py-1.5 bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] text-[10px] font-bold rounded-md hover:bg-[#ef4444]/20 transition-all cursor-pointer"
              >
                Error
              </button>
              <button 
                onClick={() => handleTriggerToast("info")}
                className="px-2.5 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold rounded-md hover:bg-blue-500/20 transition-all cursor-pointer"
              >
                Info
              </button>
            </div>
          </div>

          {/* Resizable Panel Configs */}
          <div className="p-6 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] space-y-4 md:col-span-2">
            <h3 className="text-xs font-bold text-[#faff69] uppercase tracking-wider">AI Docking Modes</h3>
            <div className="flex gap-2">
              {(["pinned", "hidden"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setAiPanelMode(mode)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md border transition-all cursor-pointer ${
                    aiPanelMode === mode 
                      ? "bg-[#faff69] border-[#faff69] text-[#0a0a0a]" 
                      : "bg-[#2a2a2a] border-[#3a3a3a] text-[#cccccc] hover:bg-[#343434]"
                  }`}
                >
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-[#888888] leading-relaxed">
              Drag the vertical borders of the Sidebar (Left) or AI Panel (Right) to resize them. Collapsing states trigger when width goes below thresholds.
            </p>
          </div>

        </div>
      </div>
    </AppShell>
  );
}
