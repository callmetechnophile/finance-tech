"use client";

import { ReactNode, useState } from "react";
import Breadcrumbs from "@/shared/components/breadcrumbs/Breadcrumbs";
import NotificationBell from "@/features/notifications/components/NotificationBell";
import { PerformanceMonitorDialog } from "@/shared/components/shell/PerformanceMonitorDialog";
import { Activity } from "lucide-react";

interface AppHeaderContainerProps {
  children?: ReactNode;
}

export default function AppHeaderContainer({ children }: AppHeaderContainerProps) {
  const [perfOpen, setPerfOpen] = useState(false);

  return (
    <>
      {perfOpen && (
        <PerformanceMonitorDialog onClose={() => setPerfOpen(false)} />
      )}

      <header className="h-14 border-b border-[#2a2a2a] bg-[#0a0a0a] px-6 flex items-center justify-between z-10 shrink-0 select-none">
        <div className="flex items-center gap-4">
          {/* Dynamic path-based breadcrumbs */}
          <Breadcrumbs />
        </div>

        {/* Search, performance monitor, and notification triggers */}
        <div className="flex items-center gap-2">
          {/* Command palette */}
          <div className="w-64 h-8 rounded bg-[#1a1a1a] border border-[#2a2a2a] flex items-center px-3 text-[10px] text-[#888888] justify-between cursor-pointer hover:border-[#3a3a3a] transition-colors">
            <span>Search command...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#2a2a2a] text-white">Ctrl+K</kbd>
          </div>

          {/* Performance Monitor trigger */}
          <button
            id="perf-monitor-btn"
            onClick={() => setPerfOpen(true)}
            title="Enterprise Performance Monitor"
            className="relative w-8 h-8 flex items-center justify-center rounded bg-[#1a1a1a] border border-[#2a2a2a] text-[#888888] hover:text-[#faff69] hover:border-[#faff69]/30 hover:bg-[#faff69]/5 transition-all group"
          >
            <Activity className="w-3.5 h-3.5" />
            {/* Live pulse indicator */}
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
          </button>

          {/* Unified notifications bell */}
          <NotificationBell />

          {children}
        </div>
      </header>
    </>
  );
}
