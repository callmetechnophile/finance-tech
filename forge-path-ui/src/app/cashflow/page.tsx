"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, ArrowDown, ArrowUp, AlertTriangle, Settings2, Download } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

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
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Cash Flow Forecasting</h2>
            <p className="text-xs text-[#9CA3AF] mt-1">
              Deterministic Cash Flow projections calculated from live receivables ledger and queued vendor commitments.
            </p>
          </div>

          <div className="flex gap-2">
            <div className="bg-[#111827] border border-[#1E253E] rounded-xl p-1 flex">
              {(["7d", "30d", "90d"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    period === p ? "bg-blue-600 text-white shadow" : "text-[#9CA3AF] hover:text-white"
                  }`}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
            <button className="px-3 py-1.5 bg-[#111827] border border-[#1E253E] hover:bg-[#1a2235] text-xs font-semibold text-white rounded-xl flex items-center gap-1.5 transition-colors">
              <Download className="w-3.5 h-3.5 text-[#6B7280]" /> Export
            </button>
          </div>
        </div>

        {/* Forecast Metrics grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#111827] border border-[#1E253E]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Projected Net Flow</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xl font-bold text-emerald-400">+{formatCurrency(52000)}</span>
              <span className="p-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400 flex items-center font-bold">
                <ArrowUp className="w-2.5 h-2.5 mr-0.5" /> Inflow Surplus
              </span>
            </div>
            <p className="text-[10px] text-[#6B7280] mt-1">Based on projected receipts from 14 invoices</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#111827] border border-[#1E253E]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Total Expected Inflow</span>
            <div className="flex items-center mt-2">
              <span className="text-xl font-bold text-white">{formatCurrency(208000)}</span>
            </div>
            <p className="text-[10px] text-[#6B7280] mt-1">Weighted by customer historical payment speed</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#111827] border border-[#1E253E]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Total Expected Outflow</span>
            <div className="flex items-center mt-2">
              <span className="text-xl font-bold text-white">{formatCurrency(156000)}</span>
            </div>
            <p className="text-[10px] text-[#6B7280] mt-1">Includes operating costs, materials, and payroll</p>
          </div>
        </div>

        {/* Charts & Key Drivers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Projection Chart */}
            <div className="p-6 rounded-2xl bg-[#111827] border border-[#1E253E]">
              <h3 className="text-sm font-semibold text-white mb-4">Cash Flow Projection Trend</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data30d} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCashCF" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2d44" />
                    <XAxis dataKey="date" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip contentStyle={{ background: "#111827", borderColor: "#1f2d44" }} />
                    <Area type="monotone" dataKey="cash" stroke="#2563EB" fillOpacity={1} fill="url(#colorCashCF)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Key Drivers */}
            <div className="p-6 rounded-2xl bg-[#111827] border border-[#1E253E] space-y-4">
              <h3 className="text-sm font-semibold text-white">Top Cash Flow Drivers</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0d1625] border border-[#1E253E]">
                  <div>
                    <div className="text-xs font-semibold text-white">Delta Fab Receipts</div>
                    <div className="text-[10px] text-[#6B7280] mt-0.5">Historical prompt pay</div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">+{formatCurrency(38000)}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0d1625] border border-[#1E253E]">
                  <div>
                    <div className="text-xs font-semibold text-white">Iron Ore Supply Inc.</div>
                    <div className="text-[10px] text-[#6B7280] mt-0.5">Raw materials invoice</div>
                  </div>
                  <span className="text-xs font-bold text-red-400">-{formatCurrency(45000)}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0d1625] border border-[#1E253E]">
                  <div>
                    <div className="text-xs font-semibold text-white">SME Equipment Lease</div>
                    <div className="text-[10px] text-[#6B7280] mt-0.5">CNC Lease amortization</div>
                  </div>
                  <span className="text-xs font-bold text-red-400">-{formatCurrency(12000)}</span>
                </div>
              </div>
            </div>

            {/* Anomaly Alerts */}
            <div className="p-6 rounded-2xl bg-[#111827] border border-[#1E253E] space-y-3">
              <h3 className="text-sm font-semibold text-white">Anomalies & Warnings</h3>
              <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-white">Material Price Escalation</div>
                  <div className="text-[10px] text-[#9CA3AF] mt-0.5">Raw sheet metal costs increased 14% month-over-month. Adjust drivers.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
