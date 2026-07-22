"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, Play, CheckCircle2, Shield, Bot, Cpu, FileText,
  Search, Terminal, Database, Sparkles, BarChart3, TrendingUp,
  Inbox, DollarSign, Sliders, Settings, HelpCircle, Layers,
  ChevronRight, ArrowUpRight, AlertTriangle, FileUp, Zap, HelpCircle as HelpIcon,
  RefreshCw, Globe, Server, Code2, Lock, Check, Send
} from "lucide-react";
import LandingNavbar from "./components/landing/LandingNavbar";
import StatsAndFooter from "./components/landing/StatsAndFooter";

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [demoComplete, setDemoComplete] = useState(false);
  const [activeDocsTab, setActiveDocsTab] = useState<"api" | "sdk" | "examples">("api");
  const videoRef = useRef<HTMLVideoElement>(null);

  // Problem cards floating state
  const problemCards = [
    { name: "Raw Invoice PDF", value: "$47,500.00", status: "Stuck in Inbox" },
    { name: "Paper Receipt", value: "$1,280.45", status: "Uncategorized" },
    { name: "GST Tax File", value: "Q3 Return", status: "Pending Audit" },
    { name: "Purchase Order", value: "PO-99211", status: "Awaiting Match" },
    { name: "Client Email", value: "Payment delay note", status: "Unread" },
    { name: "Spreadsheet", value: "cashflow_v4_final.xlsx", status: "Out of sync" },
    { name: "Bank Statement", value: "October Ledger", status: "Reconciliation Gap" },
  ];

  // Journey Steps
  const journeySteps = [
    {
      title: "Document Upload",
      subtitle: "Ingestion Core",
      desc: "Financial documents (PDFs, images, sheets) are securely uploaded via web workspace, email forwarders, or API endpoints.",
    },
    {
      title: "AI-Powered OCR",
      subtitle: "Line-Item Extraction",
      desc: "Advanced neural nets scan, parse, and structure every invoice item, tax rate, and payment term into digital JSON nodes.",
    },
    {
      title: "Gemma 4 Auditing",
      subtitle: "Reasoning Layer",
      desc: "Our financial LLM reasons through historical payment patterns and flags anomalies or risk trends associated with the client.",
    },
    {
      title: "Solvency Intelligence",
      subtitle: "Liquidity Modeling",
      desc: "FORGE-PATH automatically projects cash impact, recalculates runway days, and updates solvency models.",
    },
    {
      title: "Neon DB Transaction",
      subtitle: "Sovereign Ledger",
      desc: "Extracted facts are instantly written to Neon PostgreSQL database replicas using serverless multi-tenant encryption.",
    },
    {
      title: "Live Dashboard Updates",
      subtitle: "Executive View",
      desc: "Receivables, payables, and net-cash flow metrics dynamically increment with zero manual data entry.",
    },
    {
      title: "Morning Executive Brief",
      subtitle: "Solvency Briefing",
      desc: "Updates are summarized into the Daily morning brief. High-risk payment delays are bubbled to the top with suggested actions.",
    },
    {
      title: "AI Copilot Action",
      subtitle: "Automated Workflows",
      desc: "Draft payment reminders, authorize delayed invoice escalations, or request scenarios directly from the AI agent.",
    }
  ];

  // Features List
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

  // Tech stack logos
  const techStack = [
    { name: "Next.js", desc: "Core Web App Framework" },
    { name: "FastAPI", desc: "Backend API Core" },
    { name: "Google AI", desc: "Studio Orchestration" },
    { name: "Gemma 4", desc: "Cognitive Engine" },
    { name: "Supabase", desc: "Document Buckets" },
    { name: "Neon DB", desc: "Serverless Postgres" },
    { name: "AuraDB", desc: "Graph Database" },
    { name: "Clerk Auth", desc: "Identity Gateway" },
    { name: "Docker", desc: "Containerized Nodes" },
    { name: "Vercel", desc: "Edge Deployment" },
    { name: "ClickHouse", desc: "Analytics (Future)" },
    { name: "Redis", desc: "Cache & Queue (Future)" },
  ];

  // API docs code
  const docsCode = {
    api: `POST /v1/documents/ingest HTTP/1.1
Host: api.forgepath.com
Authorization: Bearer fp_live_8829...
Content-Type: multipart/form-data

{
  "file": "@invoice_US_9021.pdf",
  "metadata": {
    "auto_classify": true,
    "ocr_precision": "high"
  }
}`,
    sdk: `import { ForgePath } from "@forge-path/node";

const client = new ForgePath({ apiKey: "fp_live_8829..." });

const document = await client.documents.upload({
  file: fs.createReadStream("./invoice.pdf"),
  autoClassify: true
});

console.log(\`Ingested: \${document.id} | Amount: \${document.amount}\`);`,
    examples: `{
  "document_id": "doc_883192",
  "status": "ingested",
  "extracted_data": {
    "vendor": "Apex Steel",
    "amount": 47500.00,
    "currency": "USD",
    "due_date": "2026-08-30",
    "risk_assessment": {
      "rating": "low",
      "delay_probability": 0.08
    }
  }
}`
  };

  const handlePlayDemo = () => {
    setIsPlayingDemo(true);
    setDemoComplete(false);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleVideoEnded = () => {
    setDemoComplete(true);
    setIsPlayingDemo(false);
  };

  return (
    <main className="min-h-screen bg-[#0b0e11] text-white selection:bg-[#fcd535] selection:text-black overflow-x-hidden relative">
      <LandingNavbar />

      {/* ── SECTION 1: HERO ── */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-36 border-b border-[#2b3139] overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e2329_1px,transparent_1px),linear-gradient(to_bottom,#1e2329_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />
        
        {/* Moving ambient point glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#fcd535]/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <div className="lg:col-span-6 space-y-6 text-left">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-[#fcd535] uppercase tracking-[0.2em] bg-[#fcd535]/10 border border-[#fcd535]/25 rounded-md px-3 py-1.5">
              <Sparkles className="w-3.5 h-3.5" /> FORGE-PATH OS
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Enterprise Financial Operating System for Modern SMEs
            </h1>
            <p className="text-sm md:text-base text-[#707a8a] max-w-xl leading-relaxed">
              Transform financial documents into real-time business intelligence using AI-powered OCR, forecasting, and executive analytics. Build an automated bridge between document ingestion and balance sheet solvency.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/login"
                className="h-12 px-6 bg-[#fcd535] hover:bg-[#e2be28] text-[#181a20] font-extrabold text-xs uppercase tracking-wider rounded-md flex items-center justify-center gap-2 shadow-lg shadow-[#fcd535]/15 transition-all"
              >
                Launch Workspace <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => {
                  document.getElementById("interactive-demo")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="h-12 px-6 border border-[#2b3139] hover:border-[#fcd535] text-white hover:text-[#fcd535] font-extrabold text-xs uppercase tracking-wider rounded-md flex items-center justify-center gap-2 transition-all bg-[#181a20]/40 backdrop-blur-sm"
              >
                <Play className="w-4 h-4 fill-current" /> Watch Interactive Demo
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-center relative">
            {/* Cinematic Mockup Frame */}
            <div className="w-full max-w-xl p-5 rounded-2xl bg-[#1e2329]/80 border border-[#2b3139] shadow-2xl relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#fcd535]/50 via-[#0ecb81]/50 to-[#38bdf8]/50" />
              
              {/* Fake dashboard headers */}
              <div className="flex justify-between items-center border-b border-[#2b3139] pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#f6465d]" />
                  <div className="w-3 h-3 rounded-full bg-[#fcd535]" />
                  <div className="w-3 h-3 rounded-full bg-[#0ecb81]" />
                  <span className="text-[10px] text-[#707a8a] font-mono ml-2">forgepath_mockup_v1.sh</span>
                </div>
                <span className="text-[9px] text-[#0ecb81] font-mono bg-[#0ecb81]/10 px-2 py-0.5 rounded border border-[#0ecb81]/20">AI Active</span>
              </div>

              {/* Fake Content Widgets */}
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-[#181a20] rounded-xl border border-[#2b3139] space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-[#707a8a] block">Current Cash</span>
                    <span className="text-sm font-bold font-mono">$342,000</span>
                    <span className="text-[8px] text-[#0ecb81] flex items-center gap-0.5"><ArrowUpRight className="w-2.5 h-2.5" /> +4.2%</span>
                  </div>
                  <div className="p-3 bg-[#181a20] rounded-xl border border-[#2b3139] space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-[#707a8a] block">Unpaid Invoices</span>
                    <span className="text-sm font-bold font-mono">$284,500</span>
                    <span className="text-[8px] text-[#fcd535]">12 invoices</span>
                  </div>
                  <div className="p-3 bg-[#181a20] rounded-xl border border-[#2b3139] space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-[#707a8a] block">Cash Runway</span>
                    <span className="text-sm font-bold font-mono">68 Days</span>
                    <span className="text-[8px] text-[#0ecb81]">Optimal</span>
                  </div>
                </div>

                {/* Animated Chart Mockup */}
                <div className="h-28 bg-[#181a20] rounded-xl border border-[#2b3139] p-3 flex flex-col justify-between relative overflow-hidden">
                  <span className="text-[9px] uppercase tracking-wider text-[#707a8a]">Runway & Liquidity Forecast</span>
                  <div className="flex-1 flex items-end gap-1.5 pt-4">
                    {[35, 45, 40, 55, 50, 72, 65, 85, 90, 80, 95, 110].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 0.1 * i, duration: 0.5 }}
                        className="flex-1 rounded-t bg-gradient-to-t from-[#fcd535] to-[#fcd535]/30 min-h-[4px]"
                      />
                    ))}
                  </div>
                </div>

                {/* AI response mockup */}
                <div className="p-3 bg-[#181a20] rounded-xl border border-[#2b3139] flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-lg bg-[#fcd535]/10 flex items-center justify-center text-[#fcd535] flex-shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-white block">Gemma AI Auditing Agent</span>
                    <p className="text-[9px] text-[#eaecef] leading-relaxed">
                      "I've flagged **Apex Steel** ($47,500.00). Invoice payment history exhibits an average 12-day delay drift. Suggest triggering automatic collections automation reminder."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Glowing orb behind mockup */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#fcd535]/10 to-transparent blur-[80px]" />
          </div>

        </div>
      </section>

      {/* ── SECTION 2: THE PROBLEM ── */}
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
                // Generate distinct floating loops
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
                    className={`absolute p-4 rounded-xl border bg-[#1e2329]/95 border-[#2b3139] shadow-xl text-left space-y-1 w-44 md:w-52`}
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

      {/* ── SECTION 3: THE JOURNEY OF ONE INVOICE ── */}
      <section className="py-24 border-b border-[#2b3139] bg-[#181a20]/20 relative">
        {/* Glow point */}
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-[#fcd535]/3 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
            <span className="text-[10px] font-extrabold text-[#fcd535] uppercase tracking-[0.2em]">Product Lifecycle</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">The Journey of One Invoice</h2>
            <p className="text-xs md:text-sm text-[#707a8a] leading-relaxed">
              Watch as a raw document flows dynamically through the FORGE-PATH operating pipelines, turning into structured ledger actions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Interactive Timeline Controls (Left) */}
            <div className="lg:col-span-5 space-y-3 relative z-10">
              {journeySteps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full p-4 rounded-xl border text-left flex items-start gap-4 transition-all duration-300 ${
                    activeStep === idx
                      ? "bg-[#1e2329] border-[#fcd535] shadow-lg"
                      : "bg-[#181a20]/40 border-[#2b3139]/50 opacity-60 hover:opacity-100 hover:border-[#2b3139]"
                  }`}
                >
                  <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                    activeStep === idx
                      ? "bg-[#fcd535] text-[#181a20]"
                      : "bg-[#2b3139] text-[#707a8a]"
                  }`}>
                    {idx + 1}
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">{step.title}</h3>
                    <span className="text-[9px] text-[#707a8a] block">{step.subtitle}</span>
                    {activeStep === idx && (
                      <motion.p
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[11px] text-[#eaecef] leading-relaxed pt-2"
                      >
                        {step.desc}
                      </motion.p>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Protagonist Invoice Card Preview (Right, Sticky) */}
            <div className="lg:col-span-7 lg:sticky lg:top-28 flex justify-center">
              <div className="w-full max-w-lg min-h-[350px] p-6 rounded-2xl bg-[#1e2329] border border-[#2b3139] relative shadow-2xl flex flex-col justify-between overflow-hidden">
                
                {/* Background flow effect */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#fcd535]/5 blur-[30px] rounded-full pointer-events-none" />

                <div className="space-y-4">
                  
                  {/* Dynamic Header based on active step */}
                  <div className="flex justify-between items-center border-b border-[#2b3139] pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#fcd535]/10 flex items-center justify-center text-[#fcd535]">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-white block">invoice_US_9021.pdf</span>
                        <span className="text-[8px] text-[#707a8a] block font-mono">MD5: e7b1a2080a...</span>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      activeStep === 0 ? "bg-[#707a8a]/20 text-[#707a8a]" :
                      activeStep === 1 ? "bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20" :
                      activeStep === 2 ? "bg-[#a855f7]/10 text-[#a855f7] border border-[#a855f7]/20 animate-pulse" :
                      "bg-[#0ecb81]/10 text-[#0ecb81] border border-[#0ecb81]/20"
                    }`}>
                      {activeStep === 0 ? "Raw Upload" :
                       activeStep === 1 ? "Extracting" :
                       activeStep === 2 ? "Auditing" :
                       "Ingested"}
                    </span>
                  </div>

                  {/* Dynamic Card Body */}
                  <div className="min-h-[160px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                      
                      {/* Step 1: Upload */}
                      {activeStep === 0 && (
                        <motion.div
                          key="step-0"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="border border-dashed border-[#2b3139] rounded-xl p-8 text-center space-y-3 bg-[#0b0e11]/30"
                        >
                          <FileUp className="w-8 h-8 mx-auto text-[#707a8a]" />
                          <div>
                            <span className="text-xs font-bold text-white block">Drag and drop file here</span>
                            <span className="text-[9px] text-[#707a8a] block mt-0.5">PDF, PNG, JPG, XML up to 50MB</span>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 2: OCR */}
                      {activeStep === 1 && (
                        <motion.div
                          key="step-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-3 relative overflow-hidden"
                        >
                          {/* Scanner Laser overlay */}
                          <motion.div
                            animate={{ y: [-10, 160, -10] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-0.5 bg-[#0ecb81]/60 shadow-[0_0_8px_rgba(14,203,129,0.8)] z-10"
                          />
                          <div className="space-y-2 text-[10px] font-mono bg-[#0b0e11] p-3 rounded-lg border border-[#2b3139]">
                            <div className="flex justify-between"><span className="text-[#707a8a]">Vendor:</span> <span className="text-white">Apex Steel Fabrication</span></div>
                            <div className="flex justify-between"><span className="text-[#707a8a]">Amount:</span> <span className="text-[#0ecb81]">$47,500.00</span></div>
                            <div className="flex justify-between"><span className="text-[#707a8a]">Date:</span> <span className="text-white">2026-07-20</span></div>
                            <div className="flex justify-between"><span className="text-[#707a8a]">Due Date:</span> <span className="text-white">2026-08-30</span></div>
                            <div className="flex justify-between"><span className="text-[#707a8a]">Terms:</span> <span className="text-white">Net 40 Days</span></div>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 3: Gemma 4 */}
                      {activeStep === 2 && (
                        <motion.div
                          key="step-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="p-4 bg-[#0b0e11] rounded-xl border border-[#2b3139] flex gap-3 items-start"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#a855f7]/10 text-[#a855f7] flex items-center justify-center flex-shrink-0 border border-[#a855f7]/20">
                            <Cpu className="w-4 h-4" />
                          </div>
                          <div className="space-y-2 flex-1">
                            <span className="text-[11px] font-bold text-white block">Gemma LLM Reasoning Task</span>
                            <div className="p-2.5 bg-[#181a20] rounded border border-[#2b3139] space-y-1.5">
                              <div className="flex items-center gap-1.5"><span className="text-[9px] text-[#a855f7] font-bold uppercase">Audit Alert:</span><span className="text-[9px] text-[#f6465d] bg-[#f6465d]/10 px-1 rounded">12d Delay Drift</span></div>
                              <p className="text-[9px] text-[#eaecef] leading-relaxed">
                                "Apex Steel exhibits a rising delay drift. Average fulfillment offset is 12 days past net due date. Probability of default: &lt;1% (Low risk, high friction)."
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 4: Solvency Intel */}
                      {activeStep === 3 && (
                        <motion.div
                          key="step-3"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-3"
                        >
                          <div className="p-3 bg-[#0b0e11] border border-[#2b3139] rounded-xl space-y-2">
                            <div className="flex justify-between items-center"><span className="text-[10px] text-[#707a8a]">Runway Simulation</span> <span className="text-[10px] text-[#0ecb81] font-bold font-mono">+4 Days</span></div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-bold font-mono text-white">68 Days</span>
                              <span className="text-xs text-[#eaecef]">→</span>
                              <span className="text-xl font-bold font-mono text-[#0ecb81]">72 Days</span>
                            </div>
                            <div className="w-full bg-[#181a20] h-2 rounded-full overflow-hidden">
                              <motion.div initial={{ width: "68%" }} animate={{ width: "72%" }} className="h-full bg-[#0ecb81] rounded-full" />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 5: Database */}
                      {activeStep === 4 && (
                        <motion.div
                          key="step-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="rounded-xl bg-[#0b0e11] border border-[#2b3139] p-3 font-mono text-[9px] text-[#eaecef] overflow-hidden"
                        >
                          <div className="border-b border-[#2b3139] pb-1.5 mb-1.5 text-[#707a8a] flex justify-between">
                            <span>NEON DATABASE CONSOLE</span>
                            <span className="text-[#0ecb81]">CONNECTED</span>
                          </div>
                          <pre className="text-left leading-relaxed">
                            {`INSERT INTO company_receivables (
  id, vendor, amount, status, due_date
) VALUES (
  'rec_8831', 'Apex Steel', 47500.00, 'UNPAID', '2026-08-30'
);
Query OK, 1 row affected (12ms)`}
                          </pre>
                        </motion.div>
                      )}

                      {/* Step 6: Dashboard */}
                      {activeStep === 5 && (
                        <motion.div
                          key="step-5"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="p-3 bg-[#0b0e11] border border-[#2b3139] rounded-xl flex items-center justify-between"
                        >
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase tracking-wider text-[#707a8a] block">Outstanding Receivables</span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-bold font-mono text-white">$237,000</span>
                              <span className="text-xs text-[#eaecef]">→</span>
                              <span className="text-xl font-bold font-mono text-[#fcd535]">$284,500</span>
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-full border border-[#fcd535]/20 flex items-center justify-center bg-[#fcd535]/5 text-[#fcd535]">
                            <TrendingUp className="w-5 h-5" />
                          </div>
                        </motion.div>
                      )}

                      {/* Step 7: Morning Executive Brief */}
                      {activeStep === 6 && (
                        <motion.div
                          key="step-6"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="p-4 bg-[#0b0e11] rounded-xl border border-[#2b3139] space-y-2 text-left"
                        >
                          <div className="flex justify-between items-center"><span className="text-[10px] text-[#fcd535] font-extrabold uppercase tracking-wider">Morning Executive Brief</span> <span className="text-[8px] text-[#707a8a]">08:00 AM</span></div>
                          <p className="text-[10px] text-[#eaecef] leading-relaxed">
                            "A new invoice from **Apex Steel** ($47.5k) has been ingested. While liquidity has improved by +4 runway days, this vendor exhibits delay drift trends. Recommend assigning automation outreach rules."
                          </p>
                        </motion.div>
                      )}

                      {/* Step 8: AI Copilot Action */}
                      {activeStep === 7 && (
                        <motion.div
                          key="step-7"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-3"
                        >
                          <div className="space-y-2">
                            <div className="flex gap-2 items-end justify-end"><div className="bg-[#fcd535]/15 border border-[#fcd535]/35 p-2 rounded-xl text-[9px] text-white">"Draft escalation for Apex Steel"</div></div>
                            <div className="flex gap-2 items-start"><div className="w-5 h-5 rounded bg-[#fcd535]/10 flex items-center justify-center text-[#fcd535] text-[10px]"><Bot className="w-3 h-3" /></div><div className="bg-[#181a20] border border-[#2b3139] p-2 rounded-xl text-[9px] text-[#eaecef] max-w-[80%]">"Escalation email draft created for alex@apexsteel.com. Trigger reminder channel?"</div></div>
                          </div>
                          <button className="w-full py-2 bg-[#fcd535] hover:bg-[#e2be28] text-[#181a20] text-[10px] font-extrabold rounded-lg flex items-center justify-center gap-1.5 transition-colors">
                            <Send className="w-3 h-3" /> Confirm & Send via WhatsApp
                          </button>
                        </motion.div>
                      )}

                    </AnimatePresence>
                  </div>

                </div>

                {/* Bottom Step Indicator Footer */}
                <div className="flex justify-between items-center border-t border-[#2b3139] pt-4 mt-6 text-[10px] text-[#707a8a]">
                  <span>Step {activeStep + 1} of 8</span>
                  <div className="flex gap-1.5">
                    {journeySteps.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveStep(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          activeStep === i ? "bg-[#fcd535] w-4" : "bg-[#2b3139] hover:bg-[#707a8a]"
                        }`}
                      />
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── SECTION 4: FEATURES ── */}
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

                  {/* Micro illustration wrapper */}
                  <div className="h-1 bg-[#2b3139]/40 rounded-full overflow-hidden w-1/3 group-hover:w-full transition-all duration-500">
                    <div className="h-full rounded-full transition-transform duration-500" style={{ backgroundColor: f.color, width: "35%" }} />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── SECTION 5: ARCHITECTURE PREVIEW ── */}
      <section className="py-24 border-b border-[#2b3139] bg-[#181a20]/20 relative overflow-hidden">
        {/* Glow behind */}
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
              {[
                { label: "Browser Client", desc: "React Workspace", icon: Globe },
                { label: "Next.js 16", desc: "Front Router Core", icon: Layers },
                { label: "Clerk Auth", desc: "Identity Gateway", icon: Lock },
                { label: "FastAPI Core", desc: "Compute Engine", icon: Server },
                { label: "AI Studio", desc: "Model Orchestration", icon: Cpu },
                { label: "Gemma 4", desc: "Financial LLM", icon: Bot },
                { label: "Neon Postgres", desc: "Sovereign OLTP", icon: Database },
                { label: "AuraDB Neo4j", desc: "Graph Ledger Map", icon: Layers },
                { label: "Supabase Store", desc: "File Buckets", icon: FileText },
              ].map((node, i) => (
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

            {/* Simulated connection lines background */}
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

      {/* ── SECTION 6: TECH STACK ── */}
      <section className="py-20 border-b border-[#2b3139] bg-[#0b0e11]">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold text-[#707a8a] uppercase tracking-[0.2em]">Technology Stack</span>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Built with the Best</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {techStack.map((tech, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#1e2329]/60 border border-[#2b3139] text-center space-y-1.5">
                <span className="text-xs font-extrabold text-white block">{tech.name}</span>
                <span className="text-[9px] text-[#707a8a] block font-mono">{tech.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: DOCUMENTATION PREVIEW ── */}
      <section className="py-24 border-b border-[#2b3139] bg-[#181a20]/20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6 text-left">
            <span className="text-[10px] font-extrabold text-[#fcd535] uppercase tracking-[0.2em]">Developer APIs</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
              Stripe-Quality Integration
            </h2>
            <p className="text-xs md:text-sm text-[#707a8a] leading-relaxed">
              Inject financial documents directly into FORGE-PATH OCR pipelines using simple REST endpoints. Our developer tools make accounts integration trivial.
            </p>
            <div className="flex gap-3 pt-2">
              {["api", "sdk", "examples"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveDocsTab(tab as any)}
                  className={`px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider border rounded-md transition-all ${
                    activeDocsTab === tab
                      ? "bg-[#fcd535] border-[#fcd535] text-[#181a20]"
                      : "bg-[#1e2329]/40 border-[#2b3139] text-[#707a8a] hover:text-white"
                  }`}
                >
                  {tab === "api" ? "cURL API" : tab === "sdk" ? "Node.js SDK" : "JSON Response"}
                </button>
              ))}
            </div>
            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#fcd535] hover:gap-2.5 transition-all pt-4 border-t border-[#2b3139]/40 w-full"
            >
              Read Developer Documentation <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Interactive Code Console (Right) */}
          <div className="lg:col-span-7 rounded-2xl bg-[#0b0e11] border border-[#2b3139] overflow-hidden shadow-2xl relative">
            <div className="absolute top-3 right-4 flex items-center gap-2 text-[9px] text-[#707a8a] font-mono">
              <span className="w-1.5 h-1.5 bg-[#0ecb81] rounded-full animate-pulse" /> endpoint active
            </div>
            
            <div className="flex items-center gap-2 border-b border-[#2b3139] px-4 py-3 bg-[#181a20]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#f6465d]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#fcd535]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#0ecb81]" />
              <span className="text-[10px] text-[#707a8a] font-mono ml-2">forgepath_api_shell.js</span>
            </div>

            <div className="p-5 font-mono text-[11px] text-[#eaecef] overflow-x-auto min-h-[220px]">
              <pre className="text-left leading-relaxed">
                {docsCode[activeDocsTab]}
              </pre>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 8: INTERACTIVE DEMO ── */}
      <section id="interactive-demo" className="py-24 border-b border-[#2b3139] bg-[#0b0e11] relative">
        {/* Ambient point glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#fcd535]/3 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 text-center space-y-12 relative z-10">
          
          <div className="space-y-4 max-w-2xl mx-auto">
            <span className="text-[10px] font-extrabold text-[#fcd535] uppercase tracking-[0.2em]">Cinematic Tour</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              Watch FORGE-PATH In Action
            </h2>
            <p className="text-xs md:text-sm text-[#707a8a] leading-relaxed">
              Experience the complete visual walkthrough of document processing pipelines and AI-driven executive simulations.
            </p>
          </div>

          {/* Cinematic Video Player Container */}
          <div className="max-w-4xl mx-auto rounded-3xl bg-[#1e2329] border border-[#2b3139] overflow-hidden shadow-2xl relative aspect-video flex items-center justify-center group">
            
            {/* Embedded video player */}
            <video
              ref={videoRef}
              src="/intro.mp4"
              className="w-full h-full object-cover"
              controls={isPlayingDemo}
              onEnded={handleVideoEnded}
            />

            {/* Custom Overlay Play Button */}
            {!isPlayingDemo && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center space-y-4 z-10 transition-all">
                <button
                  onClick={handlePlayDemo}
                  className="w-16 h-16 rounded-full bg-[#fcd535] hover:bg-[#e2be28] text-[#181a20] flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                >
                  <Play className="w-6 h-6 fill-current ml-1" />
                </button>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#eaecef]">
                  {demoComplete ? "Replay Video Demo" : "Play Interactive Overview (2 min)"}
                </span>
              </div>
            )}

            {/* Demo complete overlay */}
            {demoComplete && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-[4px] flex flex-col items-center justify-center space-y-6 z-20 transition-all">
                <div className="w-12 h-12 rounded-full bg-[#0ecb81]/15 border border-[#0ecb81]/30 text-[#0ecb81] flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="text-base font-bold text-white uppercase tracking-wider">Journey Complete</h3>
                  <p className="text-xs text-[#707a8a] max-w-sm mx-auto">
                    You've seen how FORGE-PATH processes cash data. Now try launching your own active workspace.
                  </p>
                </div>
                <Link
                  href="/login"
                  className="h-11 px-6 bg-[#fcd535] hover:bg-[#e2be28] text-[#181a20] font-extrabold text-xs uppercase tracking-wider rounded-md flex items-center justify-center gap-1.5 transition-colors"
                >
                  Launch Workspace <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* ── SECTION 9: FINAL CTA ── */}
      <section className="py-28 bg-[#0b0e11] border-t border-[#2b3139] relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-[#fcd535]/3 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
          <span className="text-[10px] font-extrabold text-[#fcd535] uppercase tracking-[0.2em] block">Ready to Begin</span>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            FORGE-PATH
          </h2>
          <p className="text-sm text-[#707a8a] font-bold uppercase tracking-widest">
            Enterprise Financial Operating System
          </p>
          <p className="text-xs md:text-sm text-[#707a8a] max-w-md mx-auto leading-relaxed">
            One Platform. Every Financial Workflow. Eliminate fragmentation, secure your ledgers, and automate solvency forecasting.
          </p>
          <div className="pt-4">
            <Link
              href="/login"
              className="inline-flex h-12 px-8 bg-[#fcd535] hover:bg-[#e2be28] text-[#181a20] font-extrabold text-xs uppercase tracking-wider rounded-md items-center justify-center gap-2 shadow-lg shadow-[#fcd535]/15 transition-all"
            >
              Launch Workspace <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <StatsAndFooter />
    </main>
  );
}
