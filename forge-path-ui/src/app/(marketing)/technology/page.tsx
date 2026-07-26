"use client";

import React from "react";
import Navbar from "@/components/marketing/Navbar/Navbar";
import Footer from "@/components/marketing/Footer/Footer";
import { Cpu, Network, Shield, Database, Zap, Layers, Server, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function TechnologyPage() {
  const techStack = [
    {
      title: "Gemma 4 AI Reasoning Engine",
      category: "Inference & Advisory",
      icon: <Cpu className="w-6 h-6 text-blue-400" />,
      description: "Fine-tuned Google AI Studio LLM trained on manufacturing cash flows, payment terms, and working capital optimization.",
    },
    {
      title: "TigerGraph Enterprise DB",
      category: "Graph Knowledge & Counterparty",
      icon: <Network className="w-6 h-6 text-violet-400" />,
      description: "RESTPP native graph query processing for supply chain dependency mapping, payment cascade prediction, and fraud detection.",
    },
    {
      title: "Neon PostgreSQL & Vector",
      category: "Transactional & RAG Store",
      icon: <Database className="w-6 h-6 text-emerald-400" />,
      description: "Serverless Postgres with pgvector for high-dimensional document embedding retrieval, invoice ledgers, and audit trails.",
    },
    {
      title: "FastAPI Async Pipeline",
      category: "Backend Services",
      icon: <Server className="w-6 h-6 text-amber-400" />,
      description: "High-concurrency Python backend running async Uvicorn workers for OCR ingestion, forecasting calculations, and stress testing.",
    },
    {
      title: "ClickHouse & Redis",
      category: "OLAP & Session Cache",
      icon: <Zap className="w-6 h-6 text-pink-400" />,
      description: "Real-time column-oriented telemetry engine paired with in-memory Redis session caching for sub-10ms response times.",
    },
    {
      title: "Next.js 16 App Router",
      category: "Frontend & Edge API",
      icon: <Layers className="w-6 h-6 text-cyan-400" />,
      description: "React 19 server components, Turbopack bundling, serverless route handlers, and Tailwind CSS design tokens.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-16 px-4 max-w-6xl mx-auto w-full relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            Enterprise Infrastructure
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            The Technology Powering FORGE-PATH
          </h1>
          <p className="text-sm text-[#9CA3AF] leading-relaxed">
            Discover the high-performance multi-layer architecture, graph analytics, and AI models driving autonomous financial operations for manufacturing SMEs.
          </p>
        </div>

        {/* Tech Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {techStack.map((tech) => (
            <div
              key={tech.title}
              className="p-6 rounded-2xl bg-[#121824] border border-[#1f2d44] hover:border-blue-500/40 transition-all duration-200 group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#0b0e14] border border-[#1f2d44] flex items-center justify-center group-hover:scale-105 transition-transform">
                  {tech.icon}
                </div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                  {tech.category}
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight">{tech.title}</h3>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">{tech.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action CTA */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-900/30 to-violet-900/30 border border-blue-500/20 text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white">Explore Full Architecture Specification</h2>
          <p className="text-xs text-[#9CA3AF]">
            Read our complete technical blueprint covering data security, API endpoints, schema definitions, and cloud deployment guides.
          </p>
          <div className="pt-2 flex justify-center gap-4 flex-wrap">
            <Link
              href="/architecture"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white shadow-lg transition-all inline-flex items-center gap-2"
            >
              View Architecture Blueprint
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/docs"
              className="px-6 py-3 rounded-xl bg-[#121824] hover:bg-[#1a2233] border border-[#1f2d44] font-bold text-xs text-white transition-all"
            >
              API Documentation
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
