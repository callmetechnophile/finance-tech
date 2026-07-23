"use client";

import React from "react";
import { Layers, Clock, AlertTriangle } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { Section } from "@/shared/components/layout/Section";

export function AgingAnalysisRegion() {
  const agingBuckets = [
    { label: "Current (0-30 Days)", amount: "₹1,62,000", pct: 57, color: "bg-green-400", count: "7 Invoices" },
    { label: "31-60 Days Overdue", amount: "₹65,000", pct: 23, color: "bg-[#faff69]", count: "3 Invoices" },
    { label: "61-90 Days Overdue", amount: "₹47,500", pct: 17, color: "bg-amber-400", count: "1 Invoice (Apex)" },
    { label: "90+ Days Overdue", amount: "₹10,000", pct: 3, color: "bg-red-400", count: "1 Invoice" },
  ];

  return (
    <Section title="AR Aging Analysis &amp; Delinquency Buckets" compact>
      <Panel className="bg-[#111] border-[#222] space-y-4" padded>
        <div className="flex justify-between items-center border-b border-[#222] pb-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#faff69]" /> Aging Distribution (Total: ₹2,84,500)
          </h3>
          <span className="text-[10px] text-white/40 font-mono">ClickHouse Real-time Audit</span>
        </div>

        {/* Stacked Progress Bar */}
        <div className="space-y-1.5">
          <div className="h-3 w-full rounded bg-[#1a1a1a] flex overflow-hidden p-0.5 border border-[#222]">
            {agingBuckets.map((b) => (
              <div
                key={b.label}
                style={{ width: `${b.pct}%` }}
                className={`${b.color} h-full transition-all first:rounded-l last:rounded-r`}
                title={`${b.label}: ${b.amount} (${b.pct}%)`}
              />
            ))}
          </div>
          <div className="flex justify-between text-[9px] text-white/30 font-mono">
            <span>0d</span>
            <span>30d</span>
            <span>60d</span>
            <span>90d+</span>
          </div>
        </div>

        {/* Bucket Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {agingBuckets.map((b) => (
            <div key={b.label} className="p-3 rounded-lg bg-[#1a1a1a] border border-[#222] space-y-1">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${b.color}`} />
                <span className="text-[10px] font-bold text-white/80">{b.label}</span>
              </div>
              <span className="text-base font-bold text-white font-mono block">{b.amount}</span>
              <div className="flex justify-between text-[9px] text-white/40 border-t border-[#222] pt-1 mt-1">
                <span>{b.count}</span>
                <span className="font-mono">{b.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </Section>
  );
}
