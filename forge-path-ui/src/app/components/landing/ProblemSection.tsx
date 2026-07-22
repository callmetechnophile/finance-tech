"use client";

import { motion } from "framer-motion";
import { FileText, Table, Mail, DollarSign, RefreshCw, FileWarning } from "lucide-react";

export default function ProblemSection() {
  // Animation deltas defined as stable constants — never call Math.random() during render
  // as that produces different values on server vs client and causes hydration mismatches.
  const floatingCards = [
    {
      id: 1,
      title: "Invoice #2842",
      detail: "$47,500 Overdue (45d)",
      icon: FileWarning,
      color: "border-red-500/30 text-red-400 bg-red-950/10",
      x: "-25%",
      y: "-15%",
      dx: 8,
      dy: -6,
      rotate: 1.2,
      duration: 7,
      hoverRotate: 2,
    },
    {
      id: 2,
      title: "Cash_Runway_v3.xlsx",
      detail: "Manual formula error in Cell G42",
      icon: Table,
      color: "border-yellow-500/30 text-yellow-400 bg-yellow-950/10",
      x: "20%",
      y: "-30%",
      dx: -5,
      dy: 9,
      rotate: -1.8,
      duration: 8.5,
      hoverRotate: -2.5,
    },
    {
      id: 3,
      title: "Email thread: Re: Delayed...",
      detail: "'Checking with treasury, net-60?'",
      icon: Mail,
      color: "border-blue-500/30 text-blue-400 bg-blue-950/10",
      x: "-30%",
      y: "25%",
      dx: 10,
      dy: -8,
      rotate: 2.0,
      duration: 6.5,
      hoverRotate: 3,
    },
    {
      id: 4,
      title: "Bank Statement SVB",
      detail: "Unreconciled wire: $28,000",
      icon: DollarSign,
      color: "border-purple-500/30 text-purple-400 bg-purple-950/10",
      x: "25%",
      y: "15%",
      dx: -7,
      dy: 5,
      rotate: -1.5,
      duration: 9,
      hoverRotate: -2,
    },
  ];

  return (
    <section className="relative min-h-screen bg-[#0b0e11] flex flex-col justify-center items-center overflow-hidden px-6 py-20 select-none border-t border-[#2b3139]">
      {/* Title */}
      <div className="relative z-10 text-center max-w-2xl mx-auto space-y-4 mb-16">
        <h2 className="text-[#707a8a] uppercase text-xs tracking-widest font-bold">
          Chapter 1: The Disconnected Reality
        </h2>
        <h3 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight">
          Financial Operations Are Fragmented
        </h3>
        <p className="text-[#eaecef] text-sm md:text-base max-w-lg mx-auto">
          Invoices, Excel spreadsheets, emails, and bank statements floating separately, bound by fragile manual workflows.
        </p>
      </div>

      {/* Floating Canvas */}
      <div className="relative w-full max-w-4xl h-[450px] flex items-center justify-center">
        {/* Disconnected Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <motion.line
            x1="30%" y1="35%" x2="45%" y2="55%"
            stroke="#f6465d" strokeWidth="1" strokeDasharray="3 3"
            animate={{ strokeDashoffset: [0, 10] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.line
            x1="70%" y1="30%" x2="55%" y2="55%"
            stroke="#f6465d" strokeWidth="1" strokeDasharray="3 3"
            animate={{ strokeDashoffset: [0, -10] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.line
            x1="28%" y1="65%" x2="48%" y2="60%"
            stroke="#f6465d" strokeWidth="1" strokeDasharray="3 3"
            animate={{ strokeDashoffset: [0, 8] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
          />
          <motion.line
            x1="72%" y1="65%" x2="52%" y2="60%"
            stroke="#f6465d" strokeWidth="1" strokeDasharray="3 3"
            animate={{ strokeDashoffset: [0, -8] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
          />
        </svg>

        {/* Floating Cards */}
        {floatingCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              style={{
                x: card.x,
                y: card.y,
              }}
              animate={{
                x: [card.x, `calc(${card.x} + ${card.dx}px)`, card.x],
                y: [card.y, `calc(${card.y} + ${card.dy}px)`, card.y],
                rotate: [0, card.rotate, 0],
              }}
              transition={{
                duration: card.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.05, rotate: card.hoverRotate }}
              className={`absolute p-5 rounded-2xl border ${card.color} w-64 backdrop-blur-md shadow-2xl flex flex-col gap-3 cursor-pointer`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-white tracking-wide">{card.title}</h4>
                  <p className="text-[10px] opacity-70 font-semibold">{card.detail}</p>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Central Problem Node */}
        <motion.div
          animate={{
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-20 h-20 rounded-full bg-red-950/30 border border-red-500/20 flex items-center justify-center backdrop-blur-lg shadow-xl shadow-red-950/20"
        >
          <RefreshCw className="w-8 h-8 text-[#f6465d] animate-spin" style={{ animationDuration: "12s" }} />
        </motion.div>
      </div>
    </section>
  );
}
