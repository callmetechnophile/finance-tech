"use client";

import React from "react";
import { Activity, TrendingUp, Cpu, Layers, Database, Percent, Clock, CheckCircle2 } from "lucide-react";
import { PageContainer } from "@/shared/components/layout/PageContainer";
import { WorkspaceHeader } from "@/shared/components/layout/WorkspaceHeader";
import { Section } from "@/shared/components/layout/Section";
import { Panel } from "@/shared/components/layout/Panel";
import { MetricCard } from "@/shared/components/cards/MetricCard";

export default function AnalyticsPage() {
  const HeaderActions = (
    <div className="flex items-center gap-2">
      <button
        onClick={() => alert("Re-querying ClickHouse & NeonDB telemetry analytics engine...")}
        className="px-3 py-1.5 rounded-lg bg-[#faff69] hover:bg-[#e6eb52] text-black text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        <Activity className="w-3.5 h-3.5" />
        <span>Refresh BI Engine</span>
      </button>
    </div>
  );

  const HeaderBadge = (
    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-wider">
      ClickHouse Telemetry Active
    </span>
  );

  return (
    <div className="h-full flex flex-col min-h-0 bg-[#0a0a0a]" aria-label="Business Analytics Workspace">
      <WorkspaceHeader
        title="Business Analytics &amp; BI Grids"
        subtitle="Real-time pipeline benchmarks, DSO collections efficiency, NeonDB transaction query performance, and AI confidence telemetry."
        icon={<Activity className="w-5 h-5 text-[#faff69]" aria-hidden="true" />}
        badge={HeaderBadge}
        actions={HeaderActions}
        bordered={true}
        className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#2a2a2a]"
      />

      <PageContainer scrollable={true} padded={true} className="flex-1 space-y-6 pb-16">
        {/* KPI Telemetry */}
        <Section title="BI Operational Benchmarks" compact>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard
              label="DSO (Days Sales Outstanding)"
              value="34.2 Days"
              trend={{ value: "-2.4d", direction: "up", label: "improved" }}
              severity="positive"
              icon={<Clock className="w-4 h-4 text-green-400" />}
            />
            <MetricCard
              label="DPO (Days Payable Outstanding)"
              value="28.5 Days"
              trend={{ value: "Optimal", direction: "flat" }}
              severity="normal"
              icon={<Clock className="w-4 h-4 text-white/40" />}
            />
            <MetricCard
              label="OCR Parsing Accuracy"
              value="98.4%"
              trend={{ value: "+0.8%", direction: "up" }}
              severity="positive"
              icon={<Cpu className="w-4 h-4 text-[#faff69]" />}
            />
            <MetricCard
              label="ClickHouse Event Stream"
              value="12.4k events/s"
              trend={{ value: "Live", direction: "up" }}
              severity="positive"
              icon={<Activity className="w-4 h-4 text-green-400" />}
            />
          </div>
        </Section>

        {/* Analytics Breakdown Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Panel className="bg-[#111] border-[#222] space-y-3" padded>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#faff69]" /> AR Cohort Delinquency Distribution
            </h3>
            <div className="space-y-2 text-xs">
              {[
                { cohort: "0-30 Days Overdue", amount: "$120,500", pct: 42, color: "bg-green-500" },
                { cohort: "31-60 Days Overdue", amount: "$85,200", pct: 30, color: "bg-[#faff69]" },
                { cohort: "61-90 Days Overdue", amount: "$45,000", pct: 16, color: "bg-amber-500" },
                { cohort: "90+ Days Overdue (Legal)", amount: "$33,800", pct: 12, color: "bg-red-500" },
              ].map((c) => (
                <div key={c.cohort} className="space-y-1">
                  <div className="flex justify-between text-[11px] text-white/70">
                    <span>{c.cohort}</span>
                    <span className="font-mono font-bold">{c.amount} ({c.pct}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#222] rounded-full overflow-hidden">
                    <div className={`h-full ${c.color}`} style={{ width: `${c.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="bg-[#111] border-[#222] space-y-3" padded>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-blue-400" /> Database &amp; API Performance Latencies
            </h3>
            <div className="space-y-2 text-xs">
              {[
                { metric: "Neon PostgreSQL Query Latency", val: "1.2 ms (p99: 4.8ms)" },
                { metric: "FastAPI REST Response Latency", val: "14.2 ms" },
                { metric: "NVIDIA NIM Gemma Inference", val: "145.0 ms" },
                { metric: "ClickHouse Aggregation Speed", val: "0.4 ms" },
              ].map((m) => (
                <div key={m.metric} className="p-2.5 rounded bg-[#1a1a1a] border border-[#222] flex justify-between items-center">
                  <span className="text-white/80 font-medium">{m.metric}</span>
                  <span className="font-mono font-bold text-[#faff69]">{m.val}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </PageContainer>
    </div>
  );
}
