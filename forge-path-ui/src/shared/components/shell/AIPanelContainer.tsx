"use client";

import { ReactNode, useRef } from "react";
import { useLayoutStore } from "@/shared/stores/layout.store";

interface AIPanelContainerProps {
  children?: ReactNode;
}

export default function AIPanelContainer({ children }: AIPanelContainerProps) {
  const { aiPanelWidth, isAiPanelCollapsed, aiPanelMode, setAiPanelWidth, setAiPanelCollapsed } = useLayoutStore();
  const isResizingRef = useRef(false);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResizing);
  };

  const resize = (e: MouseEvent) => {
    if (!isResizingRef.current) return;
    const newWidth = Math.max(160, Math.min(600, window.innerWidth - e.clientX));
    if (newWidth < 200) {
      setAiPanelCollapsed(true);
    } else {
      setAiPanelCollapsed(false);
      setAiPanelWidth(newWidth);
    }
  };

  const stopResizing = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResizing);
  };

  if (aiPanelMode === "hidden") return null;

  return (
    <aside 
      style={{ width: isAiPanelCollapsed ? 48 : aiPanelWidth }}
      className="relative flex flex-col border-l border-[#2a2a2a] bg-[#0a0a0a] h-full transition-all duration-100 ease-out select-none shrink-0"
    >
      {/* Resize Splitter on the Left border */}
      <div 
        onMouseDown={startResizing}
        className="absolute top-0 left-0 w-1 h-full cursor-col-resize hover:bg-[#faff69] transition-colors"
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Placeholder space for AI chat context details */}
        <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] space-y-2">
          <div className="text-[10px] font-bold text-[#faff69] uppercase tracking-wider">
            {isAiPanelCollapsed ? "🤖" : "🤖 Gemma Analyst"}
          </div>
          {!isAiPanelCollapsed && (
            <p className="text-[10px] text-[#cccccc] leading-relaxed">
              Virtual CFO panel active. The assistant will sync its context mapping automatically as you navigate.
            </p>
          )}
        </div>
        {children}
      </div>
    </aside>
  );
}
