"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Sparkles, Bot, Cpu, ArrowUpRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-36 border-b border-[#2b3139] overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e2329_1px,transparent_1px),linear-gradient(to_bottom,#1e2329_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />
      
      {/* Moving ambient point glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#fcd535]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        <div className="lg:col-span-6 space-y-6 text-left">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-[#fcd535] uppercase tracking-[0.2em] bg-[#fcd535]/10 border border-[#fcd535]/25 rounded-md px-3 py-1.5">
            <Sparkles className="w-3.5 h-3.5" /> FORGE-PATH OS
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Enterprise Financial Operating System for Modern SMEs
          </h1>
          <p className="text-sm md:text-base text-[#707a8a] max-w-xl leading-relaxed">
            Transform financial documents into real-time business intelligence using AI-powered OCR, forecasting, and executive analytics. Build an automated bridge between document ingestion and balance sheet solvency.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/login"
              className="h-12 px-6 bg-[#fcd535] hover:bg-[#e2be28] text-[#181a20] font-extrabold text-xs uppercase tracking-wider rounded-md flex items-center justify-center gap-2 shadow-lg shadow-[#fcd535]/15 transition-all"
            >
              Launch Workspace <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => {
                document.getElementById("interactive-demo")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="h-12 px-6 border border-[#2b3139] hover:border-[#fcd535] text-white hover:text-[#fcd535] font-extrabold text-xs uppercase tracking-wider rounded-md flex items-center justify-center gap-2 transition-all bg-[#181a20]/40 backdrop-blur-sm"
            >
              <Play className="w-4 h-4 fill-current" /> Watch Interactive Demo
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 flex justify-center relative">
          {/* Cinematic Mockup Frame */}
          <div className="w-full max-w-xl p-5 rounded-2xl bg-[#1e2329]/80 border border-[#2b3139] shadow-2xl relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#fcd535]/50 via-[#0ecb81]/50 to-[#38bdf8]/50" />
            
            {/* Fake dashboard headers */}
            <div className="flex justify-between items-center border-b border-[#2b3139] pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#f6465d]" />
                <div className="w-3 h-3 rounded-full bg-[#fcd535]" />
                <div className="w-3 h-3 rounded-full bg-[#0ecb81]" />
                <span className="text-[10px] text-[#707a8a] font-mono ml-2">forgepath_mockup_v1.sh</span>
              </div>
              <span className="text-[9px] text-[#0ecb81] font-mono bg-[#0ecb81]/10 px-2 py-0.5 rounded border border-[#0ecb81]/20">AI Active</span>
            </div>

            {/* Fake Content Widgets */}
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-[#181a20] rounded-xl border border-[#2b3139] space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-[#707a8a] block">Current Cash</span>
                  <span className="text-sm font-bold font-mono">$342,000</span>
                  <span className="text-[8px] text-[#0ecb81] flex items-center gap-0.5"><ArrowUpRight className="w-2.5 h-2.5" /> +4.2%</span>
                </div>
                <div className="p-3 bg-[#181a20] rounded-xl border border-[#2b3139] space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-[#707a8a] block">Unpaid Invoices</span>
                  <span className="text-sm font-bold font-mono">$284,500</span>
                  <span className="text-[8px] text-[#fcd535]">12 invoices</span>
                </div>
                <div className="p-3 bg-[#181a20] rounded-xl border border-[#2b3139] space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-[#707a8a] block">Cash Runway</span>
                  <span className="text-sm font-bold font-mono">68 Days</span>
                  <span className="text-[8px] text-[#0ecb81]">Optimal</span>
                </div>
              </div>

              {/* Animated Chart Mockup */}
              <div className="h-28 bg-[#181a20] rounded-xl border border-[#2b3139] p-3 flex flex-col justify-between relative overflow-hidden">
                <span className="text-[9px] uppercase tracking-wider text-[#707a8a]">Runway & Liquidity Forecast</span>
                <div className="flex-1 flex items-end gap-1.5 pt-4">
                  {[35, 45, 40, 55, 50, 72, 65, 85, 90, 80, 95, 110].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.1 * i, duration: 0.5 }}
                      className="flex-1 rounded-t bg-gradient-to-t from-[#fcd535] to-[#fcd535]/30 min-h-[4px]"
                    />
                  ))}
                </div>
              </div>

              {/* AI response mockup */}
              <div className="p-3 bg-[#181a20] rounded-xl border border-[#2b3139] flex gap-3 items-start">
                <div className="w-6 h-6 rounded-lg bg-[#fcd535]/10 flex items-center justify-center text-[#fcd535] flex-shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-white block">Gemma AI Auditing Agent</span>
                  <p className="text-[9px] text-[#eaecef] leading-relaxed">
                    "I've flagged **Apex Steel** ($47,500.00). Invoice payment history exhibits an average 12-day delay drift. Suggest triggering automatic collections automation reminder."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Glowing orb behind mockup */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#fcd535]/10 to-transparent blur-[80px]" />
        </div>

      </div>
    </section>
  );
}
