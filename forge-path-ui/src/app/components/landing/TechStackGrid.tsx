"use client";

import { motion } from "framer-motion";
import { Cpu, Database, Layout, Lock, Terminal, Shield, BarChart3 } from "lucide-react";

export default function TechStackGrid() {
  const stackItems = [
    { name: "Browser App", category: "Frontend", icon: Layout, desc: "React-based UI with interactive metrics dashboard" },
    { name: "Next.js 16", category: "Framework", icon: Terminal, desc: "Provides App routing, SSR page caching, and server actions" },
    { name: "Clerk Auth", category: "Security", icon: Lock, desc: "Handles tenant credentials, multi-orgs, and sessions" },
    { name: "FastAPI REST", category: "Backend API", icon: Shield, desc: "Robust Python service executing accounting business logic" },
    { name: "Neon Postgres", category: "Database", icon: Database, desc: "Serverless relational DB storing transactional invoice data" },
    { name: "ClickHouse", category: "Database", icon: BarChart3, desc: "OLAP database engine for instant metrics aggregations" },
    { name: "Gemma 4", category: "AI Models", icon: Cpu, desc: "Google AI model analyzing payment risks and trends" },
    { name: "Google AI Studio", category: "AI Integration", icon: Cpu, desc: "Enterprise serverless AI inference infrastructure endpoint" },
  ];

  return (
    <section className="relative min-h-screen bg-[#08080a] flex flex-col justify-center items-center overflow-hidden px-6 py-20 select-none border-t border-[#1a1a1a]">
      {/* Title */}
      <div className="relative z-10 text-center max-w-2xl mx-auto space-y-4 mb-20">
        <h2 className="text-[#faff69] uppercase text-xs tracking-widest font-bold">
          Chapter 10: Technical Stack
        </h2>
        <h3 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight">
          Enterprise Tech Stack
        </h3>
        <p className="text-[#888888] text-sm md:text-base font-medium max-w-lg mx-auto">
          Hover over each architectural tier to inspect its operational role in the platform.
        </p>
      </div>

      {/* Tech Stack Cards Grid */}
      <div className="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 z-10">
        {stackItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              className="p-5 rounded-2xl bg-[#0f0f11] border border-[#2a2a2a] hover:border-[#faff69]/40 hover:bg-[#151518] transition-all flex flex-col gap-3 group relative cursor-pointer text-left"
            >
              {/* Node category badge */}
              <span className="text-[9px] font-bold text-[#666] uppercase tracking-wider group-hover:text-[#faff69] transition-colors">
                {item.category}
              </span>

              {/* Title & Icon */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center text-[#666] group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white tracking-wide">{item.name}</h4>
              </div>

              {/* Description */}
              <p className="text-[10px] text-[#666] group-hover:text-[#888] leading-relaxed transition-colors mt-1">
                {item.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
