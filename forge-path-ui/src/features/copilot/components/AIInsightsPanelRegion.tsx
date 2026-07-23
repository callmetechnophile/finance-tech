"use client";

import React from "react";
import { Sparkles, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";

export function AIInsightsPanelRegion() {
  const insights = [
    {
      id: "i1",
      title: "Activate Brevo L2 Demand Notice",
      impact: "High (+10d Runway Safety)",
      action: "Send L2 SMS",
      type: "action",
    },
    {
      id: "i2",
      title: "Sweep ₹42,000 to Neon Yield Reserve",
      impact: "+4.8% APY (₹168/mo Yield)",
      action: "Execute Sweep",
      type: "yield",
    },
    {
      id: "i3",
      title: "Approve ₹45,000 CNC Maintenance Wire",
      impact: "Preserves Machinery Warranty",
      action: "Review Wire",
      type: "payout",
    },
  ];

  return (
    <Panel className="bg-[#111] border-[#222] space-y-3" padded>
      <div className="flex justify-between items-center border-b border-[#222] pb-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#faff69]" /> AI Intelligence Insights
        </h3>
        <span className="text-[10px] text-white/40 font-mono">3 Recommendations</span>
      </div>

      <div className="space-y-2">
        {insights.map((ins) => (
          <div key={ins.id} className="p-2.5 rounded-lg bg-[#1a1a1a] border border-[#222] space-y-2 text-xs">
            <div>
              <span className="font-bold text-white block">{ins.title}</span>
              <span className="text-[9px] text-[#faff69] font-mono block mt-0.5">{ins.impact}</span>
            </div>

            <button
              onClick={() => alert(`Triggered action: "${ins.action}" for ${ins.title}`)}
              className="w-full py-1 rounded bg-[#2a2a2a] hover:bg-[#faff69] hover:text-black text-white/70 text-[10px] font-bold uppercase transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>{ins.action}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </Panel>
  );
}
