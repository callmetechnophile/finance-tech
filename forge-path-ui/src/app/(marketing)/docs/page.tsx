"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search, Cpu, Code2, Shield, Compass, FileText, Server,
  ChevronRight, ArrowRight
} from "lucide-react";

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"quickstart" | "api" | "architecture">("quickstart");

  const categories = [
    { id: "getting-started", title: "Getting Started", icon: Compass, count: 4 },
    { id: "document-intelligence", title: "Document OCR & Extraction", icon: FileText, count: 6 },
    { id: "ai-studio", title: "Gemma AI Financial Copilot", icon: Cpu, count: 5 },
    { id: "liquidity-treasury", title: "Solvency & Treasury Operations", icon: Server, count: 8 },
    { id: "api-reference", title: "REST API Reference", icon: Code2, count: 12 },
    { id: "security-compliance", title: "Security & Auditing", icon: Shield, count: 4 },
  ];

  const quickStartSteps = [
    {
      step: "01",
      title: "Authenticate API Client",
      desc: "Retrieve your company-level API access tokens using JWT credentials from the Admin Console.",
      code: `curl -X POST "https://api.forgepath.com/v1/auth/token" \\
  -H "Content-Type: application/json" \\
  -d '{"client_id": "apex_id", "client_secret": "sec_..."}'`
    },
    {
      step: "02",
      title: "Stream Financial Documents",
      desc: "POST invoices, POs, or bank statements directly to the OCR pipeline for structured ingestion.",
      code: `curl -X POST "https://api.forgepath.com/v1/documents/ingest" \\
  -H "Authorization: Bearer FP_JWT_TOKEN" \\
  -F "file=@invoice_1092.pdf" \\
  -F "metadata={\\"auto_classify\\": true}"`
    },
    {
      step: "03",
      title: "Request Liquidity Forecasts",
      desc: "Query the forecasting engine for real-time 30-day runway projections and anomaly detection.",
      code: `curl -X GET "https://api.forgepath.com/v1/forecast/runway?days=30" \\
  -H "Authorization: Bearer FP_JWT_TOKEN"`
    }
  ];

  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 border-b border-[#2b3139] overflow-hidden bg-[#0b0e11]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#fcd535]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#0ecb81]/3 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-[#fcd535] uppercase tracking-[0.18em]">
            <span className="w-4 h-px bg-[#fcd535]" />
            Documentation Hub
            <span className="w-4 h-px bg-[#fcd535]" />
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Build and Integrate <span className="inline-flex items-center whitespace-nowrap">with <span className="text-[#fcd535] ml-1.5">FORGE-PATH</span></span>
          </h1>
          <p className="text-sm md:text-base text-[#707a8a] max-w-xl mx-auto leading-relaxed">
            API guides, document processing pipelines, Gemma 4 AI integration, and core architecture references for modern enterprise finance.
          </p>

          <div className="max-w-xl mx-auto relative mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#707a8a]" />
            <input
              type="text"
              placeholder="Search docs, API endpoints, tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-[#181a20] border border-[#2b3139] rounded-xl text-sm focus:outline-none focus:border-[#fcd535] focus:ring-1 focus:ring-[#fcd535]/35 transition-all text-white placeholder-[#707a8a]"
            />
          </div>
        </div>
      </section>

      {/* 2. Content Section */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-bold text-[#707a8a] uppercase tracking-wider pl-2">Knowledge Base</h3>
            <div className="space-y-1.5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#181a20] border border-[#2b3139] hover:border-[#fcd535]/40 hover:bg-[#1e2329] group transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#2b3139] flex items-center justify-center text-[#eaecef] group-hover:text-[#fcd535] transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-[#eaecef] group-hover:text-white transition-colors">{cat.title}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-[#707a8a] bg-[#2b3139] px-2 py-0.5 rounded-full">{cat.count} files</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#707a8a] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-[#1e2329] to-[#0b0e11] border border-[#2b3139] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#fcd535]/5 blur-[25px] rounded-full" />
              <h4 className="text-sm font-bold text-white mb-2">Technical Architecture</h4>
              <p className="text-xs text-[#707a8a] leading-relaxed mb-4">
                Want to know how FORGE-PATH functions internally? Explore our deep engineering overview.
              </p>
              <Link
                href="/architecture"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#fcd535] hover:gap-2.5 transition-all"
              >
                View System Design <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-12">
            
            <div className="flex border-b border-[#2b3139] pb-px">
              {[
                { id: "quickstart", label: "Quick Start" },
                { id: "api", label: "Core API Guidelines" },
                { id: "architecture", label: "Deployment Options" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3.5 text-xs font-extrabold border-b-2 tracking-wide transition-all ${
                    activeTab === tab.id
                      ? "border-[#fcd535] text-[#fcd535] bg-[#fcd535]/5"
                      : "border-transparent text-[#707a8a] hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* QUICKSTART CONTENT */}
            {activeTab === "quickstart" && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-white">Developer Integration Quickstart</h2>
                  <p className="text-xs text-[#707a8a] leading-relaxed">
                    Set up your system to stream data directly into the FORGE-PATH document ingestion and AI auditing engine. Follow this simple 3-step integration loop.
                  </p>
                </div>

                <div className="space-y-6">
                  {quickStartSteps.map((step, idx) => (
                    <div key={idx} className="p-6 rounded-2xl bg-[#1e2329] border border-[#2b3139] space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-bold text-[#fcd535] bg-[#fcd535]/10 border border-[#fcd535]/25 rounded-md px-2 py-0.5">
                            {step.step}
                          </span>
                          <h3 className="text-sm font-bold text-white">{step.title}</h3>
                        </div>
                        <span className="text-[10px] font-mono text-[#707a8a] uppercase tracking-wider">REST API</span>
                      </div>
                      <p className="text-xs text-[#eaecef] leading-relaxed">
                        {step.desc}
                      </p>
                      
                      <div className="rounded-xl bg-[#0b0e11] border border-[#2b3139] p-4 font-mono text-[11px] text-[#eaecef] overflow-x-auto relative">
                        <div className="absolute right-3 top-3 flex items-center gap-1.5 bg-[#181a20] border border-[#2b3139] rounded px-2 py-1 text-[9px] text-[#707a8a] font-sans">
                          <span className="w-1.5 h-1.5 bg-[#0ecb81] rounded-full" /> bash
                        </div>
                        <pre>{step.code}</pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* API GUIDELINES CONTENT */}
            {activeTab === "api" && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-white">Core API Architectures</h2>
                  <p className="text-xs text-[#707a8a] leading-relaxed">
                    FORGE-PATH uses highly structured REST payloads and returns real-time server-sent events for document intelligence processing.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Document Parser Engine",
                      desc: "Supports PDF, JPEG, PNG formats up to 50MB. Real-time line-item and ledger extraction with automated category mapping.",
                      method: "POST",
                      endpoint: "/v1/documents/parse"
                    },
                    {
                      title: "Solvency Engine",
                      desc: "Extracts invoice age, calculates payment profiles, and simulates collections velocity for predictive runway insights.",
                      method: "GET",
                      endpoint: "/v1/solvency/predict"
                    },
                    {
                      title: "AI Co-Pilot Stream",
                      desc: "Open a Server-Sent Events stream to query Gemma 4 with context from past conversations and company documents.",
                      method: "POST",
                      endpoint: "/v1/copilot/chat-stream"
                    },
                    {
                      title: "System Telemetry",
                      desc: "Exposes health check stats, ClickHouse OLAP ingestion lag, Neon storage consumption, and OCR engine metrics.",
                      method: "GET",
                      endpoint: "/v1/telemetry/health"
                    }
                  ].map((api, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-[#1e2329] border border-[#2b3139] flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md ${
                            api.method === "POST" 
                              ? "bg-[#0ecb81]/10 border border-[#0ecb81]/30 text-[#0ecb81]"
                              : "bg-[#fcd535]/10 border border-[#fcd535]/30 text-[#fcd535]"
                          }`}>
                            {api.method}
                          </span>
                          <span className="text-[10px] font-mono text-[#eaecef] font-bold">{api.endpoint}</span>
                        </div>
                        <h4 className="text-xs font-bold text-white">{api.title}</h4>
                        <p className="text-[11px] text-[#707a8a] leading-relaxed">{api.desc}</p>
                      </div>
                      <button className="flex items-center gap-1 text-[10px] font-bold text-[#fcd535] hover:gap-2 transition-all text-left">
                        Read Reference Docs <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ARCHITECTURE / DEPLOYMENT CONTENT */}
            {activeTab === "architecture" && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-white">Enterprise Deployment Schemes</h2>
                  <p className="text-xs text-[#707a8a] leading-relaxed">
                    Choose from standard Cloud SaaS or secure On-Premise deployments matching your manufacturing operations compliance.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      title: "Cloud SaaS (Standard)",
                      desc: "Hosted on multi-region AWS and Vercel Edge networks. Fast deployment, managed automatic updates, and serverless Neon databases with multi-tenant encryption.",
                      stat: "99.99% Uptime SLA",
                      color: "#0ecb81"
                    },
                    {
                      title: "Hybrid Cloud Node",
                      desc: "Data-plane remains in your private cloud (AWS/Azure), keeping Neon databases and local Supabase documents encrypted on-prem. Analytics sent securely to ClickHouse.",
                      stat: "Zero-Trust Ready",
                      color: "#fcd535"
                    },
                    {
                      title: "Fully Sovereign Private Node",
                      desc: "For heavy aerospace/defense manufacturing SMEs. Runs entirely inside air-gapped private Kubernetes clusters. AI models compiled locally using NVIDIA NIM.",
                      stat: "100% Data Sovereignty",
                      color: "#f6465d"
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="p-6 rounded-2xl bg-[#1e2329] border border-[#2b3139] flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-2 max-w-xl">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#707a8a] leading-relaxed">{item.desc}</p>
                      </div>
                      <div className="shrink-0 flex flex-col items-start md:items-end gap-1">
                        <span className="text-[10px] font-mono text-[#eaecef] font-bold bg-[#2b3139] px-3 py-1 rounded-full">
                          {item.stat}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}
