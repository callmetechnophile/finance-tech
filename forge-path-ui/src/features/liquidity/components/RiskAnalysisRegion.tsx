"use client";

import React from "react";
import { ShieldAlert, AlertCircle, Percent, CheckCircle2 } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { Section } from "@/shared/components/layout/Section";

export function RiskAnalysisRegion() {
  const riskMetrics = [
    {
      category: "Delinquency Exposure",
      rating: "Moderate Risk",
      level: "warning",
      score: "68/100",
      description: "25% of AR concentrated in 2 accounts (Apex Steel, Delta Fab). Apex Steel is 45d overdue.",
    },
    {
      category: "Vendor Concentration Risk",
      rating: "Low Exposure",
      level: "normal",
      score: "88/100",
      description: "Payables evenly distributed across 8 raw material suppliers.",
    },
    {
      category: "Debt Service Coverage (DSCR)",
      rating: "Optimal (2.1x)",
      level: "positive",
      score: "92/100",
      description: "Operating cash flow exceeds monthly debt service obligations by 2.1x.",
    },
  ];

  return (
    <Section title="Risk Analysis &amp; Solvency Exposure" compact>
      <Panel className="bg-[#111] border-[#222] space-y-3" padded>
        <div className="flex justify-between items-center border-b border-[#222] pb-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-[#faff69]" /> Risk Sensitivity Vector Breakdown
          </h3>
          <span className="text-[10px] text-white/40 font-mono">3 Core Risk Categories</span>
        </div>

        <div className="space-y-3">
          {riskMetrics.map((rm) => (
            <div
              key={rm.category}
              className="p-3 rounded-lg bg-[#1a1a1a] border border-[#222] space-y-2 text-xs"
            >
              <div className="flex justify-between items-center">
                <span className="text-white font-bold">{rm.category}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-white/50">{rm.score}</span>
                  <span
                    className={[
                      "px-2 py-0.5 rounded text-[9px] font-bold uppercase",
                      rm.level === "positive" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                      rm.level === "warning" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                      "bg-[#222] text-white/70"
                    ].join(" ")}
                  >
                    {rm.rating}
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-white/60 leading-relaxed">{rm.description}</p>
            </div>
          ))}
        </div>
      </Panel>
    </Section>
  );
}
