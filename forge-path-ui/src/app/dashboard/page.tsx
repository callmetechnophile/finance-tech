"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { formatCurrency, getGreeting } from "@/lib/utils";
import { ArrowUpRight, ArrowUp, ArrowRight, AlertTriangle, FileText, Bot, CreditCard, UploadCloud, TrendingUp, AlertCircle, Sparkles } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";

const chartData = [
  { name: "Mon", cash: 320000, projected: 320000, minConfidence: 310000, maxConfidence: 330000 },
  { name: "Tue", cash: 315000, projected: 315000, minConfidence: 300000, maxConfidence: 330000 },
  { name: "Wed", cash: 338000, projected: 338000, minConfidence: 320000, maxConfidence: 356000 },
  { name: "Thu", cash: 345000, projected: 345000, minConfidence: 330000, maxConfidence: 360000 },
  { name: "Fri", cash: 342000, projected: 360000, minConfidence: 340000, maxConfidence: 380000 },
  { name: "Sat", cash: 342000, projected: 365000, minConfidence: 345000, maxConfidence: 385000 },
  { name: "Sun", cash: 342000, projected: 372000, minConfidence: 350000, maxConfidence: 395000 },
];

export default function DashboardPage() {
  const greeting = getGreeting();
  const [forecastPeriod, setForecastPeriod] = useState<"7d" | "30d" | "90d">("30d");

  return (
    <AppShell>
      <div className="flex flex-col gap-12 p-8 max-w-[1600px] mx-auto w-full">
        
        {/* EXECUTIVE SUMMARY */}
        <div className="p-8 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] relative overflow-hidden">
          <div className="absolute right-0 top-0 w-[500px] h-full bg-[#faff69]/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-7">
                <span className="px-2.5 py-0.5 rounded bg-[#22c55e]/10 border border-[#22c55e]/25 text-[10px] font-bold text-[#22c55e] uppercase">
                  Healthy
                </span>
                <span className="text-xs text-[#888888] font-semibold">Today's Financial Status</span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">{greeting}, Alexander</h1>
              <p className="text-xs text-[#cccccc] leading-relaxed max-w-4xl font-medium">
                CFO Command Briefing: cash liquidity buffer sits at <strong className="text-white font-bold">$342,000</strong> (68 days runway). 
                Gemma analyzed collections patterns and raised a potential delay alarm for <strong className="text-white font-semibold">Apex Steel</strong> (L4 action recommended).
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 xl:gap-12 bg-[#0a0a0a] p-7 rounded-md border border-[#2a2a2a] flex-shrink-0">
              <div className="text-center xl:text-left">
                <div className="text-[10px] font-bold text-[#888888] uppercase tracking-wider">Cash Runway</div>
                <div className="text-lg font-bold text-white mt-1">68 Days</div>
              </div>
              <div className="h-8 w-px bg-[#2a2a2a] hidden sm:block" />
              <div className="text-center xl:text-left">
                <div className="text-[10px] font-bold text-[#888888] uppercase tracking-wider">Liquidity index</div>
                <div className="text-lg font-bold text-[#22c55e] mt-1">84/100</div>
              </div>
              <div className="h-8 w-px bg-[#2a2a2a] hidden sm:block" />
              <div className="text-center xl:text-left">
                <div className="text-[10px] font-bold text-[#888888] uppercase tracking-wider">Critical Alerts</div>
                <div className="text-lg font-bold text-[#ef4444] mt-1">2 Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* 8-COLUMN REDESIGNED KPI GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-6">
          
          <div className="p-7 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex flex-col items-center justify-between min-h-[140px] text-center hover:border-[#faff69]/30 transition-all duration-200">
            <span className="text-[9px] font-bold text-[#888888] uppercase tracking-wider w-full text-center">Current Cash</span>
            <div className="mt-1.5">
              <div className="text-xl font-bold text-white tracking-tight font-tabular">$342.0K</div>
              <div className="text-[10px] text-[#22c55e] font-bold flex items-center justify-center gap-0.5 mt-0.5"><ArrowUp className="w-3 h-3" /> +4.2%</div>
            </div>
            <div className="w-full h-5 mt-2">
              <svg className="w-full h-full stroke-[#22c55e] fill-none" viewBox="0 0 100 20">
                <path d="M0,15 L20,13 L40,16 L60,10 L80,12 L100,5" strokeWidth="2" />
              </svg>
            </div>
          </div>

          <div className="p-7 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex flex-col items-center justify-between min-h-[140px] text-center hover:border-[#faff69]/30 transition-all duration-200">
            <span className="text-[9px] font-bold text-[#888888] uppercase tracking-wider w-full text-center">Receivables</span>
            <div className="mt-1.5">
              <div className="text-xl font-bold text-white tracking-tight font-tabular">$284.5K</div>
              <div className="text-[10px] text-[#ef4444] font-bold flex items-center justify-center gap-0.5 mt-0.5"><ArrowUp className="w-3 h-3" /> +12%</div>
            </div>
            <div className="w-full h-5 mt-2">
              <svg className="w-full h-full stroke-[#ef4444] fill-none" viewBox="0 0 100 20">
                <path d="M0,5 L20,8 L40,6 L60,12 L80,14 L100,18" strokeWidth="2" />
              </svg>
            </div>
          </div>

          <div className="p-7 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex flex-col items-center justify-between min-h-[140px] text-center hover:border-[#faff69]/30 transition-all duration-200">
            <span className="text-[9px] font-bold text-[#888888] uppercase tracking-wider w-full text-center">Payables</span>
            <div className="mt-1.5">
              <div className="text-xl font-bold text-white tracking-tight font-tabular">$118.4K</div>
              <div className="text-[10px] text-[#888888] font-bold mt-0.5">Stable</div>
            </div>
            <div className="w-full h-5 mt-2">
              <svg className="w-full h-full stroke-[#888888] fill-none" viewBox="0 0 100 20">
                <path d="M0,10 L25,10 L50,11 L75,9 L100,10" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          <div className="p-7 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex flex-col items-center justify-between min-h-[140px] text-center hover:border-[#faff69]/30 transition-all duration-200">
            <span className="text-[9px] font-bold text-[#888888] uppercase tracking-wider w-full text-center">Liquidity Index</span>
            <div className="mt-1.5">
              <div className="text-xl font-bold text-[#22c55e] tracking-tight font-tabular">84/100</div>
              <div className="text-[10px] text-[#22c55e] font-bold mt-0.5">Optimal</div>
            </div>
            <div className="w-full h-5 mt-2">
              <svg className="w-full h-full stroke-[#22c55e] fill-none" viewBox="0 0 100 20">
                <path d="M0,12 L20,12 L40,11 L60,8 L80,6 L100,4" strokeWidth="2" />
              </svg>
            </div>
          </div>

          <div className="p-7 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex flex-col items-center justify-between min-h-[140px] text-center hover:border-[#faff69]/30 transition-all duration-200">
            <span className="text-[9px] font-bold text-[#888888] uppercase tracking-wider w-full text-center">Runway</span>
            <div className="mt-1.5">
              <div className="text-xl font-bold text-white tracking-tight font-tabular">68 Days</div>
              <div className="text-[10px] text-[#22c55e] font-bold mt-0.5">Optimal buffer</div>
            </div>
            <div className="w-full h-5 mt-2">
              <svg className="w-full h-full stroke-[#faff69] fill-none" viewBox="0 0 100 20">
                <path d="M0,15 L30,13 L60,11 L100,10" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          <div className="p-7 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex flex-col items-center justify-between min-h-[140px] text-center hover:border-[#faff69]/30 transition-all duration-200">
            <span className="text-[9px] font-bold text-[#888888] uppercase tracking-wider w-full text-center">Work Capital</span>
            <div className="mt-1.5">
              <div className="text-xl font-bold text-white tracking-tight font-tabular">$508K</div>
              <div className="text-[10px] text-[#22c55e] font-bold mt-0.5">2.4 Current Ratio</div>
            </div>
            <div className="w-full h-5 mt-2">
              <svg className="w-full h-full stroke-[#22c55e] fill-none" viewBox="0 0 100 20">
                <path d="M0,14 L30,12 L60,10 L100,8" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          <div className="p-7 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex flex-col items-center justify-between min-h-[140px] text-center hover:border-[#faff69]/30 transition-all duration-200">
            <span className="text-[9px] font-bold text-[#888888] uppercase tracking-wider w-full text-center">Daily Burn</span>
            <div className="mt-1.5">
              <div className="text-xl font-bold text-white tracking-tight font-tabular">$5.0K</div>
              <div className="text-[10px] text-[#888888] font-bold mt-0.5">Avg standard</div>
            </div>
            <div className="w-full h-5 mt-2">
              <svg className="w-full h-full stroke-[#888888] fill-none" viewBox="0 0 100 20">
                <path d="M0,10 L25,10 L50,11 L75,10 L100,10" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          <div className="p-7 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex flex-col items-center justify-between min-h-[140px] text-center hover:border-[#faff69]/30 transition-all duration-200">
            <span className="text-[9px] font-bold text-[#888888] uppercase tracking-wider w-full text-center">Confidence</span>
            <div className="mt-1.5">
              <div className="text-xl font-bold text-[#faff69] tracking-tight font-tabular">94.8%</div>
              <div className="text-[10px] text-[#faff69] font-bold mt-0.5">High Reliability</div>
            </div>
            <div className="w-full h-5 mt-2">
              <svg className="w-full h-full stroke-[#faff69] fill-none" viewBox="0 0 100 20">
                <path d="M0,10 L20,8 L40,9 L60,6 L80,5 L100,4" strokeWidth="2" />
              </svg>
            </div>
          </div>

        </div>

        {/* 12-COLUMN MAIN COMMAND GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Panel (8 Columns): Financial Forecasts & Graphs */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Forecast Chart Panel */}
            <div className="p-8 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">Cash Flow Forecast Pipeline</h3>
                  <p className="text-[11px] font-medium text-[#888888] mt-0.5">Deterministic ledger forecasts with AI confidence intervals</p>
                </div>
                
                {/* Toggles for Period */}
                <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-md p-1 flex items-center gap-1 self-start">
                  {(["7d", "30d", "90d"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setForecastPeriod(p)}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                        forecastPeriod === p
                          ? "bg-[#faff69] text-[#0a0a0a] shadow-md"
                          : "text-[#cccccc] hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Responsive Chart Container with Confidence Band */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#faff69" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#faff69" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a2a" />
                    <XAxis dataKey="name" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <Tooltip contentStyle={{ background: "#1a1a1a", borderColor: "#2a2a2a", borderRadius: "8px" }} />
                    
                    {/* Actual / Target Lines */}
                    <Area type="monotone" dataKey="cash" stroke="#faff69" fillOpacity={1} fill="url(#colorActual)" strokeWidth={3} />
                    <Area type="monotone" dataKey="projected" stroke="#888888" fillOpacity={0} strokeWidth={2} strokeDasharray="4 4" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Forecast Drivers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-6 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Largest Upcoming Outflows</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3.5 bg-[#0a0a0a] rounded-md border border-[#2a2a2a]">
                    <div>
                      <div className="text-xs font-bold text-white">Apex Steel Co.</div>
                      <div className="text-[10px] text-[#888888] mt-0.5">Raw materials supplier • Net 30</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-white font-tabular">$47,500</div>
                      <div className="text-[9px] text-[#f59e0b] font-semibold mt-0.5">L4 Escalation</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-[#0a0a0a] rounded-md border border-[#2a2a2a]">
                    <div>
                      <div className="text-xs font-bold text-white">FabriCut Machinery</div>
                      <div className="text-[10px] text-[#888888] mt-0.5">Laser equipment lease • Net 15</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-white font-tabular">$22,000</div>
                      <div className="text-[9px] text-[#22c55e] font-semibold mt-0.5">Discount Available</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Key Inflow Targets</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3.5 bg-[#0a0a0a] rounded-md border border-[#2a2a2a]">
                    <div>
                      <div className="text-xs font-bold text-white">Delta Aerospace Ltd</div>
                      <div className="text-[10px] text-[#888888] mt-0.5">CNC Machining Parts Batch #2</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#22c55e] font-tabular">$64,000</div>
                      <div className="text-[9px] text-[#888888] font-semibold mt-0.5">Due in 4 days</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-[#0a0a0a] rounded-md border border-[#2a2a2a]">
                    <div>
                      <div className="text-xs font-bold text-white">General Heavy Industry</div>
                      <div className="text-[10px] text-[#888888] mt-0.5">Welded Assembly job contract</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#22c55e] font-tabular">$38,200</div>
                      <div className="text-[9px] text-[#888888] font-semibold mt-0.5">Due in 9 days</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Panel (4 Columns): AI command logs, actions, alerts */}
          <div className="lg:col-span-4 space-y-12">
            
            {/* AI INSIGHTS PANEL */}
            <div className="p-6 rounded-lg bg-[#1a1a1a] border border-[#faff69]/20 shadow-glow-yellow space-y-4">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#faff69]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Executive Insights</h3>
              </div>
              
              <div className="space-y-3">
                <div className="p-4 rounded-md bg-[#0a0a0a] border border-[#2a2a2a] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-[#faff69]/10 border border-[#faff69]/25 text-[9px] font-bold text-[#faff69] uppercase">
                      Collections priority
                    </span>
                    <span className="text-[9px] text-[#888888] font-semibold">Impact: +$47,500</span>
                  </div>
                  <p className="text-xs text-[#cccccc] leading-relaxed">
                    Apex Steel has exceeded standard grace limits. Gemma recommends sending an SMS escalation log reminder now.
                  </p>
                  <button className="w-full py-2 rounded-md bg-[#faff69] hover:bg-[#e6eb52] text-[11px] font-bold text-[#0a0a0a] flex items-center justify-center gap-1.5 transition-all">
                    Send L4 Alert <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* CRITICAL ALERTS PANEL */}
            <div className="p-6 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Critical Alerts</h3>
              <div className="space-y-3">
                <div className="p-4 rounded-md bg-[#0a0a0a] border border-[#ef4444]/20 flex gap-7">
                  <AlertCircle className="w-5 h-5 text-[#ef4444] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-white">Overdue Collections: INV-2024-089</div>
                    <p className="text-[10px] text-[#888888] mt-1 leading-relaxed">Apex Steel invoice of $47,500 has exceeded standard escalation limits.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS CARD */}
            <div className="p-6 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Action Center</h3>
              <div className="grid grid-cols-2 gap-7">
                <Link href="/documents" className="p-4 rounded-md bg-[#0a0a0a] hover:bg-[#242424] border border-[#2a2a2a] flex flex-col items-center justify-center text-center transition-all group">
                  <UploadCloud className="w-5 h-5 text-[#faff69] mb-2 group-hover:scale-105 transition-transform" />
                  <span className="text-[9px] font-bold text-white">Upload Docs</span>
                </Link>
                <Link href="/copilot" className="p-4 rounded-md bg-[#0a0a0a] hover:bg-[#242424] border border-[#2a2a2a] flex flex-col items-center justify-center text-center transition-all group">
                  <Bot className="w-5 h-5 text-[#faff69] mb-2 group-hover:scale-105 transition-transform" />
                  <span className="text-[9px] font-bold text-white">Ask Copilot</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AppShell>
  );
}
