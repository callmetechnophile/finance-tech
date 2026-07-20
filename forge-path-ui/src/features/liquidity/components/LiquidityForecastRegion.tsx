"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Clock, AlertTriangle, ChevronRight } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { Section } from "@/shared/components/layout/Section";

export function LiquidityForecastRegion() {
  const [selectedWindow, setSelectedWindow] = useState<"7d" | "14d" | "30d">("14d");

  const windows = {
    "7d": { label: "7-Day Short-Term Window", buffer: "$320,000", status: "Optimal", minThreshold: "$250,000", warning: false },
    "14d": { label: "14-Day Rolling Horizon", buffer: "$298,500", status: "Stable", minThreshold: "$250,000", warning: false },
    "30d": { label: "30-Day Solvency Outlook", buffer: "$285,400", status: "Attention Needed", minThreshold: "$250,000", warning: true },
  };

  const activeWindow = windows[selectedWindow];

  return (
    <Section title="Liquidity Forecast &amp; Buffer Projections" compact>
      <Panel className="bg-[#111] border-[#222] space-y-4" padded>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#222] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#faff69]" aria-hidden="true" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Solvency Horizon Forecast
              </h3>
            </div>
            <p className="text-[10px] text-white/40 mt-0.5">{activeWindow.label}</p>
          </div>

          <div className="flex items-center gap-1 bg-[#1a1a1a] p-1 rounded border border-[#2a2a2a]">
            {(["7d", "14d", "30d"] as const).map((w) => (
              <button
                key={w}
                onClick={() => setSelectedWindow(w)}
                className={[
                  "px-3 py-1 text-[10px] font-bold rounded transition-all uppercase",
                  selectedWindow === w
                    ? "bg-[#faff69] text-black shadow-sm"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                ].join(" ")}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        {/* Forecast Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#222] space-y-1">
            <span className="text-[9px] text-white/40 uppercase tracking-widest block">Projected Cash Buffer</span>
            <span className="text-base font-bold text-white font-mono">{activeWindow.buffer}</span>
            <span className="text-[9px] text-green-400 block">+19.4% above reserve floor</span>
          </div>

          <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#222] space-y-1">
            <span className="text-[9px] text-white/40 uppercase tracking-widest block">Reserve Threshold Floor</span>
            <span className="text-base font-bold text-[#faff69] font-mono">{activeWindow.minThreshold}</span>
            <span className="text-[9px] text-white/30 block">Board Limit</span>
          </div>

          <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#222] space-y-1">
            <span className="text-[9px] text-white/40 uppercase tracking-widest block">Solvency Status</span>
            <span className={activeWindow.warning ? "text-amber-400 text-base font-bold" : "text-green-400 text-base font-bold"}>
              {activeWindow.status}
            </span>
            <span className="text-[9px] text-white/30 block">Calculated via ledger engine</span>
          </div>
        </div>

        {/* Cash Gap Prediction Banner */}
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <span className="font-bold text-white block">Predicted Cash Gap Risk Window (August 12 - August 18)</span>
            <p className="text-[10px] text-white/60 mt-0.5 leading-relaxed">
              Concurrent payouts to equipment maintenance vendors ($45,000) and delayed collections from Apex Steel ($47,500) may narrow the liquidity buffer to $18,400 above minimum thresholds.
            </p>
          </div>
          <button
            onClick={() => alert("Initiating yield sweep & early payment trigger sequence.")}
            className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-bold uppercase transition-colors shrink-0"
          >
            Mitigate Gap →
          </button>
        </div>
      </Panel>
    </Section>
  );
}
