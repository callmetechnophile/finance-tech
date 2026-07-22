"use client";

import { motion } from "framer-motion";
import { Zap, Play, ArrowRight, Bot, TrendingUp, DollarSign } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-[#0b0e11] flex flex-col justify-center items-center overflow-hidden px-6 lg:px-12 pt-32 pb-20 select-none">
      {/* Engineering Grid Background */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Moving Ambient Gradients */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vh] rounded-full bg-[#fcd535]/5 blur-[160px] pointer-events-none"
      />

      {/* Hero Content Grid */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Headlines and CTAs */}
        <div className="lg:col-span-6 space-y-6 text-left">
          {/* Logo Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1e2329] border border-[#2b3139]"
          >
            <div className="w-5 h-5 rounded bg-[#fcd535] flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-[#181a20]" />
            </div>
            <span className="text-[10px] font-extrabold text-[#fcd535] uppercase tracking-wider">
              FORGE-PATH OS
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-white text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none"
          >
            Enterprise Financial <br />
            Operating System <br />
            <span className="text-[#fcd535]">for Modern SMEs</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-[#eaecef] text-sm md:text-base leading-relaxed max-w-lg"
          >
            Automate document intelligence, cash-flow forecasting, collections, treasury and executive reporting using AI.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4"
          >
            <a
              href="/login"
              className="h-10 px-6 rounded-md bg-[#fcd535] hover:bg-[#f0b90b] text-[#181a20] font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#fcd535]/5"
            >
              Launch Workspace <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={() => {
                const el = document.getElementById("guided-demo-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="h-10 px-6 rounded-md border border-[#3a3a3a] hover:bg-[#242424] text-[#eaecef] font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-[#eaecef]" /> Watch Interactive Demo
            </button>
          </motion.div>
        </div>

        {/* Right Side: Animated Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="lg:col-span-6 w-full p-6 rounded-3xl bg-[#1e2329] border border-[#2b3139] shadow-2xl space-y-4 text-left relative overflow-hidden"
        >
          {/* Dashboard Header */}
          <div className="flex justify-between items-center border-b border-[#2b3139] pb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[9px] text-[#707a8a] font-bold uppercase tracking-wider">
              FORGE-PATH Dashboard Preview
            </span>
          </div>

          {/* Mini Widgets */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-[#0b0e11] border border-[#2b3139] space-y-1">
              <span className="text-[9px] text-[#707a8a] uppercase font-bold tracking-wider">Current Cash</span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-extrabold text-white">$342,000</span>
                <span className="text-[9px] text-emerald-400 font-bold">+4.2%</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0b0e11] border border-[#2b3139] space-y-1">
              <span className="text-[9px] text-[#707a8a] uppercase font-bold tracking-wider">Liquidity Score</span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-extrabold text-emerald-400">84/100</span>
                <span className="text-[9px] text-emerald-400 font-bold uppercase">Optimal</span>
              </div>
            </div>
          </div>

          {/* Mini Chart */}
          <div className="p-4 rounded-xl bg-[#0b0e11] border border-[#2b3139] space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[9px] text-[#707a8a] uppercase font-bold tracking-wider">Cash Runway Forecast</span>
              <span className="text-[9px] text-[#fcd535] font-bold">90-Day View</span>
            </div>
            <div className="h-20 flex items-end gap-1.5 w-full">
              {[40, 50, 45, 60, 55, 75, 70, 90, 85, 95].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-[#fcd535]/30 to-[#fcd535] rounded-t-sm"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          {/* Mini Copilot bubble */}
          <div className="p-3.5 rounded-2xl bg-blue-950/10 border border-blue-500/20 flex gap-3 items-start">
            <div className="w-6 h-6 rounded bg-[#fcd535]/10 border border-[#fcd535]/20 flex items-center justify-center text-[#fcd535]">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="space-y-1">
              <h5 className="text-[9px] font-bold text-white uppercase tracking-wider">Gemma Copilot</h5>
              <p className="text-[10px] text-[#eaecef] leading-relaxed font-semibold">
                "Cash runway projected at **68 days**. Outstanding invoices total **$284,500** across 12 clients."
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 cursor-pointer">
        <span className="text-[9px] text-[#707a8a] tracking-widest font-semibold uppercase">
          Scroll to explore
        </span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-[#2b3139] to-transparent" />
      </div>
    </section>
  );
}
