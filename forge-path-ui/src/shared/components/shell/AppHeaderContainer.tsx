"use client";

import { ReactNode } from "react";

interface AppHeaderContainerProps {
  children?: ReactNode;
}

export default function AppHeaderContainer({ children }: AppHeaderContainerProps) {
  return (
    <header className="h-14 border-b border-[#2a2a2a] bg-[#0a0a0a] px-6 flex items-center justify-between z-10 shrink-0">
      <div className="flex items-center gap-4">
        {/* Placeholder space for title breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-[#cccccc]">
          <span className="font-bold text-white uppercase tracking-wider">FORGE-PATH</span>
          <span>&gt;</span>
          <span className="text-[#888888]">CFO Command Workspace</span>
        </div>
      </div>
      
      {/* Placeholder space for search, profiles, quick actions */}
      <div className="flex items-center gap-4">
        <div className="w-64 h-8 rounded bg-[#1a1a1a] border border-[#2a2a2a] flex items-center px-3 text-[10px] text-[#888888] justify-between cursor-pointer">
          <span>Search command...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-[#2a2a2a] text-white">Ctrl+K</kbd>
        </div>
        {children}
      </div>
    </header>
  );
}
