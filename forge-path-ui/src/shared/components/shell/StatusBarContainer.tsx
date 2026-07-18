"use client";

import { ReactNode } from "react";
import { useStatusStore } from "@/shared/stores/status.store";
import { useDrawerStore } from "@/shared/stores/drawer.store";
import { useSessionStore } from "@/shared/stores/session.store";

interface StatusBarContainerProps {
  children?: ReactNode;
}

export default function StatusBarContainer({ children }: StatusBarContainerProps) {
  const { connectionStatus, databaseLatency, lastSyncTime, cpuUsage, memoryUsage } = useStatusStore();
  const { pushDrawer } = useDrawerStore();
  const { user } = useSessionStore();

  const handleOpenDbDrawer = () => {
    pushDrawer({
      id: "db-health",
      title: "Neon Database Telemetry",
      subtitle: "Database connection parameters and latencies.",
      mode: "normal",
      activeTab: "overview",
      objectContext: { host: "neondb-pool-prod-us-east-1.neon.tech", latency: `${databaseLatency}ms` },
    });
  };

  const handleOpenResourcesDrawer = () => {
    pushDrawer({
      id: "system-resources",
      title: "Server Core Allocation",
      subtitle: "CPU & Memory usage tracking logs.",
      mode: "normal",
      activeTab: "overview",
      objectContext: { cpu: `${cpuUsage}%`, ram: memoryUsage },
    });
  };

  const handleOpenSessionDrawer = () => {
    pushDrawer({
      id: "session-info",
      title: "User Security Session",
      subtitle: "Active MFA token expiration logs.",
      mode: "normal",
      activeTab: "overview",
      objectContext: { user: user?.name, role: user?.role },
    });
  };

  return (
    <footer className="h-6 border-t border-[#2a2a2a] bg-[#0a0a0a] px-4 flex items-center justify-between text-[9px] text-[#888888] z-10 shrink-0 select-none">
      {/* Left Column: Health and Sync telemetry */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleOpenDbDrawer}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${connectionStatus === "online" ? "bg-[#22c55e]" : "bg-[#ef4444]"}`} />
          <span>Connected: NeonDB ({databaseLatency}ms)</span>
        </button>
        <span>•</span>
        <span className="hover:text-white transition-colors cursor-pointer">
          OCR Engine: Ready
        </span>
        <span>•</span>
        <span>Last Sync: {lastSyncTime}</span>
      </div>

      {/* Center Column: Children Slot for progress bars */}
      <div className="flex items-center gap-4">
        {children}
      </div>
      
      {/* Right Column: Server load, environment, session tags */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleOpenResourcesDrawer}
          className="hover:text-white transition-colors cursor-pointer flex gap-2"
        >
          <span>CPU: {cpuUsage}%</span>
          <span>RAM: {memoryUsage.split("/")[0]}</span>
        </button>
        <span>•</span>
        <button
          onClick={handleOpenSessionDrawer}
          className="hover:text-white transition-colors cursor-pointer font-semibold"
        >
          {user?.name} ({user?.role})
        </button>
        <span>•</span>
        <span className="px-1.5 py-0.5 rounded bg-[#1a1a1a] text-white border border-[#2a2a2a] font-bold">
          PROD v1.0.0
        </span>
      </div>
    </footer>
  );
}
