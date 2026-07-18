"use client";

import { useLayoutStore } from "@/shared/stores/layout.store";
import { useDrawerStore } from "@/shared/stores/drawer.store";

export default function DashboardPage() {
  const { addToast } = useLayoutStore();
  const { pushDrawer } = useDrawerStore();

  const handleOpenDemoDrawer = () => {
    // Push the first drawer onto the stack
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
          </div>
        </div>

        {/* Nested Trigger sample */}
        <div className="p-6 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] space-y-4">
          <h3 className="text-xs font-bold text-[#faff69] uppercase tracking-wider">Nested Stack Control</h3>
          <p className="text-[10px] text-[#888888] leading-relaxed">
            If a drawer is already open, push the next child data node directly onto the history stack.
          </p>
          <div className="flex gap-2">
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
              Push Nested Customer Drawer
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
