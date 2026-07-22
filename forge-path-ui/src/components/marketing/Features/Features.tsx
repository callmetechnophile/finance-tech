"use client";

import {
  Sparkles, FileText, TrendingUp, BarChart3, Inbox,
  DollarSign, Sliders, Shield, Bot, Zap, Code2, Lock
} from "lucide-react";

export default function Features() {
  const featuresList = [
    {
      title: "AI Document Intelligence",
      desc: "Cognitive parsing of unstructured documents with zero manual templates.",
      icon: Sparkles,
      color: "#fcd535"
    },
    {
      title: "Sovereign OCR Engine",
      desc: "Line-item extraction matching industrial-grade precision requirements.",
      icon: FileText,
      color: "#0ecb81"
    },
    {
      title: "Cash Flow Forecasting",
      desc: "Simulate runway and cash behavior up to 90 days out with AI modeling.",
      icon: TrendingUp,
      color: "#38bdf8"
    },
    {
      title: "Executive Dashboard",
      desc: "Unified window into receivables, cash positions, and runway buffers.",
      icon: BarChart3,
      color: "#a855f7"
    },
    {
      title: "Collections Optimizer",
      desc: "Reduce Days Sales Outstanding (DSO) automatically via smart channels.",
      icon: Inbox,
      color: "#f43f5e"
    },
    {
      title: "Treasury Management",
      desc: "Efficient allocation desks for operating payables and payroll.",
      icon: DollarSign,
      color: "#eab308"
    },
    {
      title: "Liquidity Simulations",
      desc: "Stress test solvency limits under customer defaults or supply spikes.",
      icon: Sliders,
      color: "#06b6d4"
    },
    {
      title: "Cognitive Reports",
      desc: "Auto-generated daily briefings summarizing important financial actions.",
      icon: Shield,
      color: "#10b981"
    },
    {
      title: "AI Financial Copilot",
      desc: "Chat directly with your cash ledger to answer complex solvency questions.",
      icon: Bot,
      color: "#fcd535"
    },
    {
      title: "Workflow Automation",
      desc: "Auto-trigger notifications, alerts, and reminder emails with Brevo and Twilio.",
      icon: Zap,
      color: "#f97316"
    },
    {
      title: "Developer APIs",
      desc: "Robust endpoints to pipe documents directly from ERP and accounting tools.",
      icon: Code2,
      color: "#ec4899"
    },
    {
      title: "Enterprise Security",
      desc: "Zero-knowledge encryption, Clerk JWT auth, and sovereign private nodes.",
      icon: Lock,
      color: "#0ecb81"
    }
  ];

  return (
    <section className="py-24 border-b border-[#2b3139] bg-[#0b0e11]">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] font-extrabold text-[#fcd535] uppercase tracking-[0.2em]">Platform Capabilities</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Every Financial Workflow, Solved
          </h2>
          <p className="text-xs md:text-sm text-[#707a8a] leading-relaxed">
            FORGE-PATH replaces fragmented tools, providing a unified, cognitive operating layer for enterprise solvency management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresList.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#1e2329]/50 border border-[#2b3139]/80 hover:border-[#fcd535]/35 hover:bg-[#1e2329] transition-all duration-300 group flex flex-col justify-between gap-6"
              >
                <div className="space-y-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-[#eaecef] group-hover:text-[#181a20] transition-all"
                    style={{ backgroundColor: `${f.color}15`, border: `1px solid ${f.color}35` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: f.color }} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white group-hover:text-[#fcd535] transition-colors">
                      {f.title}
                    </h3>
                    <p className="text-[11px] text-[#707a8a] leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>

                <div className="h-1 bg-[#2b3139]/40 rounded-full overflow-hidden w-1/3 group-hover:w-full transition-all duration-500">
                  <div className="h-full rounded-full transition-transform duration-500" style={{ backgroundColor: f.color, width: "35%" }} />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
