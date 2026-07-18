"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useRef } from "react";
import { useLayoutStore } from "@/shared/stores/layout.store";
import { useNavigationStore } from "@/shared/stores/navigation.store";

interface AppSidebarContainerProps {
  children?: ReactNode;
}

export default function AppSidebarContainer({ children }: AppSidebarContainerProps) {
  const pathname = usePathname();
  const { sidebarWidth, isSidebarCollapsed, setSidebarWidth, setSidebarCollapsed } = useLayoutStore();
  const { navigationItems, pinnedWorkspaces } = useNavigationStore();
  const isResizingRef = useRef(false);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResizing);
  };

  const resize = (e: MouseEvent) => {
    if (!isResizingRef.current) return;
    const newWidth = Math.max(60, Math.min(400, e.clientX));
    if (newWidth < 100) {
      setSidebarCollapsed(true);
    } else {
      setSidebarCollapsed(false);
      setSidebarWidth(newWidth);
    }
  };

  const stopResizing = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResizing);
  };

  return (
    <aside 
      style={{ width: isSidebarCollapsed ? 60 : sidebarWidth }}
      className="relative flex flex-col border-r border-[#2a2a2a] bg-[#0a0a0a] h-full transition-all duration-100 ease-out select-none shrink-0"
    >
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        
        {/* Navigation list */}
        <div className="space-y-1">
          {!isSidebarCollapsed && (
            <div className="px-2 pb-2 text-[9px] font-bold text-[#888888] uppercase tracking-widest">
              Workspaces
            </div>
          )}
          {navigationItems.map((item) => {
            const isActive = pathname === item.path;
            const isPinned = pinnedWorkspaces.includes(item.path);

            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`h-7 rounded px-2.5 flex items-center justify-between text-xs transition-all cursor-pointer ${
                  isActive 
                    ? "bg-[#1a1a1a] text-white font-bold border border-[#faff69]/20 shadow-sm" 
                    : "text-[#888888] hover:text-white hover:bg-[#1a1a1a]/50"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className={isActive ? "text-[#faff69]" : ""}>◼</span>
                  {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!isSidebarCollapsed && isPinned && (
                  <span className="text-[9px] text-[#faff69] opacity-60">📌</span>
                )}
              </Link>
            );
          })}
        </div>

        {children}
      </div>

      {/* Resize Splitter border */}
      <div 
        onMouseDown={startResizing}
        className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-[#faff69] transition-colors"
      />
    </aside>
  );
}
