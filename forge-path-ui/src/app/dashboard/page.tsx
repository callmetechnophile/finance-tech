"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { formatCurrency, getGreeting } from "@/lib/utils";
import {
  ArrowUpRight, ArrowDownRight, AlertTriangle, FileText, Bot,
  CreditCard, UploadCloud, TrendingUp, Sparkles, AlertCircle,
  Clock, Zap, CheckCircle2, ChevronRight, Activity, ArrowRight, HelpCircle
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";
import { motion } from "framer-motion";

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
  const [forecastPeriod, setForecastPeriod] = useState<"7d" | "30d" | "90d" | "180d" | "365d">("30d");

  return (
    <AppShell>
      <div className="flex flex-col gap-8 p-8 max-w-[1600px] mx-auto w-full">
        
        {/* EXECUTIVE SUMMARY: Morning Financial Brief Banner */}
        <div className="p-8 rounded-[20px] bg-gradient-to-r from-blue-900/40 via-indigo-950/40 to-slate-900/50 border border-blue-500/20 shadow-glow-blue relative overflow-hidden">
          <div className="absolute right-0 top-0 w-[500px] h-full bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
                  Healthy
                </span>
                <span className="text-xs text-[#94A3B8] font-semibold">Today's Financial Status</span>
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">{greeting}, Alexander</h1>
              <p className="text-xs text-[#94A3B8] leading-relaxed max-w-4xl font-medium">
                CFO Command Briefing: cash liquidity buffer sits at <strong className="text-white font-bold">$342,000</strong> (68 days runway). 
                Gemma analyzed collections patterns and raised a potential delay alarm for <strong className="text-white font-semibold">Apex Steel</strong> (L4 action recommended).
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 xl:gap-8 bg-black/20 p-5 rounded-2xl border border-white/5 flex-shrink-0">
              <div className="text-center xl:text-left">
                <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Cash Runway</div>
                <div className="text-lg font-black text-white mt-1">68 Days</div>
              </div>
              <div className="h-8 w-px bg-white/10 hidden sm:block" />
              <div className="text-center xl:text-left">
                <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Liquidity index</div>
                <div className="text-lg font-black text-emerald-400 mt-1">84/100</div>
              </div>
              <div className="h-8 w-px bg-white/10 hidden sm:block" />
              <div className="text-center xl:text-left">
                <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Critical Alerts</div>
                <div className="text-lg font-black text-red-400 mt-1">2 Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* 8-COLUMN REDESIGNED KPI GRID WITH Sparklines */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
          {/* Card 1: Current Cash */}
          <div className="p-5 rounded-[20px] bg-[#0F1322] border border-[#1E253E] hover:border-blue-500/30 transition-all duration-200 flex flex-col justify-between min-h-[140px] shadow-sm">
            <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider">Current Cash</span>
            <div className="mt-1.5">
              <div className="text-xl font-black text-white tracking-tight">$342.0K</div>
              <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 mt-0.5"><ArrowUpRight className="w-3 h-3" /> +4.2%</div>
            </div>
            <div className="w-full h-5 mt-2">
              <svg className="w-full h-full stroke-emerald-500 fill-none" viewBox="0 0 100 20">
                <path d="M0,15 L20,13 L40,16 L60,10 L80,12 L100,5" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Card 2: Outstanding Receivables */}
          <div className="p-5 rounded-[20px] bg-[#0F1322] border border-[#1E253E] hover:border-blue-500/30 transition-all duration-200 flex flex-col justify-between min-h-[140px] shadow-sm">
            <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider">Receivables</span>
            <div className="mt-1.5">
              <div className="text-xl font-black text-white tracking-tight">$284.5K</div>
              <div className="text-[10px] text-red-400 font-bold flex items-center gap-0.5 mt-0.5"><ArrowUpRight className="w-3 h-3" /> +12%</div>
            </div>
            <div className="w-full h-5 mt-2">
              <svg className="w-full h-full stroke-red-500 fill-none" viewBox="0 0 100 20">
                <path d="M0,5 L20,8 L40,6 L60,12 L80,14 L100,18" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Card 3: Outstanding Payables */}
          <div className="p-5 rounded-[20px] bg-[#0F1322] border border-[#1E253E] hover:border-blue-500/30 transition-all duration-200 flex flex-col justify-between min-h-[140px] shadow-sm">
            <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider">Payables</span>
            <div className="mt-1.5">
              <div className="text-xl font-black text-white tracking-tight">$118.4K</div>
              <div className="text-[10px] text-[#94A3B8] font-bold mt-0.5">Stable</div>
            </div>
            <div className="w-full h-5 mt-2">
              <svg className="w-full h-full stroke-[#475569] fill-none" viewBox="0 0 100 20">
                <path d="M0,10 L25,10 L50,11 L75,9 L100,10" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          {/* Card 4: Liquidity Score */}
          <div className="p-5 rounded-[20px] bg-[#0F1322] border border-[#1E253E] hover:border-blue-500/30 transition-all duration-200 flex flex-col justify-between min-h-[140px] shadow-sm">
            <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider">Liquidity Index</span>
            <div className="mt-1.5">
              <div className="text-xl font-black text-emerald-400 tracking-tight">84/100</div>
              <div className="text-[10px] text-emerald-400 font-bold mt-0.5">Optimal</div>
            </div>
            <div className="w-full h-5 mt-2">
              <svg className="w-full h-full stroke-emerald-500 fill-none" viewBox="0 0 100 20">
                <path d="M0,12 L20,12 L40,11 L60,8 L80,6 L100,4" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Card 5: Cash Runway */}
          <div className="p-5 rounded-[20px] bg-[#0F1322] border border-[#1E253E] hover:border-blue-500/30 transition-all duration-200 flex flex-col justify-between min-h-[140px] shadow-sm">
            <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider">Runway</span>
            <div className="mt-1.5">
              <div className="text-xl font-black text-white tracking-tight">68 Days</div>
              <div className="text-[10px] text-emerald-400 font-bold mt-0.5">Optimal buffer</div>
            </div>
            <div className="w-full h-5 mt-2">
              <svg className="w-full h-full stroke-blue-500 fill-none" viewBox="0 0 100 20">
                <path d="M0,15 L30,13 L60,11 L100,10" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          {/* Card 6: Working Capital */}
          <div className="p-5 rounded-[20px] bg-[#0F1322] border border-[#1E253E] hover:border-blue-500/30 transition-all duration-200 flex flex-col justify-between min-h-[140px] shadow-sm">
            <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider">Work Capital</span>
            <div className="mt-1.5">
              <div className="text-xl font-black text-white tracking-tight">$508K</div>
              <div className="text-[10px] text-emerald-400 font-bold mt-0.5">2.4 Current Ratio</div>
            </div>
            <div className="w-full h-5 mt-2">
              <svg className="w-full h-full stroke-emerald-500 fill-none" viewBox="0 0 100 20">
                <path d="M0,14 L30,12 L60,10 L100,8" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          {/* Card 7: Burn Rate */}
          <div className="p-5 rounded-[20px] bg-[#0F1322] border border-[#1E253E] hover:border-blue-500/30 transition-all duration-200 flex flex-col justify-between min-h-[140px] shadow-sm">
            <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider">Daily Burn</span>
            <div className="mt-1.5">
              <div className="text-xl font-black text-white tracking-tight">$5.0K</div>
              <div className="text-[10px] text-[#94A3B8] font-bold mt-0.5">Avg standard</div>
            </div>
            <div className="w-full h-5 mt-2">
              <svg className="w-full h-full stroke-[#64748B] fill-none" viewBox="0 0 100 20">
                <path d="M0,10 L25,10 L50,11 L75,10 L100,10" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          {/* Card 8: Forecast Confidence */}
          <div className="p-5 rounded-[20px] bg-[#0F1322] border border-[#1E253E] hover:border-blue-500/30 transition-all duration-200 flex flex-col justify-between min-h-[140px] shadow-sm">
            <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider">Confidence</span>
            <div className="mt-1.5">
              <div className="text-xl font-black text-blue-400 tracking-tight">94.8%</div>
              <div className="text-[10px] text-blue-400 font-bold mt-0.5">High Reliability</div>
            </div>
            <div className="w-full h-5 mt-2">
              <svg className="w-full h-full stroke-blue-500 fill-none" viewBox="0 0 100 20">
                <path d="M0,10 L20,8 L40,9 L60,6 L80,5 L100,4" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>

        {/* RESPONSIVE 12-COLUMN MAIN COMMAND GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel (8 Columns): Financial Forecasts & Graphs */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Forecast Chart Panel */}
            <div className="p-8 rounded-[20px] bg-[#0F1322] border border-[#1E253E] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">Cash Flow Forecast Pipeline</h3>
                  <p className="text-[11px] font-medium text-[#64748B] mt-0.5">Deterministic ledger forecasts with AI confidence intervals</p>
                </div>
                
                {/* Toggles for Period */}
                <div className="bg-[#070A13] border border-[#1E253E] rounded-xl p-1 flex items-center gap-1 self-start">
                  {(["7d", "30d", "90d", "180d", "365d"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setForecastPeriod(p)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                        forecastPeriod === p
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                          : "text-[#94A3B8] hover:text-white"
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
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.08}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E253E" />
                    <XAxis dataKey="name" stroke="#64748B" />
                    <YAxis stroke="#64748B" />
                    <Tooltip contentStyle={{ background: "#0F1322", borderColor: "#1E253E", borderRadius: "12px" }} />
                    
                    {/* Confidence Interval Band */}
                    <Area type="monotone" dataKey="maxConfidence" stroke="transparent" fill="url(#colorConfidence)" />
                    <Area type="monotone" dataKey="minConfidence" stroke="transparent" fill="transparent" />
                    
                    {/* Actual / Target Lines */}
                    <Area type="monotone" dataKey="cash" stroke="#3B82F6" fillOpacity={1} fill="url(#colorActual)" strokeWidth={3} />
                    <Area type="monotone" dataKey="projected" stroke="#6366F1" fillOpacity={0} strokeWidth={2} strokeDasharray="4 4" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Forecast Drivers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Largest Cash Sinks */}
              <div className="p-6 rounded-[20px] bg-[#0F1322] border border-[#1E253E]">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Largest Upcoming Outflows</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3.5 bg-black/20 rounded-xl border border-white/5">
                    <div>
                      <div className="text-xs font-bold text-white">Apex Steel Co.</div>
                      <div className="text-[10px] text-[#64748B] mt-0.5">Raw materials supplier • Net 30</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-white">$47,500</div>
                      <div className="text-[9px] text-amber-400 font-semibold mt-0.5">L4 Escalation</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-black/20 rounded-xl border border-white/5">
                    <div>
                      <div className="text-xs font-bold text-white">FabriCut Machinery</div>
                      <div className="text-[10px] text-[#64748B] mt-0.5">Laser equipment lease • Net 15</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-white">$22,000</div>
                      <div className="text-[9px] text-[#10B981] font-semibold mt-0.5">Discount Opportunity</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cash Drivers */}
              <div className="p-6 rounded-[20px] bg-[#0F1322] border border-[#1E253E]">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Key Inflow Targets</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3.5 bg-black/20 rounded-xl border border-white/5">
                    <div>
                      <div className="text-xs font-bold text-white">Delta Aerospace Ltd</div>
                      <div className="text-[10px] text-[#64748B] mt-0.5">CNC Machining Parts Batch #2</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-400">$64,000</div>
                      <div className="text-[9px] text-[#94A3B8] font-semibold mt-0.5">Due in 4 days</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-black/20 rounded-xl border border-white/5">
                    <div>
                      <div className="text-xs font-bold text-white">General Heavy Industry</div>
                      <div className="text-[10px] text-[#64748B] mt-0.5">Welded Assembly job contract</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-400">$38,200</div>
                      <div className="text-[9px] text-[#94A3B8] font-semibold mt-0.5">Due in 9 days</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel (4 Columns): AI command logs, actions, alerts */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* AI INSIGHTS PANEL (Gemma Recommendations) */}
            <div className="p-6 rounded-[20px] bg-[#0F1322] border border-blue-500/20 shadow-glow-blue space-y-4">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Executive Insights</h3>
              </div>
              
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold text-blue-400 uppercase">
                      Collections priority
                    </span>
                    <span className="text-[9px] text-[#94A3B8] font-semibold">Impact: +$47,500</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Apex Steel has exceeded standard grace limits. Gemma recommends sending an SMS escalation log reminder now.
                  </p>
                  <button className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-[10px] font-bold text-white flex items-center justify-center gap-1.5 transition-all">
                    Send L4 Alert <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-bold text-indigo-400 uppercase">
                      Discount opportunity
                    </span>
                    <span className="text-[9px] text-emerald-400 font-semibold">Savings: $440</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Pay FabriCut Machinery bill by tomorrow to capture the 2/10 early settlement discount.
                  </p>
                  <button className="w-full py-2 rounded-lg bg-[#1E253E] hover:bg-[#2A3356] text-[10px] font-bold text-white flex items-center justify-center gap-1.5 transition-all">
                    Queue Payment
                  </button>
                </div>
              </div>
            </div>

            {/* CRITICAL ALERTS PANEL */}
            <div className="p-6 rounded-[20px] bg-[#0F1322] border border-[#1E253E] space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Critical Alerts</h3>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-white">Overdue Collections: INV-2024-089</div>
                    <p className="text-[10px] text-[#94A3B8] mt-1 leading-relaxed">Apex Steel invoice of $47,500 has exceeded standard escalation limits.</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-white">Equipment Maintenance Spikes</div>
                    <p className="text-[10px] text-[#94A3B8] mt-1 leading-relaxed">CNC Machine #3 maintenance invoice will cause a short-term cash runway dip.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS CARD */}
            <div className="p-6 rounded-[20px] bg-[#0F1322] border border-[#1E253E] space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Action Center</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/documents" className="p-4 rounded-xl bg-black/20 hover:bg-[#1E253E]/50 border border-[#1E253E] flex flex-col items-center justify-center text-center transition-all group">
                  <UploadCloud className="w-5 h-5 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-bold text-[#F8FAFC]">Upload Docs</span>
                </Link>
                <Link href="/copilot" className="p-4 rounded-xl bg-black/20 hover:bg-[#1E253E]/50 border border-[#1E253E] flex flex-col items-center justify-center text-center transition-all group">
                  <Bot className="w-5 h-5 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-bold text-[#F8FAFC]">Ask Copilot</span>
                </Link>
                <Link href="/collections" className="p-4 rounded-xl bg-black/20 hover:bg-[#1E253E]/50 border border-[#1E253E] flex flex-col items-center justify-center text-center transition-all group">
                  <CreditCard className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-bold text-[#F8FAFC]">Collections</span>
                </Link>
                <Link href="/documents" className="p-4 rounded-xl bg-black/20 hover:bg-[#1E253E]/50 border border-[#1E253E] flex flex-col items-center justify-center text-center transition-all group">
                  <FileText className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-bold text-[#F8FAFC]">Ledger Scan</span>
                </Link>
              </div>
            </div>

            {/* RECENT ACTIVITY TIMELINE */}
            <div className="p-6 rounded-[20px] bg-[#0F1322] border border-[#1E253E] space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Command Log Timeline</h3>
              <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1E253E]">
                <div className="flex gap-4 relative">
                  <div className="w-6.5 h-6.5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 z-10">
                    <UploadCloud className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">CNC_Maintenance_Bill_July.xlsx uploaded</div>
                    <div className="text-[10px] text-[#64748B] mt-0.5">2 hours ago • Document Registry</div>
                  </div>
                </div>

                <div className="flex gap-4 relative">
                  <div className="w-6.5 h-6.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 z-10">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Forecast pipeline models recalculated</div>
                    <div className="text-[10px] text-[#64748B] mt-0.5">4 hours ago • Cash Flow</div>
                  </div>
                </div>

                <div className="flex gap-4 relative">
                  <div className="w-6.5 h-6.5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 z-10">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Escalation reminder sent to Apex Steel</div>
                    <div className="text-[10px] text-[#64748B] mt-0.5">1 day ago • collections module</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AppShell>
  );
}
