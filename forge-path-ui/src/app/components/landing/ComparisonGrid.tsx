"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

export default function ComparisonGrid() {
  const comparisons = [
    {
      title: "Data Architecture",
      traditional: "Disconnected Systems",
      traditionalDesc: "Accounting, bank accounts, emails, and invoices live in separate silos requiring manual exports.",
      forge: "Unified Workspace",
      forgeDesc: "Single centralized console connecting ledger data, bank statement feeds, and customer communications.",
    },
    {
      title: "Workflow Automation",
      traditional: "Manual Ingestion",
      traditionalDesc: "Staff manually input bills, write reminder emails, and perform bank reconciliations line-by-line.",
      forge: "AI-Native Operations",
      forgeDesc: "Autonomous OCR extraction and automatic reminder queue scheduling parsed by Gemma models.",
    },
    {
      title: "Forecasting Mode",
      traditional: "Historical Summaries",
      traditionalDesc: "Backward-looking reports generated at end-of-month, offering no forward cash runway warnings.",
      forge: "Predictive Intelligence",
      forgeDesc: "Forward-looking 90-day cash projections updated in real-time based on past payment behavior.",
    },
    {
      title: "Financial Actionability",
      traditional: "Static PDF Reports",
      traditionalDesc: "Static outputs sent via email that require finance teams to analyze and decide next actions.",
      forge: "Operational Controls",
      forgeDesc: "Direct buttons to run stress scenarios, trigger reminders, or request payment extensions.",
    },
  ];

  return (
    <section className="relative min-h-screen bg-[#08080a] flex flex-col justify-center items-center overflow-hidden px-6 py-20 select-none border-t border-[#1a1a1a]">
      {/* Title */}
      <div className="relative z-10 text-center max-w-2xl mx-auto space-y-4 mb-20">
        <h2 className="text-[#faff69] uppercase text-xs tracking-widest font-bold">
          Chapter 9: The Differentiation
        </h2>
        <h3 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight">
          How FORGE-PATH is different
        </h3>
        <p className="text-[#888888] text-sm md:text-base font-medium max-w-lg mx-auto">
          Contrasting traditional ERP workflows with our unified, AI-native, predictive financial operating system.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="relative w-full max-w-5xl space-y-6 z-10">
        {comparisons.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-5 border border-[#2a2a2a] rounded-3xl bg-[#0f0f11] overflow-hidden"
          >
            {/* Aspect Column */}
            <div className="lg:col-span-1 p-6 bg-black/40 border-b lg:border-b-0 lg:border-r border-[#2a2a2a] flex items-center justify-start text-left">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{item.title}</h4>
            </div>

            {/* Traditional ERP Column */}
            <div className="lg:col-span-2 p-6 border-b lg:border-b-0 lg:border-r border-[#2a2a2a] text-left space-y-2">
              <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wide">
                <X className="w-4 h-4" /> {item.traditional}
              </div>
              <p className="text-[10px] text-[#666] leading-relaxed font-semibold">{item.traditionalDesc}</p>
            </div>

            {/* FORGE-PATH Column */}
            <div className="lg:col-span-2 p-6 text-left space-y-2 bg-[#faff69]/[0.01]">
              <div className="flex items-center gap-2 text-[#faff69] font-bold text-xs uppercase tracking-wide">
                <Check className="w-4 h-4" /> {item.forge}
              </div>
              <p className="text-[10px] text-white/80 leading-relaxed font-medium">{item.forgeDesc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
