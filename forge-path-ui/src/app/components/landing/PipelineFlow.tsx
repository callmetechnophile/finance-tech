"use client";

import { motion } from "framer-motion";
import { FileText, Database, BarChart3, Bot, Layers } from "lucide-react";

export default function PipelineFlow() {
  const nodes = [
    { id: "ocr", title: "Document OCR", icon: FileText, desc: "Ingest & parse" },
    { id: "neon", title: "Neon Postgres", icon: Database, desc: "Transactional ledger" },
    { id: "clickhouse", title: "ClickHouse OLAP", icon: Layers, desc: "Analytical warehouse" },
    { id: "dashboard", title: "Executive UI", icon: BarChart3, desc: "Visual metrics" },
    { id: "copilot", title: "AI Copilot", icon: Bot, desc: "Operational agent" },
  ];

  return (
    <section className="relative min-h-screen bg-[#08080a] flex flex-col justify-center items-center overflow-hidden px-6 py-20 select-none border-t border-[#1a1a1a]">
      {/* Title */}
      <div className="relative z-10 text-center max-w-2xl mx-auto space-y-4 mb-20">
        <h2 className="text-[#faff69] uppercase text-xs tracking-widest font-bold">
          Chapter 5: Architecture Pipeline
        </h2>
        <h3 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight">
          Synchronized Data Pipelines
        </h3>
        <p className="text-[#888888] text-sm md:text-base font-medium max-w-lg mx-auto">
          How document inputs transform instantly into real-time analytical metrics and autonomous AI reasoning.
        </p>
      </div>

      {/* Pipeline Container */}
      <div className="relative w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-12 z-10">
        {/* Connection line background (Desktop) */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#2a2a2a] -translate-y-1/2 hidden md:block" />

        {nodes.map((node, idx) => {
          const Icon = node.icon;
          return (
            <div key={node.id} className="relative flex flex-col items-center z-10 w-40">
              {/* Connector dot flow */}
              {idx < nodes.length - 1 && (
                <motion.div
                  animate={{
                    left: ["0%", "100%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    delay: idx * 0.6,
                  }}
                  className="absolute top-10 w-2 h-2 rounded-full bg-[#faff69] shadow-[0_0_8px_#faff69] hidden md:block"
                  style={{ left: "50%", transform: "translateX(-50%)" }}
                />
              )}

              {/* Node Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
                className="w-20 h-20 rounded-2xl bg-[#0f0f11] border border-[#2a2a2a] hover:border-[#faff69]/40 flex items-center justify-center text-white shadow-xl hover:shadow-[#faff69]/5 transition-all group cursor-pointer"
              >
                <Icon className="w-8 h-8 text-[#666] group-hover:text-[#faff69] transition-colors" />
              </motion.div>

              {/* Node Meta */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 + 0.3 }}
                className="text-center mt-4 space-y-1"
              >
                <h4 className="text-xs font-bold text-white tracking-wide">{node.title}</h4>
                <p className="text-[10px] text-[#666] leading-tight font-semibold uppercase">{node.desc}</p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
