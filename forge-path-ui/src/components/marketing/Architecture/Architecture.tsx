"use client";

import Link from "next/link";
import {
  Globe, Layers, Lock, Server, Cpu, Bot, Database, FileText, ChevronRight
} from "lucide-react";

export default function Architecture() {
  const nodes = [
    { label: "Browser Client", desc: "React Workspace", icon: Globe },
    { label: "Next.js 16", desc: "Front Router Core", icon: Layers },
    { label: "Clerk Auth", desc: "Identity Gateway", icon: Lock },
    { label: "FastAPI Core", desc: "Compute Engine", icon: Server },
    { label: "AI Studio", desc: "Model Orchestration", icon: Cpu },
    { label: "Gemma 4", desc: "Financial LLM", icon: Bot },
    { label: "Neon Postgres", desc: "Sovereign OLTP", icon: Database },
    { label: "AuraDB Neo4j", desc: "Graph Ledger Map", icon: Layers },
    { label: "Supabase Store", desc: "File Buckets", icon: FileText },
  ];

  return (
    <section className="py-24 border-b border-[#2b3139] bg-[#181a20]/20 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-[#fcd535]/3 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 space-y-16 relative z-10 text-center">
        
        <div className="space-y-4 max-w-2xl mx-auto">
          <span className="text-[10px] font-extrabold text-[#fcd535] uppercase tracking-[0.2em]">Engineering Overview</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Sovereign Enterprise Architecture
          </h2>
          <p className="text-xs md:text-sm text-[#707a8a] leading-relaxed">
            We separate computational workflows cleanly. Data streams through structured nodes to prevent leakage and guarantee millisecond query performance.
          </p>
        </div>

        {/* Network Node Grid */}
        <div className="p-8 rounded-3xl bg-[#1e2329]/40 border border-[#2b3139] max-w-4xl mx-auto relative overflow-hidden backdrop-blur-sm">
          <div className="grid grid-cols-3 gap-6 md:gap-12 relative z-10">
            {nodes.map((node, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#181a20] border border-[#2b3139] text-center space-y-2 group hover:border-[#fcd535]/30 transition-all">
                <div className="w-8 h-8 rounded-lg bg-[#2b3139] text-[#eaecef] group-hover:bg-[#fcd535]/10 group-hover:text-[#fcd535] flex items-center justify-center mx-auto transition-all">
                  <node.icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-white block">{node.label}</span>
                  <span className="text-[8px] text-[#707a8a] block font-mono mt-0.5">{node.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#fcd535_1px,transparent_1px),linear-gradient(to_bottom,#fcd535_1px,transparent_1px)] bg-[size:6rem_6rem]" />
        </div>

        <Link
          href="/architecture"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#fcd535] hover:gap-3.5 transition-all mt-6"
        >
          Explore Complete Architectural Schemas <ChevronRight className="w-4 h-4" />
        </Link>

      </div>
    </section>
  );
}
