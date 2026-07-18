"use client";

import { useLayoutStore } from "@/shared/stores/layout.store";

export default function DashboardPage() {
  const { addToast } = useLayoutStore();

  return (
    <div className="p-12 space-y-6">
      <h2 className="text-xl font-bold text-white uppercase tracking-wider">CFO Command Center</h2>
      <p className="text-xs text-[#cccccc] leading-relaxed max-w-xl">
        This is the primary executive workspace dashboard showing daily morning briefs, key cash flow drivers, and liquidity buffers.
      </p>
      <div className="pt-4">
        <button 
          onClick={() => addToast({ type: "success", title: "Action Captured", message: "Verification success." })}
          className="px-3 py-1.5 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] text-xs font-bold rounded-md transition-colors cursor-pointer"
        >
          Check Solvency Alerts
        </button>
      </div>
    </div>
  );
}
