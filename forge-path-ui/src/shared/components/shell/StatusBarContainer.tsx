"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import { useStatusStore } from "@/shared/stores/status.store";
import { useDrawerStore } from "@/shared/stores/drawer.store";
import { useSessionStore } from "@/shared/stores/session.store";
import { PerformanceMonitorDialog } from "@/shared/components/shell/PerformanceMonitorDialog";
import { LogoutConfirmDialog } from "@/shared/components/auth/LogoutConfirmDialog";
import {
  User,
  Settings,
  ShieldCheck,
  Bell,
  Building2,
  HelpCircle,
  LogOut,
  ChevronUp,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface StatusBarContainerProps {
  children?: ReactNode;
}

export default function StatusBarContainer({ children }: StatusBarContainerProps) {
  const { connectionStatus, databaseLatency, lastSyncTime, cpuUsage, memoryUsage } = useStatusStore();
  const { pushDrawer } = useDrawerStore();
  const { user, isAuthenticated } = useSessionStore();
  const router = useRouter();

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [perfDialogOpen, setPerfDialogOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close account menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    if (accountMenuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [accountMenuOpen]);

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

  // Security drawer — ONLY from "Security & MFA" in the account menu
  const handleOpenSecurityDrawer = () => {
    setAccountMenuOpen(false);
    pushDrawer({
      id: "session-info",
      title: "User Security Session",
      subtitle: "Active MFA token expiration logs.",
      mode: "normal",
      activeTab: "overview",
      objectContext: { user: user?.name, role: user?.role },
    });
  };

  // Derive display values — never use cached or hardcoded strings
  const displayName = isAuthenticated && user?.name ? user.name : "User";
  const displayRole = isAuthenticated && user?.role ? user.role : null;
  const displayLabel = displayRole ? `${displayName} (${displayRole})` : displayName;

  const menuItems = [
    {
      label: "My Profile",
      icon: <User className="w-3.5 h-3.5" />,
      action: () => { setAccountMenuOpen(false); router.push("/settings"); },
    },
    {
      label: "Preferences",
      icon: <Settings className="w-3.5 h-3.5" />,
      action: () => { setAccountMenuOpen(false); router.push("/settings"); },
    },
    {
      label: "Security & MFA",
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
      action: handleOpenSecurityDrawer,
      highlight: true,
    },
    {
      label: "Notifications",
      icon: <Bell className="w-3.5 h-3.5" />,
      action: () => { setAccountMenuOpen(false); router.push("/settings"); },
    },
    {
      label: "Organization",
      icon: <Building2 className="w-3.5 h-3.5" />,
      action: () => { setAccountMenuOpen(false); router.push("/admin"); },
    },
    {
      label: "Help",
      icon: <HelpCircle className="w-3.5 h-3.5" />,
      action: () => { setAccountMenuOpen(false); },
    },
  ];

  const cpuColor = cpuUsage >= 85 ? "text-[#ef4444]" : cpuUsage >= 60 ? "text-[#faff69]" : "";

  return (
    <>
      {/* Performance Monitor Dialog */}
      {perfDialogOpen && (
        <PerformanceMonitorDialog onClose={() => setPerfDialogOpen(false)} />
      )}

      {/* Logout Confirmation Dialog */}
      {logoutDialogOpen && (
        <LogoutConfirmDialog onCancel={() => setLogoutDialogOpen(false)} />
      )}

      <footer className="h-6 border-t border-[#2a2a2a] bg-[#0a0a0a] px-4 flex items-center justify-between text-[9px] text-[#888888] z-10 shrink-0 select-none">
        {/* Left: DB telemetry */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleOpenDbDrawer}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${connectionStatus === "online" ? "bg-[#22c55e]" : "bg-[#ef4444]"}`} />
            <span>Connected: NeonDB ({databaseLatency}ms)</span>
          </button>
          <span>•</span>
          <span className="cursor-default">OCR Engine: Ready</span>
          <span>•</span>
          <span>Last Sync: {lastSyncTime}</span>
        </div>

        {/* Center: slot */}
        <div className="flex items-center gap-4">{children}</div>

        {/* Right: CPU/RAM, account menu */}
        <div className="flex items-center gap-4">
          {/* CPU/RAM → Performance Monitor */}
          <button
            id="perf-monitor-trigger"
            onClick={() => setPerfDialogOpen(true)}
            className="hover:text-white transition-colors cursor-pointer flex gap-2 group"
            title="Open Enterprise Performance Monitor"
          >
            <span className={`transition-colors ${cpuColor} group-hover:text-white`}>
              CPU: {cpuUsage}%
            </span>
            <span className="group-hover:text-white">RAM: {memoryUsage.split("/")[0]}</span>
          </button>
          <span>•</span>

          {/* Account dropdown — label derived entirely from live session */}
          <div ref={menuRef} className="relative">
            <button
              id="account-menu-trigger"
              onClick={() => setAccountMenuOpen((prev) => !prev)}
              className="hover:text-white transition-colors cursor-pointer font-semibold flex items-center gap-1"
            >
              {displayLabel}
              <ChevronUp className={`w-2.5 h-2.5 transition-transform ${accountMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {accountMenuOpen && (
              <div
                role="menu"
                aria-labelledby="account-menu-trigger"
                className="absolute bottom-full right-0 mb-2 w-48 bg-[#141414] border border-[#2a2a2a] rounded-lg shadow-2xl shadow-black/60 overflow-hidden z-50 py-1"
              >
                {/* Session identity header */}
                <div className="px-3 py-2 border-b border-[#2a2a2a]">
                  <p className="text-[10px] font-bold text-white truncate">{displayName}</p>
                  <p className="text-[9px] text-[#888888] truncate">
                    {isAuthenticated && user?.email ? user.email : "Not signed in"}
                  </p>
                  {isAuthenticated && user?.organization && (
                    <p className="text-[9px] text-[#555555] truncate capitalize">{user.organization}</p>
                  )}
                </div>

                {/* Menu items — only shown when authenticated */}
                {isAuthenticated && (
                  <div className="py-1">
                    {menuItems.map((item) => (
                      <button
                        key={item.label}
                        role="menuitem"
                        onClick={item.action}
                        className={`w-full text-left flex items-center gap-2.5 px-3 py-1.5 text-[11px] transition-colors cursor-pointer ${
                          item.highlight
                            ? "text-[#faff69] hover:bg-[#faff69]/10"
                            : "text-[#cccccc] hover:bg-[#222222] hover:text-white"
                        }`}
                      >
                        <span className={item.highlight ? "text-[#faff69]" : "text-[#888888]"}>
                          {item.icon}
                        </span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Logout — opens confirmation dialog */}
                <div className="border-t border-[#2a2a2a] py-1">
                  {isAuthenticated ? (
                    <button
                      role="menuitem"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        setLogoutDialogOpen(true);
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-3 py-1.5 text-[11px] text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Logout
                    </button>
                  ) : (
                    <button
                      role="menuitem"
                      onClick={() => { setAccountMenuOpen(false); router.push("/login"); }}
                      className="w-full text-left flex items-center gap-2.5 px-3 py-1.5 text-[11px] text-[#faff69] hover:bg-[#faff69]/10 transition-colors cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5" />
                      Sign In
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <span>•</span>
          <span className="px-1.5 py-0.5 rounded bg-[#1a1a1a] text-white border border-[#2a2a2a] font-bold">
            PROD v1.0.0
          </span>
        </div>
      </footer>
    </>
  );
}
