"use client";

import React from "react";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Layers } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { Section } from "@/shared/components/layout/Section";

export function CashFlowTimelineRegion() {
  const weeklyFlows = [
    { week: "W1 (July 1 - 7)", inflow: "$95,000", outflow: "$32,000", net: "+$63,000", buffer: "$310,000", isActual: true },
    { week: "W2 (July 8 - 14)", inflow: "$82,000", outflow: "$48,000", net: "+$34,000", buffer: "$344,000", isActual: true },
    { week: "W3 (July 15 - 21)", inflow: "$110,000", outflow: "$65,000", net: "+$45,000", buffer: "$389,000", isActual: true },
    { week: "W4 (July 22 - 28)", inflow: "$45,000", outflow: "$92,000", net: "-$47,000", buffer: "$342,000", isActual: false },
    { week: "W5 (July 29 - Aug 4)", inflow: "$88,000", outflow: "$42,000", net: "+$46,000", buffer: "$388,000", isActual: false },
  ];

  return (
    <Section title="Cash Flow Timeline &amp; Net Liquidity" compact>
      <Panel className="bg-[#111] border-[#222] space-y-3" padded>
        <div className="flex justify-between items-center border-b border-[#222] pb-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#faff69]" /> Weekly Net Cash Flow Telemetry
          </h3>
          <span className="text-[10px] text-white/40 font-mono">Actuals vs Forecasted Outflows</span>
        </div>

        <div className="space-y-2">
          {weeklyFlows.map((wf) => (
            <div
              key={wf.week}
              className="p-2.5 rounded-lg bg-[#1a1a1a] border border-[#222] flex flex-wrap items-center justify-between gap-3 text-xs"
            >
              <div className="min-w-[140px]">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${wf.isActual ? "bg-green-400" : "bg-[#faff69] border border-dashed border-[#faff69]"}`} />
                  <span className="text-white font-semibold">{wf.week}</span>
                </div>
                <span className="text-[9px] text-white/30 block mt-0.5">{wf.isActual ? "Verified Actual" : "Predictive Projection"}</span>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-green-400 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" /> {wf.inflow}
                </span>
                <span className="text-amber-400 flex items-center gap-0.5">
                  <ArrowDownRight className="w-3 h-3" /> {wf.outflow}
                </span>
                <span className={wf.net.startsWith("+") ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                  {wf.net}
                </span>
              </div>

              <div className="text-right font-mono text-[11px]">
                <span className="text-white/40 block text-[9px] uppercase">End Buffer</span>
                <span className="text-white font-bold">{wf.buffer}</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </Section>
  );
}
