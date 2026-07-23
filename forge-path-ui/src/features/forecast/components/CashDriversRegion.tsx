"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, Layers, AlertCircle, CheckCircle2 } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { Section } from "@/shared/components/layout/Section";

export function CashDriversRegion() {
  const drivers = [
    {
      title: "Apex Steel Works Collection (INV-089)",
      type: "inflow",
      amount: "₹47,500",
      impact: "High (+14d runway)",
      status: "Risk: Delayed",
      riskLevel: "negative",
    },
    {
      title: "Delta Fabrication Wire Receipt (INV-074)",
      type: "inflow",
      amount: "₹28,000",
      impact: "Moderate (+8d runway)",
      status: "Settled",
      riskLevel: "positive",
    },
    {
      title: "CNC Machine #3 Annual Maintenance Contract",
      type: "outflow",
      amount: "₹45,000",
      impact: "Critical (-12d runway)",
      status: "Due July 24",
      riskLevel: "neutral",
    },
    {
      title: "NVIDIA NIM Infrastructure License Sweep",
      type: "outflow",
      amount: "₹18,400",
      impact: "Low (-4d runway)",
      status: "Scheduled",
      riskLevel: "positive",
    },
  ];

  return (
    <Section title="Cash Flow Drivers &amp; Liquidity Sensitivity" compact>
      <Panel className="bg-[#111] border-[#222] space-y-3" padded>
        <div className="flex justify-between items-center border-b border-[#222] pb-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#faff69]" /> Primary Inflow &amp; Outflow Drivers
          </h3>
          <span className="text-[10px] text-white/40 font-mono">4 Impact Vectors Logged</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {drivers.map((drv) => (
            <div
              key={drv.title}
              className="p-3 rounded-lg bg-[#1a1a1a] border border-[#222] flex justify-between items-center gap-3 text-xs"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  {drv.type === "inflow" ? (
                    <ArrowUpRight className="w-4 h-4 text-green-400 shrink-0" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <p className="text-white/80 font-semibold truncate">{drv.title}</p>
                </div>
                <p className="text-[10px] text-white/40 mt-1">
                  Impact: <span className="text-white/70">{drv.impact}</span>
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="font-bold text-white font-mono block">{drv.amount}</span>
                <span
                  className={[
                    "text-[9px] font-semibold uppercase block mt-0.5",
                    drv.riskLevel === "positive" ? "text-green-400" :
                    drv.riskLevel === "negative" ? "text-red-400" : "text-amber-400"
                  ].join(" ")}
                >
                  {drv.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </Section>
  );
}
