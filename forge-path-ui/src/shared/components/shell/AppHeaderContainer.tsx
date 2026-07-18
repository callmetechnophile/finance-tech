"use client";

import { ReactNode } from "react";
import Breadcrumbs from "@/shared/components/breadcrumbs/Breadcrumbs";

interface AppHeaderContainerProps {
  children?: ReactNode;
}

export default function AppHeaderContainer({ children }: AppHeaderContainerProps) {
  return (
    <header className="h-14 border-b border-[#2a2a2a] bg-[#0a0a0a] px-6 flex items-center justify-between z-10 shrink-0 select-none">
      <div className="flex items-center gap-4">
        {/* Dynamic path-based breadcrumbs */}
        <Breadcrumbs />
      </div>
      
      {/* Search and notification triggers */}
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
