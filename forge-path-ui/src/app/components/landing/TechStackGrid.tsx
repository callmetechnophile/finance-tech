"use client";

import { motion } from "framer-motion";
import { Cpu, ShieldCheck, Zap, Database, BarChart3, Layers, Blocks } from "lucide-react";

export default function TechStackGrid() {
  const stack = [
    {
      name: "Next.js",
      role: "Frontend Framework",
      desc: "Fast, static rendering & routing optimized for modern enterprise applications.",
      icon: Zap,
    },
    {
      name: "Clerk",
      role: "Secure Authentication",
      desc: "Instant customer identity verification, session persistence, and secure portal access.",
      icon: ShieldCheck,
    },
    {
      name: "Neon PostgreSQL",
      role: "Ledger Database",
      desc: "Serverless relational data hosting for high-fidelity transactional ledger queries.",
      icon: Database,
    },
    {
      name: "ClickHouse",
      role: "OLAP Database",
      desc: "High-speed analytics warehouse capable of query resolutions across billions of rows.",
      icon: Layers,
    },
    {
      name: "Google AI Studio",
      role: "Model Pipeline",
      desc: "Inference gateway routing cognitive financial queries to low-latency LLM networks.",
      icon: Cpu,
    },
    {
      name: "Gemma 4",
      role: "Reasoning Core",
      desc: "State-of-the-art open models parsing unstructured invoices and analyzing payment trends.",
      icon: Blocks,
    },
  ];

  return (
    <section className="relative min-h-screen bg-[#0b0e11] flex flex-col justify-center items-center overflow-hidden px-6 py-20 select-none border-t border-[#2b3139]">
      {/* Title */}
      <div className="relative z-10 text-center max-w-2xl mx-auto space-y-4 mb-20">
        <h2 className="text-[#fcd535] uppercase text-xs tracking-widest font-bold">
          Chapter 10: The Architecture Stack
        </h2>
        <h3 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight">
          Enterprise Technology Stack
        </h3>
        <p className="text-[#eaecef] text-sm md:text-base max-w-lg mx-auto">
          Built on a highly optimized, modern tech foundation to guarantee low-latency data streams and bank-grade security.
        </p>
      </div>

      {/* Grid of stack components */}
      <div className="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10">
        {stack.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="p-6 rounded-3xl bg-[#1e2329] border border-[#2b3139] hover:border-[#fcd535]/30 text-left flex flex-col gap-4 group cursor-pointer shadow-lg hover:shadow-[#fcd535]/5 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-black/40 border border-[#2b3139] flex items-center justify-center text-[#707a8a] group-hover:text-[#fcd535] transition-colors">
                <Icon className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">{item.name}</h4>
                <p className="text-[9px] text-[#fcd535] uppercase font-bold tracking-widest leading-none">
                  {item.role}
                </p>
              </div>

              <p className="text-[10px] text-[#eaecef]/70 leading-relaxed font-semibold">
                {item.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
