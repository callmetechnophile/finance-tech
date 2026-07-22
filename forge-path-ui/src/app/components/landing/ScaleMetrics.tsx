"use client";

import { motion } from "framer-motion";

export default function ScaleMetrics() {
  const metrics = [
    { value: "$1.2B+", label: "Financial Data Parsed", sub: "Ledger items & invoices processed" },
    { value: "48ms", label: "OCR Inference Latency", sub: "Gemma cognitive OCR pipeline speed" },
    { value: "99.98%", label: "System Uptime API", sub: "Redundant analytical database status" },
  ];

  return (
    <section className="relative min-h-screen bg-[#0b0e11] flex flex-col justify-center items-center overflow-hidden px-6 py-20 select-none border-t border-[#2b3139]">
      {/* Title */}
      <div className="relative z-10 text-center max-w-2xl mx-auto space-y-4 mb-16">
        <h2 className="text-[#fcd535] uppercase text-xs tracking-widest font-bold">
          Chapter 11: Enterprise Scale
        </h2>
        <h3 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight">
          SME Liquidity Map
        </h3>
        <p className="text-[#eaecef] text-sm md:text-base max-w-lg mx-auto">
          Powering automated operations and risk models across modern manufacturing hubs globally.
        </p>
      </div>

      {/* Map Graphic Mock */}
      <div className="relative w-full max-w-4xl h-[300px] flex items-center justify-center z-10">
        {/* Glow behind map */}
        <div className="absolute w-[300px] h-[300px] bg-[#fcd535]/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Abstract World Map Graphic */}
        <svg className="w-full h-full opacity-10 pointer-events-none" viewBox="0 0 1000 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Abstract dotted mesh representing geography */}
          <path d="M 100 150 Q 200 100, 300 200 T 500 150 T 700 250 T 900 150" stroke="#fff" strokeWidth="2" strokeDasharray="5 15" />
          <path d="M 150 250 Q 250 150, 400 300 T 600 200 T 800 300" stroke="#fff" strokeWidth="2" strokeDasharray="5 15" />
        </svg>

        {/* Pulse Beacons */}
        {[
          { top: "30%", left: "20%" },
          { top: "45%", left: "45%" },
          { top: "25%", left: "75%" },
          { top: "60%", left: "80%" },
        ].map((pos, idx) => (
          <div key={idx} className="absolute w-6 h-6 flex items-center justify-center" style={{ top: pos.top, left: pos.left }}>
            <motion.div
              animate={{
                scale: [1, 2.5, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: idx * 0.5,
              }}
              className="absolute w-full h-full rounded-full bg-[#fcd535]/30 border border-[#fcd535]"
            />
            <div className="w-1.5 h-1.5 rounded-full bg-[#fcd535] relative z-10 shadow-[0_0_6px_#fcd535]" />
          </div>
        ))}
      </div>

      {/* Metrics Row */}
      <div className="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 z-10">
        {metrics.map((m, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15, duration: 0.5 }}
            className="p-6 rounded-3xl bg-[#1e2329] border border-[#2b3139] hover:border-[#fcd535]/30 text-left space-y-2 cursor-pointer transition-colors shadow-lg hover:shadow-[#fcd535]/5"
          >
            <span className="block text-3xl font-extrabold text-[#fcd535] font-mono leading-none">
              {m.value}
            </span>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{m.label}</h4>
              <p className="text-[10px] text-[#707a8a] leading-relaxed font-semibold uppercase">{m.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
