"use client";

import { motion } from "framer-motion";
import { Globe, Users, ShieldAlert, Database } from "lucide-react";

export default function ScaleMetrics() {
  const metrics = [
    { label: "Invoices Processed", val: "120K+", icon: Database },
    { label: "Forecasts Generated", val: "18K+", icon: Users },
    { label: "Platform Availability", val: "99.98%", icon: ShieldAlert },
    { label: "Financial Data Analysed", val: "8TB+", icon: Globe },
  ];

  return (
    <section className="relative min-h-screen bg-[#08080a] flex flex-col justify-center items-center overflow-hidden px-6 py-20 select-none border-t border-[#1a1a1a]">
      {/* Title */}
      <div className="relative z-10 text-center max-w-2xl mx-auto space-y-4 mb-16">
        <h2 className="text-[#faff69] uppercase text-xs tracking-widest font-bold">
          Chapter 11: Global Performance
        </h2>
        <h3 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight">
          Scale and Reliability
        </h3>
        <p className="text-[#888888] text-sm md:text-base font-medium max-w-lg mx-auto">
          Powering manufacturing SME finance networks globally, ensuring secure low-latency data replication.
        </p>
      </div>

      {/* Styled SVG World Map Background */}
      <div className="relative w-full max-w-4xl h-80 flex items-center justify-center mb-12">
        <svg className="w-full h-full opacity-10 absolute inset-0 pointer-events-none" viewBox="0 0 1000 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Simple stylized dots for continents */}
          <circle cx="200" cy="150" r="10" fill="#fff" />
          <circle cx="250" cy="180" r="15" fill="#fff" />
          <circle cx="300" cy="250" r="8" fill="#fff" />
          <circle cx="500" cy="120" r="20" fill="#fff" />
          <circle cx="600" cy="180" r="12" fill="#fff" />
          <circle cx="750" cy="250" r="15" fill="#fff" />
        </svg>

        {/* Pulse indicators on nodes */}
        <div className="absolute top-[35%] left-[25%]">
          <span className="flex h-3.5 w-3.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#faff69] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#faff69]"></span>
          </span>
        </div>
        <div className="absolute top-[45%] left-[55%]">
          <span className="flex h-3.5 w-3.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#faff69] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#faff69]"></span>
          </span>
        </div>
        <div className="absolute top-[60%] left-[75%]">
          <span className="flex h-3.5 w-3.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#faff69] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#faff69]"></span>
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="relative w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 z-10">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="p-6 rounded-2xl bg-[#0f0f11] border border-[#2a2a2a] text-center space-y-2 hover:border-[#faff69]/30 transition-all cursor-pointer"
            >
              <div className="mx-auto w-10 h-10 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center text-[#faff69]">
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="text-3xl font-extrabold text-white font-tabular tracking-tight">
                {metric.val}
              </h4>
              <p className="text-[10px] text-[#666] leading-tight font-semibold uppercase tracking-wider">
                {metric.label}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
