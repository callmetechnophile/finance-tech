"use client";

import React from "react";
import { Bot, Sparkles, HelpCircle, ArrowRight } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";

export function AIPanelPlaceholder() {
  const suggestedQuestions = [
    "What is the impact if Apex Steel delays payment by 30 days?",
    "Can we safely approve the ₹45,000 CNC maintenance wire on July 24?",
    "Show me 90-day cash gap predictions under a 20% sales drop.",
  ];

  return (
    <Panel className="bg-[#111] border-[#222] space-y-4" padded>
      <div className="flex justify-between items-center border-b border-[#222] pb-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Bot className="w-4 h-4 text-[#faff69] animate-pulse" /> AI Cash Intelligence Agent
        </h3>
        <span className="px-1.5 py-0.5 text-[8px] font-bold rounded bg-[#faff69]/10 text-[#faff69] border border-[#faff69]/20 uppercase tracking-widest">
          Gemma 2B Model
        </span>
      </div>

      <div className="space-y-3">
        <div className="p-3 rounded-xl bg-[#1a1a1a] border border-[#222] space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-[10px] text-[#faff69] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Automated Solvency Advisory
          </div>
          <p className="text-white/70 leading-relaxed">
            Predictive cash runway evaluates at **68 Days**. Receivables collection velocity is optimal. Recommending a **₹42,000** yield sweep to the Neon Treasury Reserve to capture 4.8% APY.
          </p>
        </div>

        <div className="space-y-1.5">
          <span className="text-[9px] text-white/40 uppercase tracking-wider font-bold block">
            Suggested Intelligence Queries
          </span>
          <div className="space-y-1.5">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => alert(`AI Query Dispatched: "${q}"`)}
                className="w-full text-left p-2 rounded-lg bg-[#0d0d0d] hover:bg-[#1a1a1a] border border-[#222] text-[10px] text-white/60 hover:text-[#faff69] transition-colors leading-relaxed flex items-center justify-between group"
              >
                <span className="line-clamp-2">{q}</span>
                <ArrowRight className="w-3 h-3 text-white/20 group-hover:text-[#faff69] shrink-0 ml-1" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}
