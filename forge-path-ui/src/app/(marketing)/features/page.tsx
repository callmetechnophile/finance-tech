"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FileScan, Bot, TrendingUp, Wallet, Users, Landmark,
  LayoutDashboard, BarChart, Sparkles, ScanText, FileText,
  ShieldCheck, Cloud, Database, BrainCircuit, Activity,
  ArrowRight, CheckCircle2, ChevronRight, Play,
  Zap, Lock, Globe, Server, Code2
} from "lucide-react";

// ─── Animation helpers ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-[#fcd535] uppercase tracking-[0.18em] mb-3">
      <span className="w-4 h-px bg-[#fcd535]" />
      {text}
      <span className="w-4 h-px bg-[#fcd535]" />
    </span>
  );
}

// ─── Feature illustration primitives ─────────────────────────────────────────
function IllustrationPanel({ type }: { type: string }) {
  const panels: Record<string, React.ReactNode> = {
    ocr: (
      <div className="relative w-full h-56 bg-[#1e2329] rounded-xl border border-[#2b3139] overflow-hidden p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-[#f6465d]" />
          <div className="w-2 h-2 rounded-full bg-[#fcd535]" />
          <div className="w-2 h-2 rounded-full bg-[#0ecb81]" />
          <span className="ml-2 text-[10px] text-[#707a8a] font-mono">document-pipeline.ts</span>
        </div>
        {[
          { label: "Invoice_Q3.pdf", status: "Extracted", color: "#0ecb81", w: "72%" },
          { label: "BankStatement_Oct.pdf", status: "Processing...", color: "#fcd535", w: "45%" },
          { label: "PO_8821.png", status: "Queued", color: "#707a8a", w: "20%" },
        ].map((f, i) => (
          <motion.div key={i} className="flex items-center gap-3 bg-[#2b3139] rounded-lg px-3 py-2"
            initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.15 }}>
            <FileScan className="w-3.5 h-3.5 flex-shrink-0" style={{ color: f.color }} />
            <span className="text-[11px] text-[#eaecef] flex-1 truncate">{f.label}</span>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 bg-[#0b0e11] rounded-full w-20 overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ backgroundColor: f.color, width: f.w }}
                  initial={{ width: 0 }} animate={{ width: f.w }} transition={{ delay: 0.5 + i * 0.2, duration: 0.8 }} />
              </div>
              <span className="text-[9px] font-semibold" style={{ color: f.color }}>{f.status}</span>
            </div>
          </motion.div>
        ))}
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-[#fcd535]/10 border border-[#fcd535]/30 rounded-full px-2.5 py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#0ecb81] animate-pulse" />
          <span className="text-[9px] font-bold text-[#fcd535]">Gemma 4 Active</span>
        </div>
      </div>
    ),
    copilot: (
      <div className="relative w-full h-56 bg-[#1e2329] rounded-xl border border-[#2b3139] overflow-hidden p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-1 border-b border-[#2b3139] pb-2">
          <div className="w-6 h-6 rounded-full bg-[#fcd535] flex items-center justify-center">
            <Bot className="w-3.5 h-3.5 text-[#181a20]" />
          </div>
          <span className="text-[11px] font-bold text-[#fcd535]">GEMMA Financial Copilot</span>
          <div className="ml-auto flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#0ecb81] animate-pulse" /><span className="text-[9px] text-[#0ecb81]">Online</span></div>
        </div>
        {[
          { role: "user", text: "What's our 30-day cash runway?" },
          { role: "ai", text: "Based on current burn rate of ₹42K/month and ₹2.84L in verified receivables, runway is 68 days. ⚠️ 3 invoices totaling ₹87K are 30+ days overdue." },
        ].map((m, i) => (
          <motion.div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.4 }}>
            <div className={`max-w-[85%] px-3 py-2 rounded-xl text-[10px] leading-relaxed ${m.role === "user" ? "bg-[#fcd535] text-[#181a20] font-semibold" : "bg-[#2b3139] text-[#eaecef]"}`}>
              {m.text}
            </div>
          </motion.div>
        ))}
        <div className="mt-auto flex items-center gap-2 bg-[#2b3139] rounded-lg px-3 py-2">
          <span className="text-[10px] text-[#707a8a]">Ask about cash flow, forecasts, invoices...</span>
          <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}
            className="w-0.5 h-3 bg-[#fcd535] ml-auto" />
        </div>
      </div>
    ),
    forecast: (
      <div className="relative w-full h-56 bg-[#1e2329] rounded-xl border border-[#2b3139] overflow-hidden p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold text-[#eaecef]">Cash Flow Forecast</span>
          <div className="flex gap-1">
            {["7D", "30D", "90D"].map((t, i) => (
              <span key={t} className={`text-[9px] px-2 py-0.5 rounded font-bold ${i === 1 ? "bg-[#fcd535] text-[#181a20]" : "text-[#707a8a]"}`}>{t}</span>
            ))}
          </div>
        </div>
        <div className="flex items-end gap-1.5 h-28 px-1">
          {[55, 62, 48, 71, 85, 78, 92, 88, 95, 102, 98, 115].map((h, i) => (
            <motion.div key={i} className="flex-1 rounded-sm"
              style={{ backgroundColor: h > 85 ? "#0ecb81" : i >= 8 ? "#fcd535" : "#2b3139", opacity: i >= 8 ? 0.8 : 1 }}
              initial={{ height: 0 }} animate={{ height: `${h}%` }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: "easeOut" }} />
          ))}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[9px] text-[#707a8a]">Historical</span>
          <div className="flex items-center gap-1"><div className="w-3 h-px bg-[#fcd535] border-dashed" /><span className="text-[9px] text-[#fcd535]">AI Forecast</span></div>
        </div>
      </div>
    ),
    liquidity: (
      <div className="w-full h-56 bg-[#1e2329] rounded-xl border border-[#2b3139] p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between"><span className="text-[11px] font-bold text-[#eaecef]">Liquidity Dashboard</span><span className="text-[10px] text-[#0ecb81] font-bold">OPTIMAL</span></div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Liquidity Score", value: "84/100", color: "#0ecb81" },
            { label: "Cash Runway", value: "68 days", color: "#fcd535" },
            { label: "Working Capital", value: "₹2.84L", color: "#eaecef" },
            { label: "Stress Buffer", value: "PASS", color: "#0ecb81" },
          ].map((m, i) => (
            <motion.div key={i} className="bg-[#2b3139] rounded-lg p-2.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.1 }}>
              <div className="text-[9px] text-[#707a8a] mb-0.5">{m.label}</div>
              <div className="text-sm font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
            </motion.div>
          ))}
        </div>
        <div className="bg-[#2b3139] rounded-lg p-2.5 flex items-center gap-2">
          <div className="w-full bg-[#0b0e11] rounded-full h-1.5 overflow-hidden">
            <motion.div className="h-full bg-[#0ecb81] rounded-full" initial={{ width: 0 }} animate={{ width: "84%" }} transition={{ delay: 0.8, duration: 0.8 }} />
          </div>
          <span className="text-[10px] text-[#0ecb81] font-bold whitespace-nowrap">84%</span>
        </div>
      </div>
    ),
    collections: (
      <div className="w-full h-56 bg-[#1e2329] rounded-xl border border-[#2b3139] p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between mb-1"><span className="text-[11px] font-bold text-[#eaecef]">Outstanding Invoices</span><span className="text-[10px] text-[#fcd535] font-bold">12 Clients</span></div>
        {[
          { client: "Acme Corp", amount: "₹47,500", days: "45d", risk: "high" },
          { client: "TechVentures", amount: "₹28,000", days: "32d", risk: "med" },
          { client: "Global Trade", amount: "₹12,800", days: "18d", risk: "low" },
        ].map((inv, i) => (
          <motion.div key={i} className="flex items-center gap-2 bg-[#2b3139] rounded-lg px-3 py-2"
            initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.15 }}>
            <div className={`w-1.5 h-8 rounded-full ${inv.risk === "high" ? "bg-[#f6465d]" : inv.risk === "med" ? "bg-[#fcd535]" : "bg-[#0ecb81]"}`} />
            <div className="flex-1"><div className="text-[10px] font-semibold text-[#eaecef]">{inv.client}</div><div className="text-[9px] text-[#707a8a]">{inv.days} overdue</div></div>
            <span className="text-[11px] font-bold text-[#eaecef] font-mono">{inv.amount}</span>
            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${inv.risk === "high" ? "bg-[#f6465d]/20 text-[#f6465d]" : inv.risk === "med" ? "bg-[#fcd535]/20 text-[#fcd535]" : "bg-[#0ecb81]/20 text-[#0ecb81]"}`}>
              {inv.risk.toUpperCase()}
            </span>
          </motion.div>
        ))}
      </div>
    ),
    treasury: (
      <div className="w-full h-56 bg-[#1e2329] rounded-xl border border-[#2b3139] p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between mb-1"><span className="text-[11px] font-bold text-[#eaecef]">Treasury Operations</span><span className="text-[9px] text-[#0ecb81] bg-[#0ecb81]/10 px-2 py-0.5 rounded-full font-bold">3 Pending</span></div>
        {[
          { name: "Payroll — Nov", amount: "₹84,200", status: "Approved", color: "#0ecb81" },
          { name: "Vendor AWS", amount: "₹4,100", status: "Pending", color: "#fcd535" },
          { name: "Office Rent", amount: "₹12,000", status: "Review", color: "#f6465d" },
        ].map((t, i) => (
          <motion.div key={i} className="flex items-center gap-3 bg-[#2b3139] rounded-lg px-3 py-2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.12 }}>
            <Landmark className="w-3.5 h-3.5 text-[#707a8a] flex-shrink-0" />
            <div className="flex-1"><div className="text-[10px] font-semibold text-[#eaecef]">{t.name}</div></div>
            <span className="text-[10px] font-bold font-mono text-[#eaecef]">{t.amount}</span>
            <span className="text-[9px] font-bold" style={{ color: t.color }}>{t.status}</span>
          </motion.div>
        ))}
        <div className="mt-auto flex items-center gap-2">
          <div className="flex-1 bg-[#2b3139] rounded-lg px-3 py-1.5 text-[9px] text-[#707a8a]">Total outflow this month</div>
          <span className="text-[11px] font-bold text-[#fcd535] font-mono">₹1,00,300</span>
        </div>
      </div>
    ),
    dashboard: (
      <div className="w-full h-56 bg-[#1e2329] rounded-xl border border-[#2b3139] p-4 flex flex-col gap-2">
        <div className="text-[10px] text-[#707a8a] font-bold uppercase tracking-widest mb-1">Executive Dashboard</div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Revenue", value: "₹1.2Cr", delta: "+12%", up: true },
            { label: "Margin", value: "34%", delta: "+3%", up: true },
            { label: "Burn", value: "₹42K", delta: "-8%", up: false },
          ].map((k, i) => (
            <motion.div key={i} className="bg-[#2b3139] rounded-lg p-2" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15 + i * 0.1 }}>
              <div className="text-[8px] text-[#707a8a]">{k.label}</div>
              <div className="text-sm font-bold font-mono text-white">{k.value}</div>
              <div className={`text-[9px] font-bold ${k.up ? "text-[#0ecb81]" : "text-[#f6465d]"}`}>{k.delta}</div>
            </motion.div>
          ))}
        </div>
        <div className="flex items-end gap-1 h-14 mt-1">
          {[40, 55, 48, 70, 62, 85, 78, 92].map((h, i) => (
            <motion.div key={i} className="flex-1 bg-[#fcd535]/80 rounded-sm" initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }} />
          ))}
        </div>
      </div>
    ),
    analytics: (
      <div className="w-full h-56 bg-[#1e2329] rounded-xl border border-[#2b3139] p-4 flex flex-col gap-2">
        <div className="flex justify-between items-center mb-1"><span className="text-[11px] font-bold text-white">Business Analytics</span><span className="text-[9px] text-[#0ecb81]">Live</span></div>
        <div className="flex gap-2 mb-2">
          {["Revenue", "Costs", "Profit"].map((l, i) => <span key={l} className={`text-[9px] px-2 py-0.5 rounded font-bold ${i === 0 ? "bg-[#fcd535] text-[#181a20]" : "text-[#707a8a]"}`}>{l}</span>)}
        </div>
        <div className="flex-1 relative">
          <svg viewBox="0 0 200 60" className="w-full h-full" preserveAspectRatio="none">
            <motion.path d="M0,50 C20,45 40,20 60,30 S100,10 120,20 S160,5 200,15" stroke="#fcd535" strokeWidth="2" fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }} />
            <motion.path d="M0,55 C20,52 40,40 60,45 S100,35 120,40 S160,30 200,38" stroke="#2b3139" strokeWidth="1.5" fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }} />
          </svg>
        </div>
        <div className="flex gap-4">
          <div><div className="text-[9px] text-[#707a8a]">YTD Revenue</div><div className="text-[11px] font-bold text-[#fcd535] font-mono">₹1.24Cr</div></div>
          <div><div className="text-[9px] text-[#707a8a]">YoY Growth</div><div className="text-[11px] font-bold text-[#0ecb81] font-mono">+34%</div></div>
        </div>
      </div>
    ),
  };
  return <>{panels[type] ?? panels.generic}</>;
}

// Reusable FeatureCard Component
interface FeatureCardProps {
  id: number;
  icon: any;
  label: string;
  illustration: string;
  title: string;
  desc: string;
  benefits: string[];
  cta: string;
  isEven: boolean;
}

function FeatureCard({ icon: Icon, label, illustration, title, desc, benefits, cta, isEven }: FeatureCardProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isEven ? "" : "lg:[&>*:first-child]:order-2"}`}>
      {/* Illustration */}
      <div className="relative">
        <div className="absolute -inset-4 rounded-2xl bg-[#fcd535]/3 blur-2xl pointer-events-none" />
        <div className="relative">
          <IllustrationPanel type={illustration} />
        </div>
      </div>

      {/* Copy */}
      <div className="space-y-5">
        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#1e2329] border border-[#2b3139]">
          <Icon className="w-3.5 h-3.5 text-[#fcd535]" />
          <span className="text-[10px] font-extrabold text-[#fcd535] uppercase tracking-wider">{label}</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-snug">{title}</h3>
        <p className="text-[#848e9c] text-sm leading-relaxed">{desc}</p>
        <ul className="space-y-2">
          {benefits.map(b => (
            <li key={b} className="flex items-center gap-2.5 text-sm text-[#eaecef]">
              <CheckCircle2 className="w-4 h-4 text-[#0ecb81] flex-shrink-0" />
              {b}
            </li>
          ))}
        </ul>
        <Link href="/login"
          className="inline-flex items-center gap-1.5 text-[#fcd535] text-sm font-semibold hover:gap-2.5 transition-all">
          {cta} <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    id: 1, icon: FileScan, label: "Document Intelligence", illustration: "ocr",
    title: "AI-Powered Document Intelligence",
    desc: "Upload invoices, purchase orders, receipts and bank statements. Gemma 4 extracts structured financial information automatically — zero manual entry.",
    benefits: ["Invoice & PO OCR extraction", "Bank statement parsing", "Auto-categorisation", "Duplicate detection"],
    cta: "See OCR in Action",
  },
  {
    id: 2, icon: Bot, label: "AI Financial Copilot", illustration: "copilot",
    title: "Natural Language Financial Copilot",
    desc: "Ask any financial question in plain English. Get explanations, summaries, forecasts and risk alerts — powered by Google Gemma 4.",
    benefits: ["Plain-English queries", "Contextual insights", "Proactive risk alerts", "Multi-turn conversations"],
    cta: "Try Copilot",
  },
  {
    id: 3, icon: TrendingUp, label: "Cash Flow Forecasting", illustration: "forecast",
    title: "Intelligent Cash Flow Forecasting",
    desc: "Generate 7-day, 30-day and 90-day cash flow predictions using AI. Understand burn rate, receivables risk and capital needs before they become problems.",
    benefits: ["7 / 30 / 90-day horizons", "AI-adjusted predictions", "Scenario modeling", "Variance tracking"],
    cta: "View Forecasting",
  },
  {
    id: 4, icon: Wallet, label: "Liquidity Intelligence", illustration: "liquidity",
    title: "Real-Time Liquidity Intelligence",
    desc: "Monitor runway, working capital and liquidity score live. Run stress scenarios and get proactive alerts when thresholds are breached.",
    benefits: ["Liquidity score (0-100)", "Runway tracking", "Stress test scenarios", "Auto alerts"],
    cta: "Explore Liquidity",
  },
  {
    id: 5, icon: Users, label: "Collections Center", illustration: "collections",
    title: "Smart Collections Operations",
    desc: "Track outstanding invoices, prioritize high-risk accounts and automate follow-up workflows — so your team focuses on relationships, not spreadsheets.",
    benefits: ["AR aging dashboard", "Risk-ranked priorities", "Automated follow-ups", "Collection analytics"],
    cta: "See Collections",
  },
  {
    id: 6, icon: Landmark, label: "Treasury Operations", illustration: "treasury",
    title: "Treasury Workflow Management",
    desc: "Manage approvals, bank accounts, outgoing payments and treasury workflows from a single command center.",
    benefits: ["Multi-bank aggregation", "Payment approvals", "Treasury controls", "Audit trail"],
    cta: "View Treasury",
  },
  {
    id: 7, icon: LayoutDashboard, label: "Executive Dashboard", illustration: "dashboard",
    title: "CFO-Grade Executive Dashboard",
    desc: "Real-time KPIs built for CFOs and business owners. All your financial health indicators on one screen — no BI tool required.",
    benefits: ["Live KPI monitoring", "Custom widget grid", "Role-based views", "Export-ready"],
    cta: "See Dashboard",
  },
  {
    id: 8, icon: BarChart, label: "Business Analytics", illustration: "analytics",
    title: "Deep Business Analytics",
    desc: "Understand trends, profitability and financial performance with interactive charts, drilldowns and AI-generated commentary.",
    benefits: ["Revenue & cost trends", "Profitability analysis", "Drilldown explorer", "AI commentary"],
    cta: "Explore Analytics",
  },
];

const INFRA_FEATURES = [
  { icon: Sparkles, label: "Executive AI Brief", desc: "Daily AI-generated executive summaries highlighting risks and opportunities." },
  { icon: ScanText, label: "OCR Engine", desc: "Extract structured financial data from PDFs and scanned invoices with 98%+ accuracy." },
  { icon: FileText, label: "Executive Reports", desc: "Generate PDF, Excel and CSV reports in seconds, not hours." },
  { icon: ShieldCheck, label: "Authentication", desc: "Enterprise authentication powered by Clerk with SSO and MFA support." },
  { icon: Cloud, label: "Cloud Storage", desc: "Secure document storage powered by Supabase Storage with CDN delivery." },
  { icon: Database, label: "PostgreSQL Database", desc: "Financial records stored reliably in Neon PostgreSQL with automatic backups." },
  { icon: BrainCircuit, label: "AI Infrastructure", desc: "Google AI Studio with Gemma 4 provides intelligent financial reasoning at scale." },
  { icon: Activity, label: "Analytics Engine", desc: "ClickHouse powers enterprise-scale analytical queries across millions of records." },
];

const WORKFLOW_STEPS = [
  { step: "01", label: "Upload Documents", sub: "Invoices, POs, Statements" },
  { step: "02", label: "OCR Extraction", sub: "Gemma reads every field" },
  { step: "03", label: "AI Analysis", sub: "Gemma 4 reasoning" },
  { step: "04", label: "Financial Intelligence", sub: "Insights generated" },
  { step: "05", label: "Neon PostgreSQL", sub: "Secure data storage" },
  { step: "06", label: "Dashboard", sub: "Live KPI view" },
  { step: "07", label: "Forecast", sub: "Predictive analytics" },
  { step: "08", label: "Copilot", sub: "Natural language Q&A" },
  { step: "09", label: "Reports", sub: "PDF / Excel / CSV" },
];

const TECH_STACK = [
  { name: "Next.js 16", role: "React framework with App Router, SSR and Turbopack", color: "#eaecef" },
  { name: "FastAPI", role: "High-performance Python API backend with async support", color: "#0ecb81" },
  { name: "Google AI Studio", role: "API gateway to Gemma 4 for financial reasoning tasks", color: "#fcd535" },
  { name: "Gemma 4", role: "Google's flagship language model for financial intelligence", color: "#fcd535" },
  { name: "Clerk", role: "Enterprise authentication with SSO, MFA and org management", color: "#7c3aed" },
  { name: "Supabase", role: "Managed Postgres + object storage for documents and files", color: "#0ecb81" },
  { name: "Neon PostgreSQL", role: "Serverless Postgres for financial records at any scale", color: "#2dbdb6" },
  { name: "ClickHouse", role: "Column-store OLAP engine for real-time financial analytics", color: "#f6465d" },
  { name: "Framer Motion", role: "Production-ready motion library for premium animations", color: "#eaecef" },
];

const COMPARISON = [
  { traditional: "Manual data entry", forge: "OCR automation — zero entry" },
  { traditional: "Spreadsheet forecasts", forge: "AI-generated predictions" },
  { traditional: "Static monthly reports", forge: "Live AI insights & alerts" },
  { traditional: "Multiple disconnected tools", forge: "Unified financial workspace" },
  { traditional: "Historical data analysis", forge: "Predictive intelligence" },
  { traditional: "Days to compile reports", forge: "Instant PDF / Excel export" },
];

const METRICS = [
  { value: "95%", label: "Forecast Accuracy", sub: "vs. 60% industry average" },
  { value: "99.9%", label: "Availability", sub: "Neon + Vercel edge uptime" },
  { value: "70%", label: "Manual Work Reduced", sub: "Via OCR automation" },
  { value: "40%", label: "Collection Improvement", sub: "With AI prioritization" },
];

const SECURITY_ITEMS = [
  { icon: ShieldCheck, label: "Enterprise Authentication", desc: "Clerk SSO, MFA, and org-level access control" },
  { icon: Lock, label: "Data Encryption", desc: "AES-256 at rest, TLS 1.3 in transit" },
  { icon: Globe, label: "Role-Based Access", desc: "Granular permissions per module and user" },
  { icon: Server, label: "Session Management", desc: "Token rotation, revocation and audit logs" },
  { icon: Cloud, label: "Secure Cloud Storage", desc: "Supabase Storage with presigned URL delivery" },
  { icon: Code2, label: "Open Audit Trail", desc: "Every action logged and reviewable" },
];

export default function FeaturesPage() {
  const [hoveredTech, setHoveredTech] = useState<number | null>(null);

  return (
    <div className="w-full">
      {/* 1. HERO */}
      <section className="relative min-h-screen bg-[#0b0e11] flex flex-col justify-center items-center overflow-hidden px-6 lg:px-12 pt-32 pb-20">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
        <motion.div animate={{ scale: [1, 1.1, 1], x: [0, 30, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-5%] left-[-5%] w-[55vw] h-[55vh] rounded-full bg-[#fcd535]/4 blur-[180px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1e2329] border border-[#2b3139]">
                <div className="w-4 h-4 rounded bg-[#fcd535] flex items-center justify-center"><Zap className="w-2.5 h-2.5 text-[#181a20]" /></div>
                <span className="text-[10px] font-extrabold text-[#fcd535] uppercase tracking-wider">16 Enterprise Features</span>
              </div>
            </Reveal>

            <Reveal delay={1}>
              <h1 className="text-white text-4xl md:text-5xl lg:text-[56px] font-extrabold tracking-tight leading-[1.08]">
                Everything<br />
                FORGE‑PATH<br />
                <span className="text-[#fcd535]">Can Do.</span>
              </h1>
            </Reveal>

            <Reveal delay={2}>
              <p className="text-[#848e9c] text-base leading-relaxed max-w-lg">
                A unified AI-powered Financial Operating System that automates document intelligence, forecasting, treasury, analytics, collections and executive reporting.
              </p>
            </Reveal>

            <Reveal delay={3}>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/login"
                  className="h-10 px-6 rounded-md bg-[#fcd535] hover:bg-[#f0b90b] text-[#181a20] font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-[#fcd535]/10">
                  Launch Workspace <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/#interactive-demo" className="h-10 px-6 rounded-md bg-[#1e2329] hover:bg-[#2b3139] text-white border border-[#2b3139] font-semibold text-sm transition-all flex items-center gap-2">
                  <Play className="w-4 h-4 text-[#fcd535]" /> Watch Demo
                </Link>
              </div>
            </Reveal>

            <Reveal delay={4}>
              <div className="flex gap-8 pt-4 border-t border-[#2b3139]">
                {[["16", "Features"], ["AI", "Powered"], ["99.9%", "Uptime"]].map(([v, l]) => (
                  <div key={l}>
                    <div className="text-xl font-extrabold text-[#fcd535] font-mono">{v}</div>
                    <div className="text-[10px] text-[#707a8a] font-semibold uppercase tracking-wider">{l}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <Reveal delay={2}>
              <div className="relative grid grid-cols-2 gap-3">
                <div className="col-span-2 bg-[#1e2329] rounded-xl border border-[#2b3139] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-[#eaecef]">FORGE-PATH · Feature Overview</span>
                    <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#0ecb81] animate-pulse" /><span className="text-[9px] text-[#0ecb81]">Live</span></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { l: "Documents", v: "284", c: "#fcd535" }, { l: "Forecast Acc.", v: "95%", c: "#0ecb81" }, { l: "Runway", v: "68d", c: "#eaecef" },
                    ].map(m => (
                      <div key={m.l} className="bg-[#2b3139] rounded-lg p-2.5">
                        <div className="text-[9px] text-[#707a8a]">{m.l}</div>
                        <div className="text-sm font-extrabold font-mono" style={{ color: m.c }}>{m.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#1e2329] rounded-xl border border-[#2b3139] p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-5 h-5 rounded-full bg-[#fcd535] flex items-center justify-center"><Bot className="w-3 h-3 text-[#181a20]" /></div>
                    <span className="text-[9px] font-bold text-[#fcd535]">Copilot</span>
                  </div>
                  <div className="text-[9px] text-[#eaecef] bg-[#2b3139] rounded-lg p-2 leading-relaxed">
                    "Runway is 68 days. 3 invoices at risk — recommend follow-up."
                  </div>
                </div>
                <div className="bg-[#1e2329] rounded-xl border border-[#2b3139] p-3">
                  <div className="text-[9px] text-[#707a8a] mb-2">30D Forecast</div>
                  <div className="flex items-end gap-0.5 h-10">
                    {[40, 55, 48, 70, 62, 85, 78, 92].map((h, i) => (
                      <motion.div key={i} className="flex-1 rounded-sm bg-[#fcd535]/70"
                        initial={{ height: 0 }} animate={{ height: `${h}%` }}
                        transition={{ delay: 0.2 + i * 0.06, duration: 0.4 }} />
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2. ALTERNATING FEATURE SHOWCASE */}
      <section className="py-20 px-6 lg:px-12 border-t border-[#2b3139]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <SectionLabel text="Core Capabilities" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Built for Enterprise Finance</h2>
              <p className="text-[#848e9c] mt-3 max-w-xl mx-auto text-sm">Every feature is purpose-built for SME financial operations — not adapted from generic SaaS tools.</p>
            </div>
          </Reveal>

          <div className="space-y-24">
            {FEATURES.map((feat, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <Reveal key={feat.id} delay={0}>
                  <FeatureCard {...feat} isEven={isEven} />
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. INFRASTRUCTURE FEATURES GRID */}
      <section className="py-20 px-6 lg:px-12 border-t border-[#2b3139] bg-[#0b0e11]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <SectionLabel text="Infrastructure" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Enterprise-Grade Infrastructure</h2>
              <p className="text-[#848e9c] mt-3 max-w-xl mx-auto text-sm">AI capabilities, cloud storage, authentication and analytics — all under one roof.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INFRA_FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.label} delay={i * 0.05}>
                  <motion.div
                    whileHover={{ y: -4, borderColor: "#fcd535" }}
                    className="group bg-[#1e2329] border border-[#2b3139] rounded-xl p-5 cursor-default transition-colors duration-200"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#fcd535]/10 border border-[#fcd535]/20 flex items-center justify-center mb-4 group-hover:bg-[#fcd535]/20 transition-colors">
                      <Icon className="w-4.5 h-4.5 text-[#fcd535]" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1.5">{f.label}</h4>
                    <p className="text-[11px] text-[#707a8a] leading-relaxed">{f.desc}</p>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. WORKFLOW */}
      <section className="py-20 px-6 lg:px-12 border-t border-[#2b3139]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <SectionLabel text="How It Works" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Complete AI Workflow</h2>
              <p className="text-[#848e9c] mt-3 text-sm max-w-lg mx-auto">From raw document upload to executive-ready intelligence — in seconds.</p>
            </div>
          </Reveal>

          <div className="relative">
            <div className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2b3139] to-transparent" />
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-4">
              {WORKFLOW_STEPS.map((s, i) => (
                <Reveal key={s.step} delay={i * 0.08}>
                  <div className="flex flex-col items-center text-center gap-2">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="relative w-14 h-14 rounded-full bg-[#1e2329] border-2 border-[#2b3139] flex items-center justify-center text-[11px] font-extrabold text-[#fcd535] z-10 hover:border-[#fcd535] transition-colors"
                    >
                      {s.step}
                      {i < WORKFLOW_STEPS.length - 1 && (
                        <div className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 w-4 h-px bg-[#2b3139]" />
                      )}
                    </motion.div>
                    <div className="text-[10px] font-bold text-[#eaecef] leading-tight">{s.label}</div>
                    <div className="text-[9px] text-[#707a8a]">{s.sub}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY FORGE-PATH — COMPARISON TABLE */}
      <section className="py-20 px-6 lg:px-12 border-t border-[#2b3139] bg-[#0b0e11]">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <SectionLabel text="Why FORGE-PATH" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Old Tools vs. FORGE-PATH</h2>
              <p className="text-[#848e9c] mt-3 text-sm">The finance industry hasn't changed. Until now.</p>
            </div>
          </Reveal>

          <div className="bg-[#1e2329] rounded-xl border border-[#2b3139] overflow-hidden">
            <div className="grid grid-cols-2 border-b border-[#2b3139]">
              <div className="px-6 py-4 text-[11px] font-bold text-[#707a8a] uppercase tracking-widest">Traditional Software</div>
              <div className="px-6 py-4 text-[11px] font-bold text-[#fcd535] uppercase tracking-widest bg-[#fcd535]/5 border-l border-[#2b3139]">FORGE-PATH</div>
            </div>
            {COMPARISON.map((row, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className={`grid grid-cols-2 ${i < COMPARISON.length - 1 ? "border-b border-[#2b3139]" : ""}`}>
                  <div className="px-6 py-4 flex items-center gap-2.5 text-sm text-[#707a8a]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f6465d] flex-shrink-0" />
                    {row.traditional}
                  </div>
                  <div className="px-6 py-4 flex items-center gap-2.5 text-sm text-[#eaecef] bg-[#fcd535]/5 border-l border-[#2b3139]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0ecb81] flex-shrink-0" />
                    {row.forge}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TECHNOLOGY STACK */}
      <section className="py-20 px-6 lg:px-12 border-t border-[#2b3139]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <SectionLabel text="Technology" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Powered by Best-in-Class Stack</h2>
              <p className="text-[#848e9c] mt-3 text-sm max-w-lg mx-auto">Hover over any technology to learn its role in FORGE-PATH.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {TECH_STACK.map((tech, i) => (
              <Reveal key={tech.name} delay={i * 0.04}>
                <motion.div
                  onHoverStart={() => setHoveredTech(i)}
                  onHoverEnd={() => setHoveredTech(null)}
                  whileHover={{ y: -6 }}
                  className="relative group bg-[#1e2329] border border-[#2b3139] hover:border-[#fcd535]/40 rounded-xl p-4 cursor-default transition-colors duration-200"
                >
                  <div className="text-sm font-bold text-white mb-1">{tech.name}</div>
                  <motion.div
                    initial={false}
                    animate={{ opacity: hoveredTech === i ? 1 : 0, y: hoveredTech === i ? 0 : 4 }}
                    transition={{ duration: 0.2 }}
                    className="text-[10px] text-[#848e9c] leading-relaxed"
                  >
                    {tech.role}
                  </motion.div>
                  {hoveredTech !== i && (
                    <div className="text-[10px] text-[#707a8a]">Hover to learn more</div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: tech.color }} />
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SECURITY */}
      <section className="py-20 px-6 lg:px-12 border-t border-[#2b3139] bg-[#0b0e11]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div className="space-y-5">
                <SectionLabel text="Security" />
                <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-snug">Enterprise Security.<br />By Default.</h2>
                <p className="text-[#848e9c] text-sm leading-relaxed">
                  FORGE-PATH is built on a zero-trust architecture. Every request is authenticated, encrypted and audited. Financial data never leaves your control.
                </p>
                <Link href="/login"
                  className="inline-flex items-center gap-2 h-10 px-6 rounded-md bg-[#fcd535] hover:bg-[#f0b90b] text-[#181a20] font-bold text-sm transition-all">
                  Launch Workspace <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SECURITY_ITEMS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <Reveal key={s.label} delay={i * 0.06}>
                    <motion.div whileHover={{ borderColor: "#fcd535" }} transition={{ duration: 0.2 }}
                      className="bg-[#1e2329] border border-[#2b3139] rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#fcd535]/10 border border-[#fcd535]/20 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-[#fcd535]" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white mb-0.5">{s.label}</div>
                          <div className="text-[11px] text-[#707a8a] leading-relaxed">{s.desc}</div>
                        </div>
                      </div>
                    </motion.div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 8. PERFORMANCE METRICS */}
      <section className="py-20 px-6 lg:px-12 border-t border-[#2b3139]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <SectionLabel text="Performance" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Numbers That Matter</h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {METRICS.map((m, i) => (
              <Reveal key={m.label} delay={i * 0.08}>
                <motion.div whileHover={{ y: -4 }}
                  className="bg-[#1e2329] border border-[#2b3139] rounded-xl p-6 text-center">
                  <motion.div
                    className="text-4xl md:text-5xl font-extrabold text-[#fcd535] font-mono mb-2"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    {m.value}
                  </motion.div>
                  <div className="text-sm font-bold text-white mb-1">{m.label}</div>
                  <div className="text-[11px] text-[#707a8a]">{m.sub}</div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA BAND */}
      <section className="py-20 px-6 lg:px-12 border-t border-[#2b3139] mb-12">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="bg-[#1e2329] border border-[#2b3139] rounded-2xl p-10 md:p-14 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[#fcd535]/3 pointer-events-none" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#fcd535]/5 blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-5">
                <SectionLabel text="Get Started" />
                <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                  Ready to modernize<br />your finance operations?
                </h2>
                <p className="text-[#848e9c] text-sm max-w-md mx-auto">
                  Join forward-thinking CFOs who have replaced spreadsheets, legacy ERP and disconnected tools with FORGE-PATH.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <Link href="/login"
                    className="h-11 px-8 rounded-md bg-[#fcd535] hover:bg-[#f0b90b] text-[#181a20] font-bold text-sm transition-all flex items-center gap-2 shadow-xl shadow-[#fcd535]/20">
                    Launch Workspace <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/architecture"
                    className="h-11 px-6 rounded-md bg-[#2b3139] hover:bg-[#3a4049] text-white border border-[#3a4049] font-semibold text-sm transition-all flex items-center gap-2">
                    View Architecture <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link href="/docs"
                    className="h-11 px-6 text-[#fcd535] font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                    Documentation <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
