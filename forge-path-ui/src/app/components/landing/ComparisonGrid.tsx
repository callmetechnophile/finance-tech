"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

export default function ComparisonGrid() {
  const comparisons = [
    {
      title: "Data Ingestion",
      traditional: "Manual Data Entry",
      traditionalDesc: "Accounting, bank accounts, emails, and invoices live in separate silos requiring manual exports.",
      forge: "OCR + AI",
      forgeDesc: "Single centralized console connecting ledger data, bank statement feeds, and customer communications.",
    },
    {
      title: "Forecasting Mode",
      traditional: "Reactive Reports",
      traditionalDesc: "Staff manually input bills, write reminder emails, and perform bank reconciliations line-by-line.",
      forge: "Predictive Forecasting",
      forgeDesc: "Autonomous OCR extraction and automatic reminder queue scheduling parsed by Gemma models.",
    },
    {
      title: "Workspace Integration",
      traditional: "Multiple Tools",
      traditionalDesc: "Forward-looking 90-day cash projections updated in real-time based on past payment behavior.",
      forge: "Unified Workspace",
      forgeDesc: "We bring invoices, ledger analysis, stress testing, and cash forecasting into a single workspace.",
    },
    {
      title: "Financial Actionability",
      traditional: "Historical Analytics",
      traditionalDesc: "Static outputs sent via email that require finance teams to analyze and decide next actions.",
      forge: "Real-Time Intelligence",
      forgeDesc: "Direct buttons to run stress scenarios, trigger reminders, or request payment extensions.",
    },
    {
      title: "Conversational CFO",
      traditional: "Static Dashboards",
      traditionalDesc: "Passive graphics with no contextual recommendations or conversational reasoning interfaces.",
      forge: "AI Copilot",
      forgeDesc: "Ask Gemma 4 questions to verify runway levels and automatically draft collections templates.",
    },
  ];

  return (
    <section className="relative min-h-screen bg-[#0b0e11] flex flex-col justify-center items-center overflow-hidden px-6 py-20 select-none border-t border-[#2b3139]">
      {/* Title */}
      <div className="relative z-10 text-center max-w-2xl mx-auto space-y-4 mb-20">
        <h2 className="text-[#fcd535] uppercase text-xs tracking-widest font-bold">
          Chapter 9: The Differentiation
        </h2>
        <h3 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight">
          How FORGE-PATH is different
        </h3>
        <p className="text-[#eaecef] text-sm md:text-base max-w-lg mx-auto">
          Contrasting traditional accounting workflows with our unified, AI-native, predictive financial operating system.
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
            className="grid grid-cols-1 lg:grid-cols-5 border border-[#2b3139] rounded-3xl bg-[#1e2329] overflow-hidden"
          >
            {/* Aspect Column */}
            <div className="lg:col-span-1 p-6 bg-black/40 border-b lg:border-b-0 lg:border-r border-[#2b3139] flex items-center justify-start text-left">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{item.title}</h4>
            </div>

            {/* Traditional ERP Column */}
            <div className="lg:col-span-2 p-6 border-b lg:border-b-0 lg:border-r border-[#2b3139] text-left space-y-2">
              <div className="flex items-center gap-2 text-[#f6465d] font-bold text-xs uppercase tracking-wide">
                <X className="w-4 h-4" /> {item.traditional}
              </div>
              <p className="text-[10px] text-[#707a8a] leading-relaxed font-semibold">{item.traditionalDesc}</p>
            </div>

            {/* FORGE-PATH Column */}
            <div className="lg:col-span-2 p-6 text-left space-y-2 bg-[#fcd535]/[0.01]">
              <div className="flex items-center gap-2 text-[#fcd535] font-bold text-xs uppercase tracking-wide">
                <Check className="w-4 h-4" /> {item.forge}
              </div>
              <p className="text-[10px] text-[#eaecef]/80 leading-relaxed font-medium">{item.forgeDesc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
