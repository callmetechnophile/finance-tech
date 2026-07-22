"use client";

import { motion } from "framer-motion";
import { Zap, CheckCircle2, ShieldCheck, Cpu, Database } from "lucide-react";

export default function SolutionSection() {
  const mergedItems = [
    { title: "AI-Powered Collections", desc: "Automated follow-ups & risk models", icon: Cpu },
    { title: "Real-time Cash Forecasting", desc: "Predictive cash flow projections", icon: Database },
    { title: "Treasury Operations Center", desc: "Unified payment pipeline", icon: ShieldCheck },
    { title: "Document Intelligence", desc: "Auto-ingest receipts & invoices", icon: CheckCircle2 },
  ];

  return (
    <section className="relative min-h-screen bg-[#08080a] flex flex-col justify-center items-center overflow-hidden px-6 py-20 select-none border-t border-[#1a1a1a]">
      {/* Title */}
      <div className="relative z-10 text-center max-w-2xl mx-auto space-y-4 mb-16">
        <h2 className="text-[#faff69] uppercase text-xs tracking-widest font-bold">
          Chapter 2: The Unified Path
        </h2>
        <h3 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight">
          One Platform. <br />Every Financial Workflow.
        </h3>
        <p className="text-[#888888] text-sm md:text-base font-medium max-w-lg mx-auto">
          We bring invoices, ledger analysis, stress testing, and cash forecasting into a single unified workspace.
        </p>
      </div>

      {/* Merged Platform Visualization */}
      <div className="relative w-full max-w-4xl flex flex-col lg:flex-row items-center gap-8 justify-center">
        {/* Glowing Ambient Background Spot */}
        <div className="absolute w-[400px] h-[400px] rounded-full bg-[#faff69]/5 blur-[120px] pointer-events-none" />

        {/* Central Core Console Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-lg p-8 rounded-3xl bg-[#0f0f11] border border-[#2a2a2a] shadow-[0_0_50px_rgba(250,255,105,0.05)] z-10 overflow-hidden"
        >
          {/* Logo Watermark */}
          <div className="absolute right-[-20px] bottom-[-20px] opacity-5 pointer-events-none">
            <Zap className="w-64 h-64 text-[#faff69]" />
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#faff69] to-[#b8bd1e] flex items-center justify-center border border-[#3a3a3c]">
              <Zap className="w-6 h-6 text-[#0a0a0a]" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-white tracking-wide">FORGE-PATH PLATFORM</h4>
              <p className="text-[10px] text-[#666666] font-semibold uppercase tracking-widest">
                Operational Financial OS
              </p>
            </div>
          </div>

          {/* Grid of Unified Modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mergedItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15, duration: 0.5 }}
                  className="p-4 rounded-2xl bg-black/40 border border-[#222] hover:border-[#faff69]/40 hover:bg-[#151518] transition-all flex flex-col gap-2 group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#faff69]/10 border border-[#faff69]/20 flex items-center justify-center text-[#faff69] group-hover:bg-[#faff69] group-hover:text-black transition-all">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <h5 className="text-xs font-bold text-white group-hover:text-[#faff69] transition-colors">
                      {item.title}
                    </h5>
                    <p className="text-[10px] text-[#666666] mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
