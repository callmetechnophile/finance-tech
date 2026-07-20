"use client";

import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";

interface SuggestedPromptsRegionProps {
  onSelectPrompt?: (prompt: string) => void;
}

export function SuggestedPromptsRegion({ onSelectPrompt }: SuggestedPromptsRegionProps) {
  const prompts = [
    "Project 90-day cash gap predictions under 15% sales drop",
    "Should we execute the $45k CNC wire payout on July 24?",
    "Evaluate early payment discount ROI for Apex Steel",
    "Summarize top accounts receivable delinquency exposures",
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/40 uppercase tracking-wider">
        <Sparkles className="w-3 h-3 text-[#faff69]" /> Suggested Intelligence Queries
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {prompts.map((p) => (
          <button
            key={p}
            onClick={() => onSelectPrompt ? onSelectPrompt(p) : alert(`Selected Prompt: "${p}"`)}
            className="p-2.5 rounded-xl bg-[#1a1a1a] hover:bg-[#222] border border-[#222] hover:border-[#faff69]/30 text-left text-xs text-white/70 hover:text-white transition-all flex items-center justify-between group cursor-pointer"
          >
            <span className="line-clamp-2 leading-relaxed text-[11px]">{p}</span>
            <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-[#faff69] shrink-0 ml-2" />
          </button>
        ))}
      </div>
    </div>
  );
}
