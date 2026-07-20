"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#111] border border-[#222] flex items-center justify-center text-[#faff69] shadow-lg animate-bounce">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-white uppercase tracking-widest block">FORGE-PATH</span>
          <span className="text-[10px] text-white/40 font-mono block">Loading Workspace Telemetry...</span>
        </div>
      </div>
    </div>
  );
}
