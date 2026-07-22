"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function Problem() {
  const problemCards = [
    { name: "Raw Invoice PDF", value: "$47,500.00", status: "Stuck in Inbox" },
    { name: "Paper Receipt", value: "$1,280.45", status: "Uncategorized" },
    { name: "GST Tax File", value: "Q3 Return", status: "Pending Audit" },
    { name: "Purchase Order", value: "PO-99211", status: "Awaiting Match" },
    { name: "Client Email", value: "Payment delay note", status: "Unread" },
    { name: "Spreadsheet", value: "cashflow_v4_final.xlsx", status: "Out of sync" },
    { name: "Bank Statement", value: "October Ledger", status: "Reconciliation Gap" },
  ];

  return (
    <section className="py-24 border-b border-[#2b3139] bg-[#0b0e11] relative">
      <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
        
        <div className="space-y-4 max-w-2xl mx-auto">
          <span className="text-[10px] font-extrabold text-[#f6465d] uppercase tracking-[0.2em]">The Chaos</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Financial Operations Are Broken
          </h2>
          <p className="text-xs md:text-sm text-[#707a8a] leading-relaxed">
            Financial information is fragmented across documents, spreadsheets, and disconnected legacy systems.
          </p>
        </div>

        {/* Floating chaos container */}
        <div className="relative w-full h-80 max-w-4xl mx-auto border border-[#2b3139]/40 rounded-3xl bg-[#181a20]/20 overflow-hidden flex items-center justify-center">
          
          {/* Background grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#2b3139_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-25" />

          <div className="relative w-full h-full">
            {problemCards.map((card, i) => {
              const delay = i * 0.4;
              const xOffset = [10, -10, 12, -8, 15, -12, 8][i % 7];
              const yOffset = [-15, 15, -8, 12, -10, 8, -12][i % 7];
              
              return (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, yOffset, 0],
                    x: [0, xOffset, 0],
                  }}
                  transition={{
                    duration: 6 + (i % 3) * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: delay
                  }}
                  className="absolute p-4 rounded-xl border bg-[#1e2329]/95 border-[#2b3139] shadow-xl text-left space-y-1 w-44 md:w-52"
                  style={{
                    left: `${12 + (i * 12)}%`,
                    top: `${15 + ((i % 3) * 24)}%`
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-white truncate">{card.name}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f6465d]" />
                  </div>
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-[11px] font-mono text-[#fcd535]">{card.value}</span>
                    <span className="text-[8px] text-[#707a8a]">{card.status}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Overlay warning center */}
          <div className="absolute p-6 rounded-2xl bg-[#0b0e11]/90 border border-[#2b3139] max-w-sm text-center space-y-3 shadow-2xl z-25 backdrop-blur-sm mx-4">
            <div className="w-10 h-10 rounded-lg bg-[#f6465d]/10 border border-[#f6465d]/20 text-[#f6465d] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Fragmentation Bottleneck</h3>
            <p className="text-[10px] text-[#707a8a] leading-relaxed">
              When ledgers and documents float separately, executives act on stale insights. Risk builds, cash runway shrinks, and auditing costs skyrocket.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
