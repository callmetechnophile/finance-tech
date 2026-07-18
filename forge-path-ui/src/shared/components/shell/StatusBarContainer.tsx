"use client";

import { ReactNode } from "react";

interface StatusBarContainerProps {
  children?: ReactNode;
}

export default function StatusBarContainer({ children }: StatusBarContainerProps) {
  return (
    <footer className="h-6 border-t border-[#2a2a2a] bg-[#0a0a0a] px-4 flex items-center justify-between text-[9px] text-[#888888] z-10 shrink-0 select-none">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" /> Connected to NeonDB
        </span>
        <span>•</span>
        <span>OCR Engine: Ready</span>
      </div>
      
      <div className="flex items-center gap-4">
        <span>Gemma confidence: 98%</span>
        {children}
      </div>
    </footer>
  );
}
