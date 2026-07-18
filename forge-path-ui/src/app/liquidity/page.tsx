"use client";

import { AppShell } from "@/components/layout/AppShell";
import { formatCurrency } from "@/lib/utils";
import { Shield, Sparkles, Activity, AlertTriangle, Droplets, Heart } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const liquidityTrend = [
  { name: "Week 1", score: 82 },
  { name: "Week 2", score: 80 },
  { name: "Week 3", score: 84 },
  { name: "Week 4", score: 84 },
];

const runwayTimeline = [
  { month: "Jul", days: 68 },
  { month: "Aug", days: 64 },
  { month: "Sep", days: 58 },
  { month: "Oct", days: 62 },
];

export default function LiquidityPage() {
  return (
    <AppShell>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div>
          <h2 className="text-xl font-bold text-white">Liquidity Intelligence</h2>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Real-time runway calculation, working capital metrics, and scenario stress tests for manufacturing SMEs.
          </p>
        </div>

        {/* Core KPI row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#111827] border border-[#1f2d44]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Liquidity Health</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-emerald-400">84</span>
              <span className="text-xs text-[#6B7280]">/100</span>
            </div>
            <p className="text-[10px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
              <Heart className="w-3 h-3 fill-current" /> Excellent Buffer
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#111827] border border-[#1f2d44]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Working Capital</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-white">{formatCurrency(508000)}</span>
            </div>
            <p className="text-[10px] text-[#6B7280] mt-1">Current assets - current liabilities</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#111827] border border-[#1f2d44]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Cash Buffer Days</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-white">68 Days</span>
            </div>
            <p className="text-[10px] text-emerald-400 mt-1 font-semibold">Safe limit: &gt; 45 Days</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#111827] border border-[#1f2d44]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Burn Rate</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-white">{formatCurrency(5000)}</span>
              <span className="text-xs text-[#6B7280]">/day</span>
            </div>
            <p className="text-[10px] text-[#6B7280] mt-1">Average daily cash outflow</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#111827] border border-[#1f2d44]">
            <h3 className="text-sm font-semibold text-white mb-4">Liquidity Score Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={liquidityTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2d44" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip contentStyle={{ background: "#111827", borderColor: "#1f2d44" }} />
                  <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#111827] border border-[#1f2d44]">
            <h3 className="text-sm font-semibold text-white mb-4">Projected Cash Runway Timeline</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={runwayTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2d44" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip contentStyle={{ background: "#111827", borderColor: "#1f2d44" }} />
                  <Bar dataKey="days" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Stress Testing Scenario Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <h3 className="text-sm font-semibold text-white">Scenario Stress Tests</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#111827] border border-[#1f2d44] hover:border-blue-500/50 transition-all cursor-pointer">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">30-day Client Delay</h4>
              <p className="text-[11px] text-[#6B7280] mt-1">Simulates 100% of top client payments delayed by 30 days.</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs font-semibold text-red-400">-{formatCurrency(85000)} Cash Impact</span>
                <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded font-semibold border border-red-500/20">Critical</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#111827] border border-[#1f2d44] hover:border-blue-500/50 transition-all cursor-pointer">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Raw Material Cost Spike</h4>
              <p className="text-[11px] text-[#6B7280] mt-1">Simulates a sudden 20% surcharge across metal suppliers.</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs font-semibold text-yellow-500">-{formatCurrency(32000)} Cash Impact</span>
                <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded font-semibold border border-yellow-500/20">Moderate</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#111827] border border-[#1f2d44] hover:border-blue-500/50 transition-all cursor-pointer">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Urgent Maintenance Amortization</h4>
              <p className="text-[11px] text-[#6B7280] mt-1">Simulates compressor breakdown requiring immediate capital.</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs font-semibold text-emerald-400">-{formatCurrency(15000)} Cash Impact</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-semibold border border-emerald-500/20">Low Risk</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
