"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { formatCurrency } from "@/lib/utils";
import { ArrowUp, AlertTriangle, Download } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data30d = [
  { date: "Jul 1", cash: 320000, inflow: 45000, outflow: 30000 },
  { date: "Jul 5", cash: 335000, inflow: 25000, outflow: 10000 },
  { date: "Jul 10", cash: 310000, inflow: 10000, outflow: 35000 },
  { date: "Jul 15", cash: 328000, inflow: 40000, outflow: 22000 },
  { date: "Jul 20", cash: 342000, inflow: 30000, outflow: 16000 },
  { date: "Jul 25", cash: 355000, inflow: 28000, outflow: 15000 },
  { date: "Jul 30", cash: 372000, inflow: 35000, outflow: 18000 },
];

export default function CashFlowPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");

  return (
    <AppShell>
      <div className="p-12 space-y-14 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold text-white">Cash Flow Forecasting</h2>
            <p className="text-xs text-[#888888] mt-1">
              Deterministic Cash Flow projections calculated from live receivables ledger and queued vendor commitments.
            </p>
          </div>

          <div className="flex gap-2">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md p-1 flex">
              {(["7d", "30d", "90d"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    period === p ? "bg-[#faff69] text-[#0a0a0a]" : "text-[#cccccc] hover:text-white"
                  }`}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
            <button className="px-3 py-1.5 btn-secondary flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-[#888888]" /> Export
            </button>
          </div>
        </div>

        {/* Forecast Metrics grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#888888]">Projected Net Flow</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xl font-bold text-[#22c55e] font-tabular">+{formatCurrency(52000)}</span>
              <span className="px-2 py-0.5 rounded bg-[#22c55e]/10 border border-[#22c55e]/25 text-[9px] text-[#22c55e] flex items-center font-bold">
                <ArrowUp className="w-2.5 h-2.5 mr-0.5" /> Inflow Surplus
              </span>
            </div>
            <p className="text-[10px] text-[#888888] mt-1">Based on projected receipts from 14 invoices</p>
          </div>

          <div className="p-7 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#888888]">Total Expected Inflow</span>
            <div className="flex items-center mt-2">
              <span className="text-xl font-bold text-white font-tabular">{formatCurrency(208000)}</span>
            </div>
            <p className="text-[10px] text-[#888888] mt-1">Weighted by customer historical payment speed</p>
          </div>

          <div className="p-7 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#888888]">Total Expected Outflow</span>
            <div className="flex items-center mt-2">
              <span className="text-xl font-bold text-white font-tabular">{formatCurrency(156000)}</span>
            </div>
            <p className="text-[10px] text-[#888888] mt-1">Includes operating costs, materials, and payroll</p>
          </div>
        </div>

        {/* Charts & Key Drivers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-10">
            <div className="p-6 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
              <h3 className="text-sm font-semibold text-white mb-4">Cash Flow Projection Trend</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data30d} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCashCF" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#faff69" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#faff69" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a2a" />
                    <XAxis dataKey="date" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <Tooltip contentStyle={{ background: "#1a1a1a", borderColor: "#2a2a2a" }} />
                    <Area type="monotone" dataKey="cash" stroke="#faff69" fillOpacity={1} fill="url(#colorCashCF)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="p-6 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] space-y-4">
              <h3 className="text-sm font-semibold text-white">Top Cash Flow Drivers</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded-md bg-[#0a0a0a] border border-[#2a2a2a]">
                  <div>
                    <div className="text-xs font-semibold text-white">Delta Fab Receipts</div>
                    <div className="text-[10px] text-[#888888] mt-0.5">Historical prompt pay</div>
                  </div>
                  <span className="text-xs font-bold text-[#22c55e] font-tabular">+{formatCurrency(38000)}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-md bg-[#0a0a0a] border border-[#2a2a2a]">
                  <div>
                    <div className="text-xs font-semibold text-white">Iron Ore Supply Inc.</div>
                    <div className="text-[10px] text-[#888888] mt-0.5">Raw materials invoice</div>
                  </div>
                  <span className="text-xs font-bold text-[#ef4444] font-tabular">-{formatCurrency(45000)}</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] space-y-3">
              <h3 className="text-sm font-semibold text-white">Anomalies & Warnings</h3>
              <div className="p-3 rounded-md bg-[#f59e0b]/10 border border-[#f59e0b]/25 flex gap-2">
                <AlertTriangle className="w-4 h-4 text-[#f59e0b] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-white">Material Price Escalation</div>
                  <div className="text-[10px] text-[#cccccc] mt-0.5">Raw sheet metal costs increased 14% month-over-month. Adjust drivers.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
