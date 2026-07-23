"use client";

import React from "react";
import { Layers, Database, ShieldCheck, Activity, DollarSign } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";

export function ContextPanelRegion() {
  const contextItems = [
    { label: "NeonDB ACID Ledger", status: "Active & Synced", value: "3,412 Records" },
    { label: "Available Liquid Cash", status: "Verified", value: "₹3,42,000" },
    { label: "Outstanding AR Balance", status: "12 Invoices", value: "₹2,84,500" },
    { label: "Outstanding AP Queue", status: "8 Bills", value: "₹1,18,400" },
    { label: "Daily Operating Burn", status: "Stable", value: "₹5,000/day" },
    { label: "Acid-Test Quick Ratio", status: "Optimal", value: "1.8x" },
  ];

  return (
    <Panel className="bg-[#111] border-[#222] space-y-3" padded>
      <div className="flex justify-between items-center border-b border-[#222] pb-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-[#faff69]" /> Live Copilot Context
        </h3>
        <span className="px-1.5 py-0.5 text-[8px] font-bold rounded bg-green-500/10 text-green-400 border border-green-500/20 uppercase">
          100% Ingested
        </span>
      </div>

      <div className="space-y-2">
        {contextItems.map((item) => (
          <div key={item.label} className="p-2 rounded bg-[#1a1a1a] border border-[#222] flex justify-between items-center text-xs">
            <div>
              <span className="text-white/80 font-medium block text-[11px]">{item.label}</span>
              <span className="text-[9px] text-white/40 block">{item.status}</span>
            </div>
            <span className="font-mono font-bold text-white text-[11px]">{item.value}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
