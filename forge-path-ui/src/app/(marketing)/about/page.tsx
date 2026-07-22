"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Target, Cpu, ShieldCheck, ArrowRight
} from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Manufacturing-First Focus",
      desc: "Unlike generic SaaS tools, FORGE-PATH is engineered specifically for manufacturing SMEs. We handle supply chains, long invoicing lead times, and cash bottlenecks unique to fabricators, CNC shops, and assemblers."
    },
    {
      icon: Cpu,
      title: "Advanced Autonomous Intelligence",
      desc: "By integrating Gemma 4 and Neon OLTP pipelines, we offer real-time cognitive auditing. We don't just display past metrics; we predict solvency stress and automate client outreach before cash dry-ups happen."
    },
    {
      icon: ShieldCheck,
      title: "Bank-Grade Infrastructure",
      desc: "Our platform leverages state-of-the-art security, complete with end-to-end data encryption, private network capabilities, and full compliance with industry standards to keep proprietary enterprise ledger data safe."
    }
  ];

  const stackPartners = [
    { name: "Gemma 4 AI", type: "Cognitive Processing", desc: "Drives structured financial analysis and AI Copilot reasoning." },
    { name: "NVIDIA NIM", type: "Inference Engine", desc: "Accelerates local AI modeling and air-gapped security deployments." },
    { name: "Neon PostgreSQL", type: "Serverless Database", desc: "Manages transactional ledger schemas with instant recovery." },
    { name: "ClickHouse OLAP", type: "Analytics Engine", desc: "Processes millions of telemetry data points in milliseconds." }
  ];

  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 border-b border-[#2b3139] overflow-hidden bg-[#0b0e11]">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[250px] bg-[#fcd535]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#0ecb81]/3 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-[#fcd535] uppercase tracking-[0.18em]">
            <span className="w-4 h-px bg-[#fcd535]" />
            About FORGE-PATH
            <span className="w-4 h-px bg-[#fcd535]" />
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Empowering Manufacturing SMEs with <span className="text-[#fcd535]">Financial Solvency</span>
          </h1>
          <p className="text-sm md:text-base text-[#707a8a] max-w-xl mx-auto leading-relaxed">
            FORGE-PATH builds autonomous cash intelligence systems that streamline invoicing, accelerate collections, and stress-test liquidity.
          </p>
        </div>
      </section>

      {/* 2. Mission Section */}
      <section className="py-20 max-w-7xl mx-auto px-6 border-b border-[#2b3139]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-extrabold text-[#0ecb81] uppercase tracking-[0.2em]">Our Mission</span>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
              Bridging the gap between raw production and cash realization.
            </h2>
            <p className="text-xs md:text-sm text-[#707a8a] leading-relaxed">
              Industrial operations rely on complex raw materials, machining, and labor. However, long net-60/90 payment terms from corporate clients frequently lock up working capital.
            </p>
            <p className="text-xs md:text-sm text-[#707a8a] leading-relaxed">
              FORGE-PATH was built to solve this exact bottleneck. By applying advanced natural language extraction (OCR) and predictive financial model scoring, we help shop managers audit outstanding invoices, predict cash runway delays, and maintain perfect operations.
            </p>
          </div>
          <div className="lg:col-span-6 p-8 rounded-2xl bg-[#1e2329] border border-[#2b3139] relative overflow-hidden flex flex-col justify-between h-80">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#fcd535]/5 blur-[35px] rounded-full" />
            <div className="space-y-4">
              <span className="text-[10px] font-mono text-[#fcd535] bg-[#fcd535]/10 border border-[#fcd535]/25 rounded-md px-2 py-0.5">Core Stat</span>
              <h3 className="text-4xl font-extrabold text-white tracking-tight">40%</h3>
              <p className="text-xs text-[#eaecef] font-bold">Reduction in Days Sales Outstanding (DSO)</p>
              <p className="text-xs text-[#707a8a] leading-relaxed">
                By automatically classifying client payment histories, highlighting stress risks, and generating customized billing alerts, FORGE-PATH dramatically cuts invoice resolution cycles.
              </p>
            </div>
            <Link
              href="/features"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#fcd535] hover:gap-2.5 transition-all mt-4"
            >
              Explore Ingestion Features <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Core Values Grid */}
      <section className="py-20 max-w-7xl mx-auto px-6 border-b border-[#2b3139]">
        <div className="text-center space-y-4 mb-16">
          <span className="text-[10px] font-extrabold text-[#fcd535] uppercase tracking-[0.2em]">Our DNA</span>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Why Enterprises Trust FORGE-PATH</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div key={idx} className="p-8 rounded-2xl bg-[#1e2329] border border-[#2b3139] space-y-4 hover:border-[#fcd535]/40 hover:bg-[#181a20] transition-all group">
                <div className="w-10 h-10 rounded-xl bg-[#2b3139] flex items-center justify-center text-[#eaecef] group-hover:bg-[#fcd535] group-hover:text-[#181a20] transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-[#fcd535] transition-colors">{val.title}</h3>
                <p className="text-xs text-[#707a8a] leading-relaxed">
                  {val.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Tech Partners Grid */}
      <section className="py-20 max-w-7xl mx-auto px-6 mb-12">
        <div className="text-center space-y-4 mb-16">
          <span className="text-[10px] font-extrabold text-[#0ecb81] uppercase tracking-[0.2em]">Modern Architecture</span>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Powering the Solvency Engine</h2>
          <p className="text-xs text-[#707a8a] max-w-lg mx-auto">
            Our platform is built in partnership with top infrastructure technologies to deliver unmatched speed, security, and computational precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stackPartners.map((partner, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-[#181a20] border border-[#2b3139] flex flex-col justify-between h-48 hover:border-[#0ecb81]/40 transition-colors">
              <div className="space-y-2">
                <span className="text-[9px] font-mono text-[#707a8a] uppercase tracking-wider block">{partner.type}</span>
                <h4 className="text-sm font-bold text-white">{partner.name}</h4>
                <p className="text-xs text-[#707a8a] leading-relaxed">{partner.desc}</p>
              </div>
              <div className="h-1 bg-[#2b3139] rounded-full overflow-hidden w-1/3">
                <div className="h-full bg-[#0ecb81] w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-[#181a20] border-t border-[#2b3139] mb-12">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Optimize Your Manufacturing Cash Flow</h2>
          <p className="text-xs text-[#707a8a] max-w-md mx-auto leading-relaxed">
            Connect your accounts receivable ledger, ingest invoices via OCR, and gain instant clarity on liquidity runways today.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link
              href="/login"
              className="h-11 px-6 bg-[#fcd535] hover:bg-[#e2be28] text-[#181a20] font-bold text-xs rounded-xl flex items-center justify-center shadow-lg transition-colors"
            >
              Sign In to Workspace
            </Link>
            <Link
              href="/features"
              className="h-11 px-6 border border-[#2b3139] hover:border-[#fcd535] text-white font-bold text-xs rounded-xl flex items-center justify-center transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
