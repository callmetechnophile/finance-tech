"use client";

import React from "react";
import { Bot, Sparkles, ArrowRight } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";

export function AIPanelPlaceholder() {
  const liquidityPrompts = [
    "What is our quick ratio if Apex Steel defaults on ₹47,500?",
    "Should we delay vendor payout to NVIDIA NIM by 15 days?",
    "Recommend optimal liquidity allocation between Chase & Neon Reserve.",
  ];

  return (
    <Panel className="bg-[#111] border-[#222] space-y-4" padded>
      <div className="flex justify-between items-center border-b border-[#222] pb-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Bot className="w-4 h-4 text-[#faff69] animate-pulse" /> AI Liquidity Copilot
        </h3>
        <span className="px-1.5 py-0.5 text-[8px] font-bold rounded bg-[#faff69]/10 text-[#faff69] border border-[#faff69]/20 uppercase tracking-widest">
          NVIDIA NIM • 145ms
        </span>
      </div>

      <div className="space-y-3">
        <div className="p-3 rounded-xl bg-[#1a1a1a] border border-[#222] space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-[10px] text-[#faff69] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Solvency Optimization Notice
          </div>
          <p className="text-white/70 leading-relaxed">
            Liquidity Score is **84/100 (Optimal)**. Current cash buffer provides **68 days** of coverage. Recommending activating automated late-fee reminders for Apex Steel to prevent solvency gap in August.
          </p>
        </div>

        <div className="space-y-1.5">
          <span className="text-[9px] text-white/40 uppercase tracking-wider font-bold block">
            Suggested Solvency Analysis
          </span>
          <div className="space-y-1.5">
            {liquidityPrompts.map((lp) => (
              <button
                key={lp}
                onClick={() => alert(`Liquidity AI Query: "${lp}"`)}
                className="w-full text-left p-2 rounded-lg bg-[#0d0d0d] hover:bg-[#1a1a1a] border border-[#222] text-[10px] text-white/60 hover:text-[#faff69] transition-colors leading-relaxed flex items-center justify-between group"
              >
                <span className="line-clamp-2">{lp}</span>
                <ArrowRight className="w-3 h-3 text-white/20 group-hover:text-[#faff69] shrink-0 ml-1" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}
