"use client";

import { AppShell } from "@/components/layout/AppShell";
import { formatCurrency } from "@/lib/utils";
import { Calendar, BarChart3, LineChart as LineIcon, PieChart as PieIcon, Download, RefreshCw } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from "recharts";
import { toast } from "sonner";

const historyData = [
  { month: "Jan", revenue: 180000, expenses: 145000 },
  { month: "Feb", revenue: 210000, expenses: 160000 },
  { month: "Mar", revenue: 195000, expenses: 155000 },
  { month: "Apr", revenue: 220000, expenses: 170000 },
  { month: "May", revenue: 250000, expenses: 185000 },
  { month: "Jun", revenue: 245000, expenses: 180000 },
];

const accuracyData = [
  { month: "Jan", actual: 180000, forecasted: 175000 },
  { month: "Feb", actual: 210000, forecasted: 215000 },
  { month: "Mar", actual: 195000, forecasted: 200000 },
  { month: "Apr", actual: 220000, forecasted: 218000 },
  { month: "May", actual: 250000, forecasted: 240000 },
  { month: "Jun", actual: 245000, forecasted: 242000 },
];

export default function AnalyticsPage() {
  const triggerExport = (format: string) => {
    toast.success(`Exported analytics ledger successfully as ${format.toUpperCase()}.`);
  };

  return (
    <AppShell>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Interactive Analytics Dashboard</h2>
            <p className="text-xs text-[#9CA3AF] mt-1">
              Historical ledger metrics, forecast accuracy statistics, and payables performance logs.
            </p>
          </div>

          <div className="flex gap-2">
            <button onClick={() => triggerExport("csv")} className="px-3 py-1.5 bg-[#111827] border border-[#1E253E] hover:bg-[#1a2235] text-xs font-semibold text-white rounded-xl flex items-center gap-1.5 transition-colors">
              <Download className="w-3.5 h-3.5 text-[#6B7280]" /> CSV
            </button>
            <button onClick={() => triggerExport("pdf")} className="px-3 py-1.5 bg-[#111827] border border-[#1E253E] hover:bg-[#1a2235] text-xs font-semibold text-white rounded-xl flex items-center gap-1.5 transition-colors">
              <Download className="w-3.5 h-3.5 text-[#6B7280]" /> PDF
            </button>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue vs Expenses */}
          <div className="p-6 rounded-2xl bg-[#111827] border border-[#1E253E]">
            <h3 className="text-sm font-semibold text-white mb-4">Historical Revenue vs Expenses</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2d44" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip contentStyle={{ background: "#111827", borderColor: "#1f2d44" }} />
                  <Area type="monotone" dataKey="revenue" stroke="#2563EB" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                  <Area type="monotone" dataKey="expenses" stroke="#EF4444" fillOpacity={1} fill="url(#colorExp)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Forecast Accuracy */}
          <div className="p-6 rounded-2xl bg-[#111827] border border-[#1E253E]">
            <h3 className="text-sm font-semibold text-white mb-4">Forecast Accuracy Performance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={accuracyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2d44" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip contentStyle={{ background: "#111827", borderColor: "#1f2d44" }} />
                  <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="forecasted" stroke="#7C3AED" strokeWidth={2} strokeDasharray="4 4" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
