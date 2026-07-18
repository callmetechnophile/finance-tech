"use client";

import { ReactNode, useRef } from "react";
import { useLayoutStore } from "@/shared/stores/layout.store";

interface AppSidebarContainerProps {
  children?: ReactNode;
}

export default function AppSidebarContainer({ children }: AppSidebarContainerProps) {
  const { sidebarWidth, isSidebarCollapsed, setSidebarWidth, setSidebarCollapsed } = useLayoutStore();
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Placeholder space for navigation lists */}
        <div className="space-y-2">
          <div className="h-6 rounded bg-[#1a1a1a] flex items-center px-2 text-[10px] text-[#cccccc] font-semibold">
            {isSidebarCollapsed ? "🔘" : "🔘 Dashboard"}
          </div>
          <div className="h-6 rounded bg-[#1a1a1a] flex items-center px-2 text-[10px] text-[#888888]">
            {isSidebarCollapsed ? "📄" : "📄 Documents"}
          </div>
          <div className="h-6 rounded bg-[#1a1a1a] flex items-center px-2 text-[10px] text-[#888888]">
            {isSidebarCollapsed ? "📈" : "📈 Cash Flow"}
          </div>
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
