"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pin, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", pinned: true },
  { href: "/documents", label: "Documents" },
  { href: "/forecast", label: "Cash Flow" },
  { href: "/liquidity", label: "Liquidity" },
  { href: "/collections", label: "Collections", pinned: true },
  { href: "/treasury", label: "Treasury" },
  { href: "/copilot", label: "Copilot" },
  { href: "/reports", label: "Reports" },
  { href: "/analytics", label: "Analytics" },
  { href: "/admin", label: "Admin Console" },
  { href: "/settings", label: "Settings" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobile?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ collapsed, onToggle, mobile, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] flex flex-col h-full bg-[#0a0a0a] border-r border-[#1a1a1a] select-none shrink-0 font-mono">
      {/* Top Brand Header */}
      <div className="flex items-center gap-2 px-4 h-[48px] border-b border-[#1a1a1a] text-xs">
        <span className="font-bold tracking-wider text-white">FORGE-PATH</span>
        <span className="text-white/30">&gt;</span>
        <span className="font-bold text-[#faff69] uppercase tracking-wider">
          {pathname === "/dashboard" ? "DASHBOARD" : pathname.replace("/", "").toUpperCase()}
        </span>
      </div>

      {/* Workspaces Section */}
      <div className="px-4 pt-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
        WORKSPACES
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded text-xs transition-all duration-150 group",
                isActive
                  ? "bg-[#161616] text-[#faff69] border border-[#2a2a2a] shadow-sm font-bold"
                  : "text-white/60 hover:bg-[#121212] hover:text-white"
              )}
            >
              <div className="flex items-center gap-2.5">
                <span className={cn("w-1.5 h-1.5 rounded-sm shrink-0", isActive ? "bg-[#faff69]" : "bg-white/20 group-hover:bg-white/50")} />
                <span>{item.label}</span>
              </div>

              {item.pinned && (
                <Pin className="w-3 h-3 text-pink-500 fill-pink-500 shrink-0 rotate-45" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Issue Pill & Probes */}
      <div className="p-3 border-t border-[#1a1a1a] space-y-2 text-[10px]">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 font-bold">
          <span className="w-4 h-4 rounded-full bg-red-500 text-black flex items-center justify-center text-[9px]">N</span>
          <span>1 Issue ×</span>
        </div>

        <div className="text-white/30 text-[9px] space-y-0.5 font-mono">
          <div>Connected: NeonDB (24ms)</div>
          <div>OCR Engine: Ready</div>
        </div>
      </div>
    </aside>
  );
}
