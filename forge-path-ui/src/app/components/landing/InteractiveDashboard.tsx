"use client";

import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "./useInView";
import { ArrowUpRight, TrendingUp } from "lucide-react";

export default function InteractiveDashboard() {
  const [cash, setCash] = useState(0);
  const [receivables, setReceivables] = useState(0);
  const [score, setScore] = useState(0);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  useEffect(() => {
    if (!inView) return;

    // Count up animations
    let start = 0;
    const duration = 2000;
    const intervalTime = 25;
    const steps = duration / intervalTime;

    const cashStep = 342000 / steps;
    const recStep = 284500 / steps;
    const scoreStep = 84 / steps;

    const timer = setInterval(() => {
      start++;
      setCash((prev) => Math.min(342000, Math.floor(prev + cashStep)));
      setReceivables((prev) => Math.min(284500, Math.floor(prev + recStep)));
      setScore((prev) => Math.min(84, Math.floor(prev + scoreStep)));

      if (start >= steps) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [inView]);

  return (
    <section ref={ref} className="relative min-h-screen bg-[#08080a] flex flex-col justify-center items-center overflow-hidden px-6 py-20 select-none border-t border-[#1a1a1a]">
      {/* Title */}
      <div className="relative z-10 text-center max-w-2xl mx-auto space-y-4 mb-16">
        <h2 className="text-[#faff69] uppercase text-xs tracking-widest font-bold">
          Chapter 6: Executive Control
        </h2>
        <h3 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight">
          The Executive Dashboard
        </h3>
        <p className="text-[#888888] text-sm md:text-base font-medium max-w-lg mx-auto">
          Monitor liquid cash buffer metrics, receivables trends, and stress scenario scores at a single glance.
        </p>
      </div>

      {/* Mini Mock Dashboard */}
      <div className="relative w-full max-w-4xl p-6 rounded-3xl bg-[#0f0f11] border border-[#2a2a2a] shadow-2xl z-10 space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="p-5 rounded-2xl bg-black/40 border border-[#222] flex flex-col justify-between text-left">
            <span className="text-[10px] font-bold text-[#666] uppercase tracking-wider">Current Cash Buffer</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-extrabold text-white font-tabular">
                ${cash.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +4.2%
              </span>
            </div>
            <span className="text-[9px] text-[#555] font-semibold mt-1 uppercase">68 Days Runway</span>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-2xl bg-black/40 border border-[#222] flex flex-col justify-between text-left">
            <span className="text-[10px] font-bold text-[#666] uppercase tracking-wider">Outstanding Receivables</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-extrabold text-white font-tabular">
                ${receivables.toLocaleString()}
              </span>
              <span className="text-[10px] text-red-400 font-bold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +12%
              </span>
            </div>
            <span className="text-[9px] text-[#555] font-semibold mt-1 uppercase">12 Overdue Invoices</span>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-2xl bg-black/40 border border-[#222] flex flex-col justify-between text-left">
            <span className="text-[10px] font-bold text-[#666] uppercase tracking-wider">Liquidity Score</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-extrabold text-emerald-400 font-tabular">
                {score}/100
              </span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Optimal</span>
            </div>
            <span className="text-[9px] text-[#555] font-semibold mt-1 uppercase">Burn Rate: $5k/day</span>
          </div>
        </div>

        {/* Chart Card */}
        <div className="p-6 rounded-2xl bg-black/40 border border-[#222] text-left">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Cash Runway Projection</h4>
              <p className="text-[9px] text-[#666] mt-0.5 uppercase font-semibold">Actuals vs AI forecast</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#faff69] font-bold cursor-pointer">
              <TrendingUp className="w-4 h-4" /> Full Forecast
            </div>
          </div>

          {/* Animated Area Chart */}
          <div className="relative h-48 w-full overflow-hidden flex items-end">
            <svg className="w-full h-full" viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="800" y2="50" stroke="#1c1c1f" strokeDasharray="3 3" />
              <line x1="0" y1="100" x2="800" y2="100" stroke="#1c1c1f" strokeDasharray="3 3" />
              <line x1="0" y1="150" x2="800" y2="150" stroke="#1c1c1f" strokeDasharray="3 3" />

              {/* Area path */}
              {inView && (
                <motion.path
                  d="M0 160 Q 200 130, 400 90 T 800 50 L 800 200 L 0 200 Z"
                  fill="url(#gradientCash)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.15 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
              )}

              {/* Stroke path */}
              {inView && (
                <motion.path
                  d="M0 160 Q 200 130, 400 90 T 800 50"
                  stroke="#faff69"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              )}

              <defs>
                <linearGradient id="gradientCash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#faff69" />
                  <stop offset="100%" stopColor="#faff69" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
