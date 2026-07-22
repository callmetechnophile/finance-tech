"use client";

import { motion, useInView, animate } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight, ChevronRight, Zap, Globe, Server, Database,
  Shield, Lock, Activity, Cloud, BrainCircuit, FileText,
  TrendingUp, Layers, GitBranch, Terminal, Code2, Cpu,
  BarChart2, CheckCircle2, AlertCircle, Boxes, Network,
  Workflow, ScanText, Bot, Sparkles, HardDrive, Key,
  UserCheck, RefreshCw, ArrowDown
} from "lucide-react";

// ─── Motion variants ──────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

function Reveal({
  children, className = "", delay = 0,
}: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} variants={fadeUp} custom={delay}
      initial="hidden" animate={inView ? "visible" : "hidden"} className={className}>
      {children}
    </motion.div>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-[#fcd535] uppercase tracking-[0.18em] mb-3">
      <span className="w-4 h-px bg-[#fcd535]" />{text}<span className="w-4 h-px bg-[#fcd535]" />
    </span>
  );
}

function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, target, {
      duration: 1.6, ease: "easeOut",
      onUpdate(v) { if (ref.current) ref.current.textContent = prefix + Math.round(v).toLocaleString() + suffix; },
    });
    return controls.stop;
  }, [inView, target, suffix, prefix]);
  return <span ref={ref}>{prefix}0{suffix}</span>;
}

function PipelineNode({
  icon: Icon, label, sub, color = "#fcd535", active = false, delay = 0,
}: { icon: React.ElementType; label: string; sub?: string; color?: string; active?: boolean; delay?: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Reveal delay={delay}>
      <div className="flex flex-col items-center">
        <motion.div
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          whileHover={{ scale: 1.08 }}
          className={`relative w-16 h-16 rounded-2xl border-2 flex items-center justify-center cursor-pointer transition-all duration-200 z-10
            ${active ? "bg-[#fcd535]/10 border-[#fcd535]" : "bg-[#1e2329] border-[#2b3139] hover:border-[#fcd535]/60"}`}
        >
          <Icon className="w-6 h-6" style={{ color: active ? "#fcd535" : hovered ? color : "#707a8a" }} />
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#0b0e11] border border-[#2b3139] rounded-lg px-3 py-1.5 text-[10px] font-semibold text-[#eaecef] shadow-xl z-50"
            >
              {sub || label}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0b0e11] border-r border-b border-[#2b3139] rotate-45" />
            </motion.div>
          )}
        </motion.div>
        <div className="text-[11px] font-bold text-[#eaecef] mt-2 text-center leading-tight">{label}</div>
      </div>
    </Reveal>
  );
}

function PipelineConnector({ delay = 0 }: { delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="flex flex-col items-center my-1">
      <motion.div
        initial={{ scaleY: 0 }} animate={inView ? { scaleY: 1 } : {}}
        transition={{ duration: 0.4, delay, ease: "easeOut" }}
        className="w-px h-8 bg-gradient-to-b from-[#fcd535]/40 to-[#2b3139] origin-top"
      />
      <motion.div
        initial={{ opacity: 0, y: -4 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.3, delay: delay + 0.3 }}
        className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#fcd535]/40"
      />
    </div>
  );
}

function ArchNode({
  icon: Icon, label, desc, color = "#fcd535", badge,
}: { icon: React.ElementType; label: string; desc: string; color?: string; badge?: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -4 }}
      className="relative bg-[#1e2329] border border-[#2b3139] hover:border-[#fcd535]/40 rounded-xl p-4 cursor-default transition-colors duration-200 overflow-hidden"
    >
      {badge && (
        <span className="absolute top-3 right-3 text-[8px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-sm bg-[#fcd535] text-[#181a20]">{badge}</span>
      )}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center border"
          style={{ backgroundColor: `${color}10`, borderColor: `${color}20` }}>
          <Icon className="w-4.5 h-4.5" style={{ color }} />
        </div>
        <div>
          <div className="text-sm font-bold text-white mb-0.5">{label}</div>
          <motion.div className="text-[11px] text-[#707a8a] leading-relaxed"
            animate={{ opacity: hovered ? 1 : 0.7 }}>
            {desc}
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(to right, transparent, ${color}40, transparent)` }} />
    </motion.div>
  );
}

function DBTable({ name, fields, delay = 0 }: { name: string; fields: string[]; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <motion.div whileHover={{ y: -4, borderColor: "#fcd535" }} transition={{ duration: 0.2 }}
        className="bg-[#1e2329] border border-[#2b3139] rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 border-b border-[#2b3139] flex items-center gap-2 bg-[#2b3139]/40">
          <Database className="w-3.5 h-3.5 text-[#fcd535]" />
          <span className="text-[11px] font-extrabold text-[#fcd535] uppercase tracking-wider">{name}</span>
        </div>
        <div className="px-4 py-3 space-y-1.5">
          {fields.map((f, i) => (
            <div key={f} className="flex items-center gap-2 text-[10px]">
              <span className={`w-1 h-1 rounded-full flex-shrink-0 ${i === 0 ? "bg-[#fcd535]" : "bg-[#2b3139]"}`} />
              <span className={`font-mono ${i === 0 ? "text-[#fcd535]" : "text-[#848e9c]"}`}>{f}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </Reveal>
  );
}

function FlowStep({ step, label, sub, color = "#fcd535", delay = 0 }: {
  step: string; label: string; sub?: string; color?: string; delay?: number;
}) {
  return (
    <Reveal delay={delay} className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-[10px] font-extrabold"
        style={{ borderColor: color, color, backgroundColor: `${color}10` }}>{step}</div>
      <div>
        <div className="text-sm font-bold text-white">{label}</div>
        {sub && <div className="text-[10px] text-[#707a8a]">{sub}</div>}
      </div>
    </Reveal>
  );
}

const TECH = [
  { name: "Next.js 16", why: "App Router + Turbopack for sub-second cold starts and server components at the edge.", color: "#eaecef", icon: Globe },
  { name: "FastAPI", why: "Async Python API framework with automatic OpenAPI docs and Pydantic validation.", color: "#0ecb81", icon: Server },
  { name: "Google AI Studio", why: "Managed API gateway to Gemma 4 — no self-hosting ML infrastructure.", color: "#fcd535", icon: BrainCircuit },
  { name: "Gemma 4", why: "Google's frontier model fine-tuned for structured financial reasoning tasks.", color: "#fcd535", icon: Cpu },
  { name: "Clerk", why: "Drop-in auth with SSO, MFA, JWT sessions, org management and webhook events.", color: "#7c3aed", icon: Shield },
  { name: "Supabase", why: "Managed Postgres + S3-compatible storage for document uploads and CDN delivery.", color: "#0ecb81", icon: Cloud },
  { name: "Neon PostgreSQL", why: "Serverless branching Postgres with autoscale — ideal for variable financial workloads.", color: "#2dbdb6", icon: Database },
  { name: "ClickHouse", why: "Column-store OLAP engine capable of scanning 1B+ rows/sec for analytics queries.", color: "#f6465d", icon: BarChart2 },
  { name: "TailwindCSS", why: "Utility-first CSS at build time — zero runtime cost, consistent design tokens.", color: "#38bdf8", icon: Layers },
  { name: "Framer Motion", why: "Production-ready animation library with layout animations, gestures and spring physics.", color: "#eaecef", icon: Activity },
];

const SECURITY = [
  { icon: Shield, label: "Clerk Authentication", desc: "JWT-based sessions with automatic token rotation and SSO support." },
  { icon: Key, label: "Role-Based Access", desc: "Granular org-level permissions — each user sees only what they own." },
  { icon: Lock, label: "Encrypted Storage", desc: "AES-256 at rest via Supabase, TLS 1.3 in transit for all APIs." },
  { icon: UserCheck, label: "JWT Sessions", desc: "Short-lived tokens with automatic refresh and server-side revocation." },
  { icon: Code2, label: "API Validation", desc: "Pydantic schemas enforce strict input validation on every FastAPI endpoint." },
  { icon: FileText, label: "Audit Logging", desc: "Every mutation is timestamped, actor-tagged and stored immutably." },
];

const SCALE_TIERS = [
  { users: "100", label: "Startup", db: "Neon Serverless", api: "Single instance", notes: ["Free tier Neon", "Vercel Hobby", "AI Studio dev key"] },
  { users: "1,000", label: "Growth", db: "Neon Autoscale", api: "2× FastAPI replicas", notes: ["Pro Neon compute", "Vercel Pro", "AI Studio production"] },
  { users: "10,000", label: "Scale", db: "Neon + read replicas", api: "Load-balanced cluster", notes: ["ClickHouse enabled", "Supabase CDN", "Edge functions"] },
  { users: "100,000", label: "Enterprise", db: "Multi-region Neon", api: "Kubernetes orchestration", notes: ["Dedicated ClickHouse", "Global edge delivery", "Dedicated AI quota"] },
];

const PERF_METRICS = [
  { value: 150, suffix: "ms", prefix: "<", label: "Dashboard Response", sub: "p95 server latency" },
  { value: 95, suffix: "%", prefix: "", label: "Forecast Accuracy", sub: "vs 60% industry avg" },
  { value: 99.9, suffix: "%", prefix: "", label: "Availability", sub: "Vercel + Neon SLA" },
  { value: 1000000, suffix: "+", prefix: "", label: "Transactions Supported", sub: "Single Neon instance" },
];

export default function ArchitecturePage() {
  const [hoveredTech, setHoveredTech] = useState<number | null>(null);

  return (
    <div className="w-full">
      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden px-6 lg:px-12 pt-32 pb-20 bg-[#0b0e11]">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
        <motion.div animate={{ scale: [1, 1.12, 1], x: [0, 40, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-5%] right-[-5%] w-[50vw] h-[50vh] rounded-full bg-[#fcd535]/3 blur-[180px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1e2329] border border-[#2b3139]">
                <div className="w-4 h-4 rounded bg-[#fcd535] flex items-center justify-center"><Zap className="w-2.5 h-2.5 text-[#181a20]" /></div>
                <span className="text-[10px] font-extrabold text-[#fcd535] uppercase tracking-wider">System Architecture</span>
              </div>
            </Reveal>

            <Reveal delay={1}>
              <h1 className="text-white text-4xl md:text-5xl lg:text-[56px] font-extrabold tracking-tight leading-[1.08]">
                Built for Scale.<br />
                <span className="text-[#fcd535]">Engineered for</span><br />
                Intelligence.
              </h1>
            </Reveal>

            <Reveal delay={2}>
              <p className="text-[#848e9c] text-base leading-relaxed max-w-lg">
                Discover how FORGE-PATH combines AI, cloud infrastructure and enterprise-grade financial workflows into a unified Financial Operating System.
              </p>
            </Reveal>

            <Reveal delay={3}>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/features"
                  className="h-10 px-6 rounded-md bg-[#1e2329] hover:bg-[#2b3139] text-white border border-[#2b3139] font-bold text-sm transition-all flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#fcd535]" /> View Features
                </Link>
                <Link href="/login"
                  className="h-10 px-6 rounded-md bg-[#fcd535] hover:bg-[#f0b90b] text-[#181a20] font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-[#fcd535]/10">
                  Launch Workspace <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={4}>
              <div className="flex gap-8 pt-4 border-t border-[#2b3139]">
                {[["15", "Layers"], ["AI", "Native"], ["<150ms", "Response"]].map(([v, l]) => (
                  <div key={l}><div className="text-xl font-extrabold text-[#fcd535] font-mono">{v}</div><div className="text-[10px] text-[#707a8a] font-semibold uppercase tracking-wider">{l}</div></div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <Reveal delay={2}>
              <div className="bg-[#1e2329] border border-[#2b3139] rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 border-b border-[#2b3139] pb-3 mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#f6465d]" /><div className="w-2 h-2 rounded-full bg-[#fcd535]" /><div className="w-2 h-2 rounded-full bg-[#0ecb81]" />
                  <span className="text-[10px] text-[#707a8a] font-mono ml-2">forge-path-architecture.ts</span>
                </div>
                {[
                  { label: "Browser", color: "#eaecef", indent: 0 },
                  { label: "Next.js 16 (App Router)", color: "#eaecef", indent: 1 },
                  { label: "Clerk Auth", color: "#7c3aed", indent: 2 },
                  { label: "FastAPI Backend", color: "#0ecb81", indent: 1 },
                  { label: "Google AI Studio · Gemma 4", color: "#fcd535", indent: 2 },
                  { label: "Neon PostgreSQL", color: "#2dbdb6", indent: 2 },
                  { label: "Supabase Storage", color: "#0ecb81", indent: 2 },
                  { label: "ClickHouse Analytics", color: "#f6465d", indent: 2 },
                ].map((row, i) => (
                  <motion.div key={row.label}
                    initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                    className="flex items-center gap-2 font-mono text-[11px]"
                    style={{ paddingLeft: `${row.indent * 20}px` }}
                  >
                    {row.indent > 0 && <span className="text-[#2b3139]">{"└─"}</span>}
                    <span className="font-bold" style={{ color: row.color }}>{row.label}</span>
                    {i === 4 && <span className="ml-auto text-[9px] bg-[#fcd535]/10 border border-[#fcd535]/30 text-[#fcd535] px-1.5 py-0.5 rounded-sm font-bold">AI</span>}
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* S1 — SYSTEM OVERVIEW */}
      <section className="py-20 px-6 lg:px-12 border-t border-[#2b3139]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-14">
              <SectionLabel text="System Overview" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Full-Stack Architecture</h2>
              <p className="text-[#848e9c] mt-3 text-sm max-w-lg mx-auto">Hover any node to learn its role. Every layer is purpose-built for financial intelligence.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="space-y-3">
              {[
                { icon: Globe, label: "Browser Client", desc: "React 19 with Server Components, streaming SSR and edge delivery via Vercel.", color: "#eaecef" },
                { icon: Shield, label: "Clerk Auth Layer", desc: "JWT sessions, org-based RBAC and webhook event bus for all auth state changes.", color: "#7c3aed" },
                { icon: Server, label: "FastAPI Backend", desc: "Async Python API with Pydantic validation, automatic OpenAPI docs and dependency injection.", color: "#0ecb81", badge: "v0.115" },
              ].map((n, i) => <Reveal key={n.label} delay={i * 0.1}><ArchNode {...n} /></Reveal>)}
            </div>

            <div className="flex flex-col items-center">
              <PipelineNode icon={Globe} label="Browser" sub="React 19 + SSR" active delay={0} />
              <PipelineConnector delay={0.1} />
              <PipelineNode icon={Layers} label="Next.js 16" sub="App Router + Turbopack" delay={0.1} />
              <PipelineConnector delay={0.2} />
              <PipelineNode icon={Shield} label="Clerk" sub="JWT Auth + RBAC" color="#7c3aed" delay={0.2} />
              <PipelineConnector delay={0.3} />
              <PipelineNode icon={Server} label="FastAPI" sub="Async Python API" color="#0ecb81" delay={0.3} />
              <PipelineConnector delay={0.4} />
              <PipelineNode icon={BrainCircuit} label="Gemma 4" sub="AI Reasoning Engine" color="#fcd535" active delay={0.4} />
              <PipelineConnector delay={0.5} />
              <PipelineNode icon={Database} label="Neon PostgreSQL" sub="Serverless Postgres" color="#2dbdb6" delay={0.5} />
              <PipelineConnector delay={0.6} />
              <PipelineNode icon={Cloud} label="Supabase" sub="Object Storage" color="#0ecb81" delay={0.6} />
              <PipelineConnector delay={0.7} />
              <PipelineNode icon={BarChart2} label="ClickHouse" sub="OLAP Analytics" color="#f6465d" delay={0.7} />
              <PipelineConnector delay={0.8} />
              <PipelineNode icon={BarChart2} label="Dashboard" sub="Executive View" delay={0.8} />
            </div>

            <div className="space-y-3">
              {[
                { icon: BrainCircuit, label: "Gemma 4 AI", desc: "Financial reasoning, OCR validation, copilot answers and forecast intelligence.", color: "#fcd535", badge: "AI" },
                { icon: Database, label: "Neon PostgreSQL", desc: "Serverless branching database — scales to zero between workloads, autoscales on demand.", color: "#2dbdb6" },
                { icon: BarChart2, label: "ClickHouse OLAP", desc: "Column-store engine scanning 1B+ rows/sec for real-time analytics and KPI aggregation.", color: "#f6465d" },
              ].map((n, i) => <Reveal key={n.label} delay={i * 0.1}><ArchNode {...n} /></Reveal>)}
            </div>
          </div>
        </div>
      </section>

      {/* S2 — FRONTEND ARCHITECTURE */}
      <section className="py-20 px-6 lg:px-12 border-t border-[#2b3139] bg-[#0b0e11]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <div className="space-y-5">
              <SectionLabel text="Frontend Architecture" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-snug">Next.js 16<br />App Router</h2>
              <p className="text-[#848e9c] text-sm leading-relaxed">
                The UI layer is built on Next.js 16 with the App Router. Server Components handle data fetching and authentication checks — Client Components are used only for interactive widgets, animations and real-time data.
              </p>
              <div className="space-y-3">
                {[
                  { icon: Layers, label: "Server Components", desc: "Zero-bundle data fetching — layouts, nav, auth guards run on the server." },
                  { icon: Activity, label: "Client Components", desc: "Charts, modals, copilot chat and animated dashboards use `'use client'`." },
                  { icon: GitBranch, label: "App Router", desc: "File-system routing with nested layouts, loading states and error boundaries." },
                  { icon: Boxes, label: "Enterprise Shell", desc: "Shared sidebar, header and workspace shell with role-aware navigation." },
                  { icon: Workflow, label: "Framer Motion", desc: "Scroll-triggered, gesture and layout animations across all interactive surfaces." },
                 ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <Reveal key={item.label} delay={i * 0.06}>
                      <div className="flex items-start gap-3 bg-[#1e2329] border border-[#2b3139] rounded-xl p-3">
                        <div className="w-8 h-8 rounded-lg bg-[#fcd535]/10 border border-[#fcd535]/20 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-[#fcd535]" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{item.label}</div>
                          <div className="text-[11px] text-[#707a8a] leading-relaxed">{item.desc}</div>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="bg-[#1e2329] border border-[#2b3139] rounded-2xl p-5 font-mono text-[11px] space-y-1">
              <div className="text-[#707a8a] mb-3">src/app/</div>
              {[
                { d: 0, t: "layout.tsx", c: "#fcd535", note: "ClerkProvider + RootProvider" },
                { d: 1, t: "page.tsx", c: "#eaecef", note: "Landing page" },
                { d: 1, t: "features/page.tsx", c: "#eaecef", note: "Features" },
                { d: 1, t: "architecture/page.tsx", c: "#0ecb81", note: "← You are here" },
                { d: 1, t: "dashboard/page.tsx", c: "#eaecef", note: "Protected" },
                { d: 1, t: "documents/page.tsx", c: "#eaecef", note: "Protected" },
                { d: 1, t: "forecast/page.tsx", c: "#eaecef", note: "Protected" },
                { d: 1, t: "copilot/page.tsx", c: "#eaecef", note: "Protected" },
                { d: 0, t: "src/features/", c: "#2dbdb6", note: "Feature modules" },
                { d: 1, t: "dashboard/", c: "#707a8a", note: "" },
                { d: 1, t: "documents/", c: "#707a8a", note: "" },
                { d: 1, t: "copilot/", c: "#707a8a", note: "" },
                { d: 0, t: "src/shared/", c: "#2dbdb6", note: "Design system" },
                { d: 1, t: "components/", c: "#707a8a", note: "70+ reusable components" },
                { d: 1, t: "hooks/", c: "#707a8a", note: "Custom React hooks" },
              ].map((row, i) => (
                <motion.div key={i} className="flex items-center gap-1"
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.04 }}
                  style={{ paddingLeft: `${row.d * 16}px` }}>
                  {row.d > 0 && <span className="text-[#2b3139]">├─</span>}
                  <span style={{ color: row.c }}>{row.t}</span>
                  {row.note && <span className="text-[#707a8a] ml-2">// {row.note}</span>}
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* S3 — AUTH FLOW */}
      <section className="py-20 px-6 lg:px-12 border-t border-[#2b3139]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <SectionLabel text="Authentication Flow" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Zero-Trust Auth Lifecycle</h2>
              <p className="text-[#848e9c] mt-3 text-sm max-w-lg mx-auto">Every request is authenticated and authorized before touching financial data. No exceptions.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-0">
              {[
                { step: "01", label: "Visitor arrives", sub: "Browser requests any FORGE-PATH URL", color: "#eaecef" },
                { step: "02", label: "Landing Page served", sub: "Public route — no auth required (SSR)", color: "#eaecef" },
                { step: "03", label: "Click 'Launch Workspace'", sub: "User intent to access protected workspace", color: "#fcd535" },
                { step: "04", label: "Clerk Login / SSO", sub: "Hosted Clerk SignIn component handles credentials", color: "#7c3aed" },
                { step: "05", label: "JWT Session issued", sub: "Short-lived access token + refresh token pair", color: "#0ecb81" },
                { step: "06", label: "proxy.ts gate check", sub: "Next.js proxy middleware validates every request", color: "#fcd535" },
                { step: "07", label: "Dashboard rendered", sub: "Protected routes accessible with valid session", color: "#0ecb81" },
              ].map((s, i) => (
                <div key={s.step}>
                  <FlowStep {...s} delay={i * 0.06} />
                  {i < 6 && (
                    <div className="ml-4 flex items-center">
                      <div className="w-px h-5 bg-[#2b3139] ml-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Reveal delay={1}>
              <div className="bg-[#1e2329] border border-[#2b3139] rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 border-b border-[#2b3139] pb-3">
                  <Shield className="w-4 h-4 text-[#7c3aed]" />
                  <span className="text-[11px] font-bold text-[#eaecef]">Clerk · Session Lifecycle</span>
                  <div className="ml-auto flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#0ecb81] animate-pulse" /><span className="text-[9px] text-[#0ecb81]">Active</span></div>
                </div>
                {[
                  { k: "userId", v: "user_2xYz...", c: "#7c3aed" },
                  { k: "orgId", v: "org_forge_demo", c: "#eaecef" },
                  { k: "role", v: "\"admin\"", c: "#fcd535" },
                  { k: "sessionId", v: "sess_abc123...", c: "#2dbdb6" },
                  { k: "exp", v: `${Math.floor(Date.now() / 1000) + 3600}`, c: "#0ecb81" },
                  { k: "iat", v: `${Math.floor(Date.now() / 1000)}`, c: "#848e9c" },
                ].map((row, i) => (
                  <motion.div key={row.k} className="flex items-center gap-3 font-mono text-[11px] bg-[#2b3139] rounded-lg px-3 py-2"
                    initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }}>
                    <span className="text-[#707a8a] w-20 flex-shrink-0">{row.k}</span>
                    <span className="text-[#2b3139]">:</span>
                    <span style={{ color: row.c }}>{row.v}</span>
                  </motion.div>
                ))}
                <div className="pt-2 border-t border-[#2b3139] flex items-center gap-2">
                  <Key className="w-3.5 h-3.5 text-[#0ecb81]" />
                  <span className="text-[10px] text-[#0ecb81] font-semibold">Session valid · Expires in 59m</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* S4 — DOCUMENT PIPELINE */}
      <section className="py-20 px-6 lg:px-12 border-t border-[#2b3139] bg-[#0b0e11]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <SectionLabel text="Document Pipeline" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">OCR → AI → Database</h2>
              <p className="text-[#848e9c] mt-3 text-sm max-w-lg mx-auto">Every uploaded document flows through a multi-stage intelligence pipeline before hitting the database.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { icon: FileText, label: "Upload Invoice", color: "#eaecef", delay: 0 },
              { icon: Cloud, label: "Supabase Storage", color: "#0ecb81", delay: 0.05 },
              { icon: ScanText, label: "OCR Extraction", color: "#fcd535", delay: 0.1 },
              { icon: BrainCircuit, label: "Gemma 4 Validation", color: "#fcd535", delay: 0.15 },
              { icon: Code2, label: "Structured JSON", color: "#2dbdb6", delay: 0.2 },
              { icon: Server, label: "FastAPI", color: "#0ecb81", delay: 0.25 },
              { icon: Database, label: "Neon PostgreSQL", color: "#2dbdb6", delay: 0.3 },
              { icon: BarChart2, label: "Dashboard", color: "#fcd535", delay: 0.35 },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.label} delay={s.delay} className="flex flex-col items-center gap-2">
                  <motion.div whileHover={{ scale: 1.1, borderColor: s.color }}
                    className="w-12 h-12 rounded-xl bg-[#1e2329] border-2 border-[#2b3139] flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5" style={{ color: s.color }} />
                  </motion.div>
                  <div className="text-[9px] font-bold text-[#848e9c] text-center leading-tight">{s.label}</div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.4}>
            <div className="mt-10 bg-[#1e2329] border border-[#2b3139] rounded-xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { title: "Stage 1 · Ingestion", items: ["PDF/PNG/JPEG upload via drag-and-drop", "Chunked multipart upload to Supabase", "Virus scan + MIME validation", "Presigned URL for secure retrieval"] },
                { title: "Stage 2 · AI Extraction", items: ["Gemma 4 reads raw document bytes", "Extracts vendor, amount, date, line items", "Validates against company master data", "Flags anomalies for human review"] },
                { title: "Stage 3 · Persistence", items: ["Structured JSON → FastAPI validation", "Pydantic schema enforcement", "Neon PostgreSQL write with audit trail", "Dashboard updated via server push"] },
              ].map(col => (
                <div key={col.title}>
                  <div className="text-[10px] font-extrabold text-[#fcd535] uppercase tracking-widest mb-3">{col.title}</div>
                  <ul className="space-y-1.5">
                    {col.items.map(item => (
                      <li key={item} className="flex items-start gap-2 text-[11px] text-[#848e9c]">
                        <CheckCircle2 className="w-3 h-3 text-[#0ecb81] mt-0.5 flex-shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* S5 — AI PIPELINE */}
      <section className="py-20 px-6 lg:px-12 border-t border-[#2b3139]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <div className="space-y-5">
              <SectionLabel text="AI Pipeline" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-snug">How Gemma 4<br />Reasons About Finance</h2>
              <p className="text-[#848e9c] text-sm leading-relaxed">
                Every financial query passes through a purpose-built prompt pipeline that injects company context, financial history and domain rules before reaching Gemma 4.
              </p>
              <div className="space-y-0">
                {[
                  { step: "01", label: "Financial Question received", sub: "User query via Copilot or automated trigger", color: "#eaecef" },
                  { step: "02", label: "Prompt Builder", sub: "Domain rules + company context injected", color: "#fcd535" },
                  { step: "03", label: "Context Retrieval", sub: "Relevant invoices, forecasts and KPIs fetched from Neon", color: "#2dbdb6" },
                  { step: "04", label: "Gemma 4 Inference", sub: "Google AI Studio API call with structured prompt", color: "#fcd535" },
                  { step: "05", label: "Reasoning step", sub: "Chain-of-thought over financial data", color: "#fcd535" },
                  { step: "06", label: "Recommendation", sub: "Actionable financial insight returned as JSON", color: "#0ecb81" },
                  { step: "07", label: "Dashboard Response", sub: "Rendered as Copilot answer, alert or report section", color: "#eaecef" },
                ].map((s, i) => (
                  <div key={s.step}>
                    <FlowStep {...s} delay={i * 0.06} />
                    {i < 6 && <div className="ml-4"><div className="w-px h-4 bg-[#2b3139] ml-4" /></div>}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="bg-[#1e2329] border border-[#2b3139] rounded-2xl p-5 font-mono text-[10px] space-y-2">
              <div className="flex items-center gap-2 border-b border-[#2b3139] pb-2 mb-2">
                <Bot className="w-4 h-4 text-[#fcd535]" />
                <span className="text-[11px] font-bold text-[#fcd535]">Gemma 4 · Prompt Builder</span>
              </div>
              {[
                { t: "// System context", c: "#707a8a" },
                { t: "role: 'financial-analyst'", c: "#0ecb81" },
                { t: "company: 'Acme Corp'", c: "#eaecef" },
                { t: "fiscal_year: 2026", c: "#eaecef" },
                { t: "", c: "" },
                { t: "// Injected financial data", c: "#707a8a" },
                { t: "current_cash: '$342,000'", c: "#fcd535" },
                { t: "burn_rate: '$42,000/mo'", c: "#f6465d" },
                { t: "ar_outstanding: '$284,500'", c: "#fcd535" },
                { t: "overdue_invoices: [3]", c: "#f6465d" },
                { t: "", c: "" },
                { t: "// User query", c: "#707a8a" },
                { t: "question: 'What is our", c: "#eaecef" },
                { t: "  30-day cash runway?'", c: "#eaecef" },
                { t: "", c: "" },
                { t: "// Response schema", c: "#707a8a" },
                { t: "format: { answer, risk,", c: "#2dbdb6" },
                { t: "  recommendations[] }", c: "#2dbdb6" },
              ].map((row, i) => (
                <motion.div key={i} style={{ color: row.c || "transparent" }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + i * 0.04 }}>
                  {row.t || <>&nbsp;</>}
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* S6 — DATABASE ARCHITECTURE */}
      <section className="py-20 px-6 lg:px-12 border-t border-[#2b3139] bg-[#0b0e11]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <SectionLabel text="Database Architecture" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Neon PostgreSQL Schema</h2>
              <p className="text-[#848e9c] mt-3 text-sm max-w-lg mx-auto">Relational data model purpose-built for SME financial operations. Every table supports multi-tenancy at the organization level.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <DBTable name="users" fields={["id PK", "clerk_id", "email", "name", "org_id FK", "role", "created_at"]} delay={0} />
            <DBTable name="companies" fields={["id PK", "name", "industry", "fiscal_year", "currency", "owner_id FK"]} delay={0.05} />
            <DBTable name="invoices" fields={["id PK", "company_id FK", "vendor", "amount", "due_date", "status", "ocr_json"]} delay={0.1} />
            <DBTable name="transactions" fields={["id PK", "company_id FK", "type", "amount", "category", "date", "source"]} delay={0.15} />
            <DBTable name="forecasts" fields={["id PK", "company_id FK", "horizon", "predicted", "actual", "model_ver", "created_at"]} delay={0.2} />
            <DBTable name="collections" fields={["id PK", "invoice_id FK", "follow_up_at", "status", "notes", "agent"]} delay={0.25} />
            <DBTable name="treasury" fields={["id PK", "company_id FK", "payee", "amount", "approval_by", "status", "executed_at"]} delay={0.3} />
            <DBTable name="reports" fields={["id PK", "company_id FK", "type", "format", "url", "generated_at"]} delay={0.35} />
            <DBTable name="ai_conversations" fields={["id PK", "user_id FK", "question", "answer", "tokens", "latency_ms", "created_at"]} delay={0.4} />
            <DBTable name="audit_log" fields={["id PK", "actor_id FK", "action", "resource", "diff_json", "ip", "ts"]} delay={0.45} />
          </div>

          <Reveal delay={0.5}>
            <div className="mt-8 flex flex-wrap gap-3 text-[11px] justify-center">
              {[
                { color: "#fcd535", label: "Primary Key" },
                { color: "#2dbdb6", label: "Foreign Key" },
                { color: "#0ecb81", label: "Multi-tenant" },
                { color: "#848e9c", label: "Regular field" },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: l.color }} />
                  <span className="text-[#707a8a]">{l.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* S7 + S8 — SUPABASE + CLICKHOUSE */}
      <section className="py-20 px-6 lg:px-12 border-t border-[#2b3139]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Reveal>
            <div className="bg-[#1e2329] border border-[#2b3139] rounded-2xl p-6 h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-[#0ecb81]/10 border border-[#0ecb81]/20 flex items-center justify-center">
                  <Cloud className="w-4.5 h-4.5 text-[#0ecb81]" />
                </div>
                <div>
                  <SectionLabel text="Section 7" />
                  <h3 className="text-lg font-extrabold text-white">Supabase Storage</h3>
                </div>
              </div>
              <p className="text-[#848e9c] text-sm mb-5 leading-relaxed">S3-compatible object store with a Postgres-backed metadata layer. Documents are stored once and referenced everywhere.</p>
              <div className="space-y-2">
                {[
                  { icon: HardDrive, label: "Document bucket", sub: "Raw uploads — PDFs, PNGs, bank statements" },
                  { icon: RefreshCw, label: "OCR Queue", sub: "Trigger-based queue signals Gemma 4 extraction" },
                  { icon: BrainCircuit, label: "AI Processing", sub: "Gemma reads file via presigned URL — no data copy" },
                  { icon: Code2, label: "Metadata", sub: "Extraction result stored in Neon — file stays in bucket" },
                  { icon: HardDrive, label: "Archive", sub: "Retention policy: 7 years cold storage" },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <motion.div key={s.label} className="flex items-center gap-3 bg-[#2b3139] rounded-lg px-3 py-2.5"
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
                      <Icon className="w-3.5 h-3.5 text-[#0ecb81] flex-shrink-0" />
                      <div>
                        <div className="text-[11px] font-bold text-[#eaecef]">{s.label}</div>
                        <div className="text-[9px] text-[#707a8a]">{s.sub}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="bg-[#1e2329] border border-[#2b3139] rounded-2xl p-6 h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-[#f6465d]/10 border border-[#f6465d]/20 flex items-center justify-center">
                  <BarChart2 className="w-4.5 h-4.5 text-[#f6465d]" />
                </div>
                <div>
                  <SectionLabel text="Section 8" />
                  <h3 className="text-lg font-extrabold text-white">ClickHouse OLAP</h3>
                </div>
              </div>
              <p className="text-[#848e9c] text-sm mb-5 leading-relaxed">Column-store OLAP engine capable of scanning 1B+ rows/sec. Powers real-time financial analytics without impacting transactional Postgres.</p>
              <div className="space-y-2">
                {[
                  { icon: Activity, label: "Financial Events", sub: "Every transaction, invoice and KPI change streamed in" },
                  { icon: Network, label: "Streaming Ingest", sub: "Kafka-compatible event stream → ClickHouse insert" },
                  { icon: BarChart2, label: "Aggregation Layer", sub: "Pre-aggregated materialized views for fast queries" },
                  { icon: TrendingUp, label: "KPI Engine", sub: "Sub-second queries over millions of financial records" },
                  { icon: FileText, label: "Report Generation", sub: "PDF / Excel export from ClickHouse query results" },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <motion.div key={s.label} className="flex items-center gap-3 bg-[#2b3139] rounded-lg px-3 py-2.5"
                      initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
                      <Icon className="w-3.5 h-3.5 text-[#f6465d] flex-shrink-0" />
                      <div>
                        <div className="text-[11px] font-bold text-[#eaecef]">{s.label}</div>
                        <div className="text-[9px] text-[#707a8a]">{s.sub}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* S9 — API ARCHITECTURE */}
      <section className="py-20 px-6 lg:px-12 border-t border-[#2b3139] bg-[#0b0e11]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <div className="bg-[#1e2329] border border-[#2b3139] rounded-2xl p-5 font-mono text-[10px] space-y-2">
              <div className="flex items-center gap-2 border-b border-[#2b3139] pb-2 mb-2">
                <Terminal className="w-4 h-4 text-[#0ecb81]" />
                <span className="text-[11px] font-bold text-[#eaecef]">FastAPI · Request Lifecycle</span>
              </div>
              {[
                { method: "POST", path: "/api/v1/invoices/upload", status: "201", time: "148ms" },
                { method: "GET", path: "/api/v1/forecast/30d", status: "200", time: "87ms" },
                { method: "POST", path: "/api/v1/copilot/query", status: "200", time: "1.2s" },
                { method: "GET", path: "/api/v1/collections", status: "200", time: "42ms" },
                { method: "PATCH", path: "/api/v1/treasury/:id/approve", status: "200", time: "63ms" },
              ].map((req, i) => (
                <motion.div key={i} className="flex items-center gap-2 bg-[#2b3139] rounded-lg px-3 py-2"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.1 }}>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded min-w-[36px] text-center ${req.method === "GET" ? "bg-[#2dbdb6]/20 text-[#2dbdb6]" : req.method === "POST" ? "bg-[#0ecb81]/20 text-[#0ecb81]" : "bg-[#fcd535]/20 text-[#fcd535]"}`}>
                    {req.method}
                  </span>
                  <span className="text-[#eaecef] flex-1 truncate">{req.path}</span>
                  <span className="text-[#0ecb81] text-[9px] font-bold">{req.status}</span>
                  <span className="text-[#707a8a] text-[9px]">{req.time}</span>
                </motion.div>
              ))}
              <div className="pt-2 border-t border-[#2b3139] text-[9px] text-[#707a8a]">
                All routes: Bearer JWT → Pydantic → Service → DB
              </div>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="space-y-5">
              <SectionLabel text="API Architecture" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-snug">FastAPI · REST<br />Request Lifecycle</h2>
              <p className="text-[#848e9c] text-sm leading-relaxed">Every API request follows a strict middleware chain — no request touches business logic without passing auth, schema validation and rate limiting.</p>
              <div className="space-y-3">
                {[
                  { step: "1", label: "Frontend sends Bearer JWT", color: "#eaecef" },
                  { step: "2", label: "FastAPI dependency extracts + verifies token via Clerk JWKS", color: "#7c3aed" },
                  { step: "3", label: "Pydantic validates request body schema", color: "#0ecb81" },
                  { step: "4", label: "Business service executes domain logic", color: "#fcd535" },
                  { step: "5", label: "SQLAlchemy / raw query hits Neon", color: "#2dbdb6" },
                  { step: "6", label: "Gemma 4 called if AI inference required", color: "#fcd535" },
                  { step: "7", label: "Typed JSON response returned", color: "#0ecb81" },
                ].map((s, i) => (
                  <Reveal key={s.step} delay={i * 0.05}>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="w-6 h-6 rounded-full border border-[#2b3139] flex items-center justify-center text-[9px] font-bold text-[#707a8a] flex-shrink-0">{s.step}</span>
                      <span style={{ color: s.color }}>{s.label}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* S10 — SECURITY */}
      <section className="py-20 px-6 lg:px-12 border-t border-[#2b3139]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <SectionLabel text="Security" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Enterprise Security by Default</h2>
              <p className="text-[#848e9c] mt-3 text-sm max-w-lg mx-auto">Financial data demands the highest security posture. FORGE-PATH is zero-trust from the first request.</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SECURITY.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.label} delay={i * 0.07}>
                  <motion.div whileHover={{ y: -4, borderColor: "#fcd535" }} transition={{ duration: 0.2 }}
                    className="bg-[#1e2329] border border-[#2b3139] rounded-xl p-5">
                    <div className="w-9 h-9 rounded-lg bg-[#fcd535]/10 border border-[#fcd535]/20 flex items-center justify-center mb-4">
                      <Icon className="w-4.5 h-4.5 text-[#fcd535]" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1.5">{s.label}</h4>
                    <p className="text-[11px] text-[#707a8a] leading-relaxed">{s.desc}</p>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* S11 — TECH STACK */}
      <section className="py-20 px-6 lg:px-12 border-t border-[#2b3139] bg-[#0b0e11]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <SectionLabel text="Tech Stack" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Why Each Technology Was Chosen</h2>
              <p className="text-[#848e9c] mt-3 text-sm max-w-lg mx-auto">Every dependency was selected for a specific reason — hover to understand the decision.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {TECH.map((t, i) => {
              const Icon = t.icon;
              return (
                <Reveal key={t.name} delay={i * 0.04}>
                  <motion.div
                    onHoverStart={() => setHoveredTech(i)}
                    onHoverEnd={() => setHoveredTech(null)}
                    whileHover={{ y: -6 }}
                    className="relative bg-[#1e2329] border border-[#2b3139] hover:border-[#fcd535]/40 rounded-xl p-4 cursor-default transition-colors duration-200 overflow-hidden"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3 border"
                      style={{ backgroundColor: `${t.color}12`, borderColor: `${t.color}20` }}>
                      <Icon className="w-4 h-4" style={{ color: t.color }} />
                    </div>
                    <div className="text-sm font-bold text-white mb-1">{t.name}</div>
                    <motion.div className="text-[10px] text-[#707a8a] leading-relaxed"
                      animate={{ opacity: hoveredTech === i ? 1 : 0.6 }}>
                      {hoveredTech === i ? t.why : "Hover to learn why →"}
                    </motion.div>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl opacity-0 hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: t.color }} />
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* S12 — WHY THIS ARCHITECTURE */}
      <section className="py-20 px-6 lg:px-12 border-t border-[#2b3139]">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <SectionLabel text="Architecture Rationale" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Modular vs. Monolithic</h2>
              <p className="text-[#848e9c] mt-3 text-sm">The architectural decisions that make FORGE-PATH resilient and extensible.</p>
            </div>
          </Reveal>

          <div className="bg-[#1e2329] border border-[#2b3139] rounded-2xl overflow-hidden">
            <div className="grid grid-cols-2 border-b border-[#2b3139]">
              <div className="px-6 py-4 text-[11px] font-bold text-[#707a8a] uppercase tracking-widest">Traditional ERP</div>
              <div className="px-6 py-4 text-[11px] font-bold text-[#fcd535] uppercase tracking-widest bg-[#fcd535]/5 border-l border-[#2b3139]">FORGE-PATH Architecture</div>
            </div>
            {[
              ["Monolithic codebase — all modules tightly coupled", "Modular feature architecture — each module is independently deployable"],
              ["Manual data entry for every financial event", "AI-native extraction: Gemma 4 reads raw documents automatically"],
              ["Batch reports generated overnight", "Real-time intelligence via ClickHouse OLAP + live dashboard"],
              ["Single database handles OLTP + OLAP (slow)", "OLTP in Neon (fast writes) + OLAP in ClickHouse (fast reads) — separated"],
              ["Authentication managed in-house (security risk)", "Clerk handles all auth — battle-tested, SOC 2 compliant"],
              ["Forecast by finance team in spreadsheets", "Gemma 4 generates AI forecasts from live transaction data"],
              ["Reports take days to compile", "PDF / Excel export from ClickHouse — sub-second generation"],
            ].map((row, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <div className="grid grid-cols-2 border-b border-[#2b3139] last:border-b-0">
                  <div className="px-6 py-4 flex items-center gap-2.5 text-sm text-[#707a8a]">
                    <AlertCircle className="w-3.5 h-3.5 text-[#f6465d] flex-shrink-0" />{row[0]}
                  </div>
                  <div className="px-6 py-4 flex items-center gap-2.5 text-sm text-[#eaecef] bg-[#fcd535]/5 border-l border-[#2b3139]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0ecb81] flex-shrink-0" />{row[1]}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* S13 — DEPLOYMENT */}
      <section className="py-20 px-6 lg:px-12 border-t border-[#2b3139] bg-[#0b0e11]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <SectionLabel text="Deployment" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Cloud-Native Deployment</h2>
              <p className="text-[#848e9c] mt-3 text-sm max-w-lg mx-auto">Zero-ops deployment via managed cloud services — no infrastructure team required.</p>
            </div>
          </Reveal>

          <div className="relative">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { icon: Globe, label: "User", sub: "Browser / Mobile", color: "#eaecef", badge: "" },
                { icon: Layers, label: "Vercel Edge", sub: "Global CDN + SSR", color: "#eaecef", badge: "Edge" },
                { icon: Globe, label: "Next.js 16", sub: "App Router", color: "#eaecef", badge: "" },
                { icon: Server, label: "FastAPI", sub: "Fly.io / Railway", color: "#0ecb81", badge: "API" },
                { icon: BrainCircuit, label: "Google AI Studio", sub: "Gemma 4 inference", color: "#fcd535", badge: "AI" },
                { icon: Database, label: "Neon PostgreSQL", sub: "Serverless autoscale", color: "#2dbdb6", badge: "DB" },
                { icon: Cloud, label: "Supabase", sub: "Storage + realtime", color: "#0ecb81", badge: "" },
                { icon: BarChart2, label: "ClickHouse Cloud", sub: "OLAP analytics", color: "#f6465d", badge: "" },
              ].map((node, i) => {
                const Icon = node.icon;
                return (
                  <Reveal key={node.label} delay={i * 0.06}>
                    <motion.div whileHover={{ y: -4, borderColor: node.color }} transition={{ duration: 0.2 }}
                      className="relative bg-[#1e2329] border-2 border-[#2b3139] rounded-xl p-4 text-center transition-colors">
                      {node.badge && <span className="absolute top-2 right-2 text-[7px] font-extrabold px-1 py-0.5 rounded bg-[#fcd535] text-[#181a20]">{node.badge}</span>}
                      <div className="w-10 h-10 rounded-xl mx-auto flex items-center justify-center mb-2 border"
                        style={{ backgroundColor: `${node.color}10`, borderColor: `${node.color}20` }}>
                        <Icon className="w-5 h-5" style={{ color: node.color }} />
                      </div>
                      <div className="text-[11px] font-bold text-white">{node.label}</div>
                      <div className="text-[9px] text-[#707a8a] mt-0.5">{node.sub}</div>
                    </motion.div>
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={0.5}>
              <div className="mt-8 bg-[#1e2329] border border-[#2b3139] rounded-xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm">
                {[
                  { title: "CI/CD", items: ["GitHub Actions on every push", "TypeScript type check", "Next.js build validation", "Auto-deploy to Vercel on merge"] },
                  { title: "Environments", items: ["Development → .env.local", "Preview → Vercel Preview URL", "Production → main branch", "Staging → feature branches"] },
                  { title: "Monitoring", items: ["Vercel Analytics (Web Vitals)", "Neon query performance", "Supabase storage usage", "Clerk auth event webhooks"] },
                ].map(col => (
                  <div key={col.title}>
                    <div className="text-[10px] font-extrabold text-[#fcd535] uppercase tracking-widest mb-3">{col.title}</div>
                    <ul className="space-y-1.5">
                      {col.items.map(item => (
                        <li key={item} className="flex items-start gap-2 text-[11px] text-[#848e9c]">
                          <CheckCircle2 className="w-3 h-3 text-[#0ecb81] mt-0.5 flex-shrink-0" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* S14 — SCALABILITY */}
      <section className="py-20 px-6 lg:px-12 border-t border-[#2b3139]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <SectionLabel text="Scalability" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Scales with Your Business</h2>
              <p className="text-[#848e9c] mt-3 text-sm max-w-lg mx-auto">Architecture that grows from 100 to 100,000 users without re-engineering the core system.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SCALE_TIERS.map((tier, i) => (
              <Reveal key={tier.users} delay={i * 0.08}>
                <motion.div whileHover={{ y: -6, borderColor: "#fcd535" }} transition={{ duration: 0.2 }}
                  className={`bg-[#1e2329] border-2 rounded-xl p-5 transition-colors ${i === 0 ? "border-[#fcd535]/40" : "border-[#2b3139]"}`}>
                  <div className="text-3xl font-extrabold text-[#fcd535] font-mono mb-0.5">{tier.users}</div>
                  <div className="text-xs font-bold text-[#707a8a] uppercase tracking-wider mb-3">{tier.label} tier</div>
                  <div className="text-[10px] font-bold text-[#eaecef] mb-0.5">{tier.db}</div>
                  <div className="text-[10px] text-[#707a8a] mb-4">{tier.api}</div>
                  <ul className="space-y-1.5 border-t border-[#2b3139] pt-3">
                    {tier.notes.map(n => (
                      <li key={n} className="flex items-start gap-1.5 text-[10px] text-[#848e9c]">
                        <ChevronRight className="w-3 h-3 text-[#fcd535] mt-0.5 flex-shrink-0" />{n}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.4}>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              {[
                { icon: Database, title: "Neon autoscale", desc: "Compute scales from 0 to 64 vCPUs based on load — no pre-provisioning needed." },
                { icon: Globe, title: "Vercel edge", desc: "Next.js pages served from 100+ edge regions — sub-50ms TTFB globally." },
                { icon: BarChart2, title: "ClickHouse cloud", desc: "Columnar storage scales independently — add analytical capacity without touching OLTP." },
              ].map(c => {
                const Icon = c.icon;
                return (
                  <div key={c.title} className="flex items-start gap-3 bg-[#1e2329] border border-[#2b3139] rounded-xl p-4">
                    <Icon className="w-4 h-4 text-[#fcd535] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white text-sm mb-1">{c.title}</div>
                      <div className="text-[11px] text-[#707a8a] leading-relaxed">{c.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* S15 — PERFORMANCE */}
      <section className="py-20 px-6 lg:px-12 border-t border-[#2b3139] bg-[#0b0e11]">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <SectionLabel text="Performance" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Built to Perform at Scale</h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {PERF_METRICS.map((m, i) => (
              <Reveal key={m.label} delay={i * 0.08}>
                <motion.div whileHover={{ y: -4 }}
                  className="bg-[#1e2329] border border-[#2b3139] rounded-xl p-6 text-center">
                  <div className="text-4xl md:text-5xl font-extrabold text-[#fcd535] font-mono mb-2 tabular-nums">
                    {m.prefix}<AnimatedCounter target={m.value} suffix={m.suffix} />
                  </div>
                  <div className="text-sm font-bold text-white mb-1">{m.label}</div>
                  <div className="text-[11px] text-[#707a8a]">{m.sub}</div>
                </motion.div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.4}>
            <div className="mt-8 bg-[#1e2329] border border-[#2b3139] rounded-xl p-5">
              <div className="text-[10px] font-extrabold text-[#fcd535] uppercase tracking-widest mb-4">Latency Breakdown — Dashboard Load</div>
              <div className="space-y-3">
                {[
                  { label: "Vercel Edge SSR", ms: 22, max: 150, color: "#0ecb81" },
                  { label: "Clerk auth check", ms: 8, max: 150, color: "#7c3aed" },
                  { label: "Neon query (KPIs)", ms: 35, max: 150, color: "#2dbdb6" },
                  { label: "ClickHouse analytics", ms: 48, max: 150, color: "#f6465d" },
                  { label: "React hydration", ms: 37, max: 150, color: "#fcd535" },
                ].map(bar => (
                  <div key={bar.label} className="flex items-center gap-3">
                    <div className="w-36 text-[10px] text-[#848e9c] flex-shrink-0">{bar.label}</div>
                    <div className="flex-1 bg-[#2b3139] rounded-full h-1.5 overflow-hidden">
                      <motion.div className="h-full rounded-full"
                        style={{ backgroundColor: bar.color }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(bar.ms / bar.max) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }} />
                    </div>
                    <div className="text-[10px] font-bold font-mono text-[#eaecef] w-12 text-right">{bar.ms}ms</div>
                  </div>
                ))}
                <div className="pt-2 border-t border-[#2b3139] flex items-center justify-between text-[10px]">
                  <span className="text-[#707a8a]">Total p95 latency</span>
                  <span className="font-bold text-[#fcd535] font-mono">&lt; 150ms</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 px-6 lg:px-12 border-t border-[#2b3139]">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="bg-[#1e2329] border border-[#2b3139] rounded-2xl p-10 md:p-14 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[#fcd535]/3 pointer-events-none" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#fcd535]/5 blur-3xl pointer-events-none" />
              <div className="relative z-10 space-y-5">
                <SectionLabel text="Get Started" />
                <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                  Ready to experience<br />FORGE-PATH?
                </h2>
                <p className="text-[#848e9c] text-sm max-w-md mx-auto">
                  The architecture is production-ready. The AI is live. Your financial data is waiting to be intelligent.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <Link href="/login"
                    className="h-11 px-8 rounded-md bg-[#fcd535] hover:bg-[#f0b90b] text-[#181a20] font-bold text-sm transition-all flex items-center gap-2 shadow-xl shadow-[#fcd535]/20">
                    Launch Workspace <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/features"
                    className="h-11 px-6 rounded-md bg-[#2b3139] hover:bg-[#3a4049] text-white border border-[#3a4049] font-semibold text-sm transition-all flex items-center gap-2">
                    Explore Features <ChevronRight className="w-4 h-4" />
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
