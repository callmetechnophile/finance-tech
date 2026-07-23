"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileSpreadsheet,
  TrendingUp,
  Activity,
  Zap,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Database,
  Bot,
  UserCheck,
  Calendar,
  IndianRupee,
  FileText,
  UserX,
  RefreshCw,
  Plus,
  Send,
  HelpCircle,
  Cpu,
  Server,
  Layers,
  Sparkles,
  Search,
  Building,
  Check,
} from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { Section } from "@/shared/components/layout/Section";
import { useDocumentStatusStore } from "@/shared/stores/document-status.store";
import { cn } from "@/shared/utils/cn";
import { MetricCard } from "@/shared/components/cards/MetricCard";
import { StatCard } from "@/shared/components/cards/StatCard";
import { RiskCard } from "@/shared/components/cards/RiskCard";
import { InsightCard } from "@/shared/components/cards/InsightCard";
import { ApprovalCard } from "@/shared/components/enterprise/ApprovalCard";
import { AuditCard } from "@/shared/components/enterprise/AuditCard";
import { formatCurrency } from "@/shared/utils/currency";

// ─── 1. QUICK ACTIONS WIDGET ────────────────────────────────────────────────
export function QuickActionsWidget() {
  const actions = [
    { label: "Upload Invoice", icon: <Upload className="w-4.5 h-4.5" />, color: "hover:border-[#faff69] hover:bg-[#faff69]/5" },
    { label: "Upload Bank Statement", icon: <FileSpreadsheet className="w-4.5 h-4.5" />, color: "hover:border-[#faff69] hover:bg-[#faff69]/5" },
    { label: "Generate Forecast", icon: <TrendingUp className="w-4.5 h-4.5" />, color: "hover:border-[#faff69] hover:bg-[#faff69]/5" },
    { label: "Liquidity Analysis", icon: <Activity className="w-4.5 h-4.5" />, color: "hover:border-[#faff69] hover:bg-[#faff69]/5" },
    { label: "Treasury Optimization", icon: <Zap className="w-4.5 h-4.5" />, color: "hover:border-[#faff69] hover:bg-[#faff69]/5" },
    { label: "Send Collection Reminder", icon: <Send className="w-4.5 h-4.5" />, color: "hover:border-[#faff69] hover:bg-[#faff69]/5" },
    { label: "Generate Report", icon: <FileText className="w-4.5 h-4.5" />, color: "hover:border-[#faff69] hover:bg-[#faff69]/5" },
    { label: "Ask AI", icon: <Bot className="w-4.5 h-4.5 text-[#faff69]" />, color: "border-[#faff69]/30 hover:border-[#faff69] bg-[#faff69]/[0.02] hover:bg-[#faff69]/5" },
  ];

  const handleAction = (label: string) => {
    alert(`[Action Triggered] Mock pipeline action: "${label}" has been dispatched to background job scheduler.`);
  };

  return (
    <Section title="Quick Operations Desk" compact>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3" role="toolbar" aria-label="Quick operations shortcuts">
        {actions.map((act) => (
          <button
            key={act.label}
            onClick={() => handleAction(act.label)}
            className={[
              "flex flex-col items-center justify-center gap-2 p-3 text-center rounded-xl bg-[#111] border border-[#2a2a2a]",
              "text-xs font-semibold text-white/80 transition-all duration-150 outline-none",
              "focus-visible:ring-1 focus-visible:ring-[#faff69] focus-visible:ring-offset-1 focus-visible:ring-offset-[#111]",
              "hover:shadow-md hover:shadow-black/20 hover:scale-[1.01]",
              act.color
            ].join(" ")}
          >
            <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center shrink-0">
              {act.icon}
            </div>
            <span className="line-clamp-2 leading-tight">{act.label}</span>
          </button>
        ))}
      </div>
    </Section>
  );
}

// ─── 2. FINANCIAL ANALYTICS PANEL ──────────────────────────────────────────
export function FinancialAnalyticsPanel({ state }: { state: string }) {
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;

  const agingAR = [
    { range: "0–30 Days", val: 120500, pct: 42, color: "bg-green-500" },
    { range: "31–60 Days", val: 85200, pct: 30, color: "bg-[#faff69]" },
    { range: "61–90 Days", val: 45000, pct: 16, color: "bg-amber-500" },
    { range: "90+ Days (L4)", val: 33800, pct: 12, color: "bg-red-500" },
  ];

  const agingAP = [
    { range: "0–30 Days", val: 65400, pct: 55, color: "bg-green-500" },
    { range: "31–60 Days", val: 32000, pct: 27, color: "bg-[#faff69]" },
    { range: "61–90 Days", val: 15000, pct: 13, color: "bg-amber-500" },
    { range: "90+ Days", val: 6000, pct: 5, color: "bg-red-500" },
  ];

  if (state === "loading") {
    return (
      <Panel className="min-h-[200px] justify-between gap-4" padded>
        <div className="h-6 w-1/3 bg-[#222] animate-pulse rounded" />
        <div className="h-24 w-full bg-[#222] animate-pulse rounded" />
        <div className="h-10 w-full bg-[#222] animate-pulse rounded" />
      </Panel>
    );
  }

  if (state === "empty") {
    return (
      <Panel className="min-h-[200px] justify-center items-center" padded>
        <p className="text-xs text-white/30 text-center">No analytical records compiled for the current period.</p>
      </Panel>
    );
  }

  return (
    <Section title="Financial Analytics Hub" compact>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: AR & AP Aging */}
        <Panel className="bg-[#111] border-[#222] space-y-4" padded>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#faff69]" /> Ledger Aging Telemetry
          </h3>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider block mb-2">
                Accounts Receivable ({hasData ? "₹2,84,500 Total" : "--- Total"})
              </span>
              {hasData ? (
                <div className="space-y-2">
                  {agingAR.map((item) => (
                    <div key={item.range} className="space-y-1">
                      <div className="flex justify-between text-[10px] text-white/70">
                        <span>{item.range}</span>
                        <span className="font-mono font-semibold">{formatCurrency(item.val)} ({item.pct}%)</span>
                      </div>
                      <div className="h-1 w-full bg-[#222] rounded-full overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-white/40 py-2">No data available</div>
              )}
            </div>

            <div className="border-t border-[#222] pt-3">
              <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider block mb-2">
                Accounts Payable ({hasData ? "₹1,18,400 Total" : "--- Total"})
              </span>
              {hasData ? (
                <div className="space-y-2">
                  {agingAP.map((item) => (
                    <div key={item.range} className="space-y-1">
                      <div className="flex justify-between text-[10px] text-white/70">
                        <span>{item.range}</span>
                        <span className="font-mono font-semibold">{formatCurrency(item.val)} ({item.pct}%)</span>
                      </div>
                      <div className="h-1 w-full bg-[#222] rounded-full overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-white/40 py-2">No data available</div>
              )}
            </div>
          </div>
        </Panel>

        {/* Right: Cash Flow Trends & Treasury Reserves */}
        <Panel className="bg-[#111] border-[#222] justify-between gap-4" padded>
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#faff69]" /> Liquidity &amp; Forecast Analytics
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#222] space-y-1">
                <span className="text-[9px] text-white/40 uppercase tracking-widest block">Monthly Collections</span>
                <span className="text-sm font-bold text-green-400 font-mono">{hasData ? "₹1,84,200" : "---"}</span>
                <span className="text-[9px] text-white/30 block">Recovery Rate: {hasData ? "92.4%" : "---"}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#222] space-y-1">
                <span className="text-[9px] text-white/40 uppercase tracking-widest block">Liquidity Trend</span>
                <span className="text-sm font-bold text-white font-mono">{hasData ? "+12.4% MoM" : "---"}</span>
                <span className="text-[9px] text-green-400 block">Buffer: {hasData ? "Stable" : "---"}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#222] space-y-1">
                <span className="text-[9px] text-white/40 uppercase tracking-widest block">Forecast Variance</span>
                <span className="text-sm font-bold text-[#faff69] font-mono">{hasData ? "1.8% deviation" : "---"}</span>
                <span className="text-[9px] text-white/30 block">Confidence: {hasData ? "Excellent" : "---"}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#222] space-y-1">
                <span className="text-[9px] text-white/40 uppercase tracking-widest block">Treasury APY Sweep</span>
                <span className="text-sm font-bold text-white font-mono">{hasData ? "4.8% sweep APY" : "---"}</span>
                <span className="text-[9px] text-[#faff69] block">{hasData ? "Overnight assets swept" : "Overnight assets: ---"}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#222] space-y-2">
              <div className="flex justify-between text-[10px] text-white/50 uppercase tracking-wider font-bold">
                <span>Revenue vs Expenses (Actual MoM)</span>
              </div>
              {hasData ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-3 bg-[#222] rounded overflow-hidden flex">
                    <div className="bg-[#faff69] h-full" style={{ width: "65%" }} title="Revenue" />
                    <div className="bg-amber-500 h-full" style={{ width: "35%" }} title="Expenses" />
                  </div>
                  <span className="text-[9px] text-white/70 font-mono">65:35 Ratio</span>
                </div>
              ) : (
                <div className="text-xs text-white/40 py-2">No data available</div>
              )}
            </div>
          </div>

          <div className="text-[10px] text-white/30 flex justify-between items-center border-t border-[#222] pt-2">
            <span>Treasury allocation matches corporate board limits.</span>
            <button className="text-[#faff69] hover:underline" onClick={() => alert("Redirecting to full telemetry ledger sheets.")}>
              Open Ledger Dashboard →
            </button>
          </div>
        </Panel>
      </div>
    </Section>
  );
}

// ─── 3. DOCUMENT INTELLIGENCE PANEL ────────────────────────────────────────
export function DocumentIntelligencePanel({ state }: { state: string }) {
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;

  const recentDocs = [
    { name: "Apex_Steel_Invoice_89.pdf", size: "2.4 MB", ocr: "98.8%", status: "ocr_complete", time: "14 min ago" },
    { name: "Delta_Fab_PO_July.pdf", size: "1.8 MB", ocr: "99.2%", status: "validation_queue", time: "35 min ago" },
    { name: "CNC_Maintenance_Agreement.pdf", size: "3.1 MB", ocr: "97.5%", status: "ocr_processing", time: "1 hour ago" },
  ];

  if (state === "loading") {
    return (
      <Panel className="min-h-[220px] justify-between" padded>
        <div className="h-6 w-1/4 bg-[#222] animate-pulse rounded" />
        <div className="space-y-2">
          <div className="h-8 w-full bg-[#222] animate-pulse rounded" />
          <div className="h-8 w-full bg-[#222] animate-pulse rounded" />
        </div>
      </Panel>
    );
  }

  if (state === "empty") {
    return (
      <Panel className="min-h-[200px] justify-center items-center" padded>
        <p className="text-xs text-white/30">Queue empty. No documents currently ingested in validation pipelines.</p>
      </Panel>
    );
  }

  return (
    <Section title="Document Intelligence Engine" compact>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Telemetry Stats */}
        <Panel className="bg-[#111] border-[#222] space-y-3" padded>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#faff69]" /> Pipeline Metrics
          </h3>
          <div className="space-y-2">
            {[
              { label: "Documents Uploaded (24h)", val: hasData ? "42 Files" : "---" },
              { label: "Processing Queue", val: hasData ? "4 active threads" : "---" },
              { label: "OCR Classification Ingestion", val: hasData ? "Online" : "Offline" },
              { label: "Extraction Accuracy", val: hasData ? "98.4%" : "---", highlight: true },
              { label: "Validation Queue Length", val: hasData ? "3 documents" : "---" },
              { label: "Manual Review Required", val: hasData ? "1 flag active" : "---", alert: hasData },
            ].map((m) => (
              <div key={m.label} className="flex justify-between text-xs border-b border-[#222] pb-1.5 last:border-b-0">
                <span className="text-white/50">{m.label}</span>
                <span className={m.alert ? "text-amber-400 font-bold" : m.highlight ? "text-[#faff69] font-bold" : "text-white/80 font-semibold"}>
                  {m.val}
                </span>
              </div>
            ))}
          </div>
        </Panel>

        {/* Recent Ingestions */}
        <Panel className="bg-[#111] border-[#222] space-y-3" padded>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-white/40" /> Ingestion Audit History
          </h3>
          {hasData ? (
            <div className="space-y-2.5">
              {recentDocs.map((doc) => (
                <div key={doc.name} className="flex justify-between items-start text-xs border-b border-[#222] pb-2 last:border-b-0">
                  <div className="min-w-0">
                    <p className="text-white/80 font-medium truncate max-w-[150px]">{doc.name}</p>
                    <p className="text-[10px] text-white/30">{doc.size} · OCR: {doc.ocr}</p>
                  </div>
                  <div className="text-right">
                    <span className={[
                      "px-1.5 py-0.5 text-[8px] font-bold rounded uppercase tracking-wider shrink-0",
                      doc.status === "ocr_complete" ? "bg-green-500/10 text-green-400 border border-green-500/25" :
                      doc.status === "validation_queue" ? "bg-[#faff69]/10 text-[#faff69] border border-[#faff69]/25" :
                      "bg-blue-500/10 text-blue-400 border border-blue-500/25 animate-pulse"
                    ].join(" ")}>
                      {doc.status.replace("_", " ")}
                    </span>
                    <span className="text-[9px] text-white/20 block mt-1">{doc.time}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-white/40 py-2">No data available</div>
          )}
        </Panel>

        {/* Pipeline Preview Visualizer */}
        <Panel className="bg-[#111] border-[#222] space-y-3" padded>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#faff69]" /> Pipeline Stage Visualizer
          </h3>
          {hasData ? (
            <div className="space-y-2">
              {[
                { id: "up", name: "Upload & Virus Scan", status: "completed", val: "PASS" },
                { id: "ocr", name: "OCR & Classification", status: "completed", val: "98%" },
                { id: "eval", name: "Field Match & Mapping", status: "running", val: "ACTIVE" },
                { id: "sync", name: "GL & ERP Synchronization", status: "queued", val: "WAIT" },
              ].map((stg) => (
                <div key={stg.id} className="flex items-center gap-2 text-xs">
                  <span className={[
                    "w-2.5 h-2.5 rounded-full",
                    stg.status === "completed" ? "bg-green-400" :
                    stg.status === "running" ? "bg-[#faff69] animate-pulse" : "bg-[#333]"
                  ].join(" ")} />
                  <span className="text-white/70 flex-1">{stg.name}</span>
                  <span className="font-mono text-[9px] text-white/30">{stg.val}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-white/40 py-2">No data available</div>
          )}
          <div className="pt-2 border-t border-[#222]">
            <button
              onClick={() => window.location.href = "/documents"}
              className="w-full py-1.5 rounded bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] text-[10px] font-bold text-[#faff69] tracking-wider uppercase text-center transition-colors"
            >
              Open IDP Workspace →
            </button>
          </div>
        </Panel>
      </div>
    </Section>
  );
}

// ─── 4. COLLECTIONS CENTER ──────────────────────────────────────────────────
export function CollectionsCenterPanel({ state }: { state: string }) {
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;

  const delinquents = [
    { name: "Apex Steel Works", amount: 47500, days: 45, risk: "critical" },
    { name: "Vance Metal Fabricators", amount: 28000, days: 38, risk: "high" },
    { name: "Delta CNC Machining", amount: 15300, days: 19, risk: "medium" },
  ];

  if (state === "loading") {
    return (
      <Panel className="min-h-[200px]" padded>
        <div className="h-6 w-1/4 bg-[#222] animate-pulse rounded mb-4" />
        <div className="h-20 w-full bg-[#222] animate-pulse rounded" />
      </Panel>
    );
  }

  if (state === "empty") {
    return (
      <Panel className="min-h-[200px] justify-center items-center" padded>
        <p className="text-xs text-white/30">Zero active delinquencies. All customer ledger accounts settled.</p>
      </Panel>
    );
  }

  return (
    <Section title="Collections &amp; Receivables Center" compact>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Delinquent Accounts */}
        <Panel className="bg-[#111] border-[#222] space-y-3" padded>
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <UserX className="w-3.5 h-3.5 text-red-500" /> High-Risk Delinquent Profiles
            </h3>
            <span className="px-1.5 py-0.5 text-[9px] bg-red-500/10 text-red-400 font-bold rounded">
              L3/L4 Active Escalations
            </span>
          </div>

          {hasData ? (
            <div className="space-y-2">
              {delinquents.map((cust) => (
                <div key={cust.name} className="flex items-center justify-between p-2 rounded bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#333] transition-colors">
                  <div>
                    <p className="text-xs font-semibold text-white/80">{cust.name}</p>
                    <p className="text-[10px] text-white/35">Lapsed runway: {cust.days} days past terms</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-white font-mono">{formatCurrency(cust.amount)}</p>
                    <span className={[
                      "text-[8px] font-bold uppercase",
                      cust.risk === "critical" ? "text-red-400" :
                      cust.risk === "high" ? "text-orange-400" : "text-amber-400"
                    ].join(" ")}>{cust.risk}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-white/40 py-2">No data available</div>
          )}
        </Panel>

        {/* Recovery metrics & follow-ups */}
        <Panel className="bg-[#111] border-[#222] space-y-3" padded>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#faff69]" /> Collection Performance &amp; Actions
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#1a1a1a] border border-[#222] rounded-lg">
              <span className="text-[9px] text-white/40 uppercase block">Recovery Speed</span>
              <span className="text-sm font-bold text-green-400">{hasData ? "14.2 Days Avg" : "---"}</span>
              <span className="text-[9px] text-white/30 block mt-1">{hasData ? "Target range: 18 days" : "Target range: ---"}</span>
            </div>
            <div className="p-3 bg-[#1a1a1a] border border-[#222] rounded-lg">
              <span className="text-[9px] text-white/40 uppercase block">Due Follow-ups</span>
              <span className="text-sm font-bold text-[#faff69]">{hasData ? "4 Accounts" : "---"}</span>
              <span className="text-[9px] text-white/30 block mt-1">{hasData ? "2 scheduled phone triggers" : "No scheduled phone triggers"}</span>
            </div>
          </div>

          <div className="p-3 bg-[#1a1a1a] border border-[#222] rounded-lg space-y-2">
            <div className="flex justify-between text-[10px] text-white/40 uppercase tracking-widest font-bold">
              <span>Collection Pipeline Recovery Rate</span>
              <span className="text-[#faff69]">{hasData ? "92.4%" : "---"}</span>
            </div>
            {hasData ? (
              <div className="h-1.5 w-full bg-[#222] rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: "92.4%" }} />
              </div>
            ) : (
              <div className="text-xs text-white/40">No data available</div>
            )}
          </div>

          <button
            onClick={() => {
              if (hasData) {
                alert("[Collections] Automated reminders dispatched for 3 overdue client ledger profiles.");
              }
            }}
            disabled={!hasData}
            className="w-full py-1.5 rounded bg-[#faff69] hover:bg-[#e6eb5f] text-black text-xs font-bold uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Dispatch Automated Reminders (SMS/Email)
          </button>
        </Panel>
      </div>
    </Section>
  );
}

// ─── 5. TREASURY CENTER ─────────────────────────────────────────────────────
export function TreasuryCenterPanel({ state }: { state: string }) {
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;

  const bankAccounts = [
    { name: "Chase Operating ...0192", balance: 240500, type: "Operational" },
    { name: "Silicon Valley Reserve ...8291", balance: 64500, type: "Buffer Sweep" },
    { name: "Neon Yield sweeps ...3749", balance: 37000, type: "Treasury Invest" },
  ];

  if (state === "loading") {
    return (
      <Panel className="min-h-[220px]" padded>
        <div className="h-6 w-1/4 bg-[#222] animate-pulse rounded mb-4" />
        <div className="h-28 w-full bg-[#222] animate-pulse rounded" />
      </Panel>
    );
  }

  if (state === "empty") {
    return (
      <Panel className="min-h-[200px] justify-center items-center" padded>
        <p className="text-xs text-white/30">Bank telemetry disconnect. Please link routing credentials.</p>
      </Panel>
    );
  }

  return (
    <Section title="Treasury &amp; Allocation Desk" compact>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Linked Accounts */}
        <Panel className="bg-[#111] border-[#222] space-y-3" padded>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-white/40" /> Verified Corporate Bank Balances
          </h3>
          {hasData ? (
            <div className="space-y-2">
              {bankAccounts.map((acc) => (
                <div key={acc.name} className="flex justify-between items-center p-2.5 rounded bg-[#1a1a1a] border border-[#2a2a2a]">
                  <div>
                    <p className="text-xs font-semibold text-white/80">{acc.name}</p>
                    <span className="text-[9px] text-[#faff69]/80 font-semibold uppercase">{acc.type}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white font-mono">{formatCurrency(acc.balance)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-white/40 py-2">No data available</div>
          )}
        </Panel>

        {/* Scheduled payments & Allocation calendar */}
        <Panel className="bg-[#111] border-[#222] space-y-3" padded>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#faff69]" /> Pending Vendor Invoices (Scheduled Outflow)
          </h3>

          {hasData ? (
            <div className="space-y-2">
              {[
                { vendor: "Apex Machining Co.", date: "July 24, 2026", amount: 45000, type: "Wire Wire Transfer" },
                { vendor: "NVIDIA NIM Services", date: "July 28, 2026", amount: 18400, type: "Automated Sweep" },
              ].map((wire) => (
                <div key={wire.vendor} className="flex justify-between items-center text-xs p-2 rounded bg-[#1a1a1a]/60 border border-[#222]">
                  <div>
                    <p className="text-white/80 font-medium">{wire.vendor}</p>
                    <p className="text-[10px] text-white/40">{wire.date} · {wire.type}</p>
                  </div>
                  <p className="font-bold text-white font-mono">{formatCurrency(wire.amount)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-white/40 py-2">No data available</div>
          )}

          <div className="pt-2 border-t border-[#222] flex justify-between items-center text-[10px]">
            <span className="text-white/40">Approval queue matches board criteria limits.</span>
            <button
              onClick={() => {
                if (hasData) {
                  alert("[Treasury Sweep] sweeps executed. Sweep balance remaining is optimized.");
                }
              }}
              disabled={!hasData}
              className="px-3 py-1 rounded bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] text-[#faff69] font-bold uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Optimize Yield Sweep
            </button>
          </div>
        </Panel>
      </div>
    </Section>
  );
}

// ─── 6. LIQUIDITY CENTER ────────────────────────────────────────────────────
export function LiquidityCenterPanel({ state }: { state: string }) {
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;

  if (state === "loading") {
    return (
      <Panel className="min-h-[180px] bg-[#111]" padded>
        <div className="h-6 w-1/4 bg-[#222] animate-pulse rounded" />
      </Panel>
    );
  }

  if (state === "empty") {
    return (
      <Panel className="min-h-[180px] justify-center items-center" padded>
        <p className="text-xs text-white/30">No liquidity simulations available for this model.</p>
      </Panel>
    );
  }

  return (
    <Section title="Liquidity Simulation &amp; Stress Tests" compact>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Forecast Runway Telemetry */}
        <Panel className="bg-[#111] border-[#222] space-y-3" padded>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-white/40" /> Cash Runway Telemetry
          </h3>
          <div className="space-y-2">
            {[
              { period: "7-Day Forecast", bal: hasData ? "₹3,20,000" : "---", run: hasData ? "Buffer: Optimal" : "Buffer: ---" },
              { period: "30-Day Forecast", bal: hasData ? "₹2,85,400" : "---", run: hasData ? "Buffer: Stable" : "Buffer: ---" },
              { period: "90-Day Forecast", bal: hasData ? "₹2,12,500" : "---", run: hasData ? "Buffer: Restricted" : "Buffer: ---", warning: hasData },
            ].map((f) => (
              <div key={f.period} className="flex justify-between items-center text-xs border-b border-[#222] pb-1.5 last:border-b-0">
                <div>
                  <span className="text-white/60 font-medium block">{f.period}</span>
                  <span className="font-mono text-white text-sm font-bold">{f.bal}</span>
                </div>
                <span className={f.warning ? "text-amber-400 font-semibold text-[10px]" : "text-green-400 font-semibold text-[10px]"}>
                  {f.run}
                </span>
              </div>
            ))}
          </div>
        </Panel>

        {/* Scenario stress testing */}
        <Panel className="bg-[#111] border-[#222] space-y-3" padded>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#faff69]" /> Stress Test Simulations
          </h3>
          <div className="space-y-2">
            {[
              { sc: "Default Baseline", run: hasData ? "68 Days" : "---", status: hasData ? "Optimal" : "---", color: hasData ? "text-green-400" : "text-white/30" },
              { sc: "-25% Sales Delinquency", run: hasData ? "52 Days" : "---", status: hasData ? "Stable" : "---", color: hasData ? "text-[#faff69]" : "text-white/30" },
              { sc: "Raw Material Cost Spike", run: hasData ? "44 Days" : "---", status: hasData ? "Exposed" : "---", color: hasData ? "text-amber-400" : "text-white/30" },
            ].map((item) => (
              <div key={item.sc} className="flex justify-between items-center text-xs p-1.5 rounded bg-[#1a1a1a]">
                <span className="text-white/70">{item.sc}</span>
                <div className="text-right">
                  <span className="font-bold text-white font-mono block">{item.run}</span>
                  <span className={`text-[9px] font-semibold ${item.color}`}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Cash Gap Prediction */}
        <Panel className="bg-[#111] border-[#222] space-y-3" padded>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className={cn("w-3.5 h-3.5", hasData ? "text-amber-500" : "text-white/40")} /> Cash Gap Analytics
          </h3>
          <div className={cn("p-3 bg-[#1a1a1a] rounded-lg border space-y-2", hasData ? "border-amber-500/10" : "border-[#222]")}>
            <p className="text-[11px] text-white/85 leading-relaxed font-medium">
              {hasData 
                ? "Anomalous Cash Gap Risk flagged between August 12 - August 18 due to overlapping AP payments and delays in Apex Steel collections."
                : "No financial documents have been processed yet."
              }
            </p>
            <div className="flex justify-between text-[10px]">
              <span className={cn("font-semibold", hasData ? "text-amber-400" : "text-white/30")}>
                Risk Exposure: {hasData ? "₹18,400" : "---"}
              </span>
              {hasData && (
                <button
                  className="text-[#faff69] hover:underline"
                  onClick={() => alert("Scenario comparison loaded. Sweeps threshold adjusted to buffer predicted exposure.")}
                >
                  Resolve Scenario →
                </button>
              )}
            </div>
          </div>
        </Panel>
      </div>
    </Section>
  );
}

// ─── 7. FORECAST CENTER ─────────────────────────────────────────────────────
export function ForecastCenterPanel({ state }: { state: string }) {
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;

  if (state === "loading") {
    return (
      <Panel className="min-h-[160px] bg-[#111]" padded>
        <div className="h-6 w-1/4 bg-[#222] animate-pulse rounded" />
      </Panel>
    );
  }

  if (state === "empty") {
    return (
      <Panel className="min-h-[160px] justify-center items-center" padded>
        <p className="text-xs text-white/30">Forecast model offline. Re-sync ledger nodes.</p>
      </Panel>
    );
  }

  return (
    <Section title="AI Forecasting Suite" compact>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Forecast Drivers */}
        <Panel className="bg-[#111] border-[#222] space-y-3" padded>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#faff69]" /> Key Predictive Forecast Drivers
          </h3>
          {hasData ? (
            <div className="space-y-2">
              {[
                { dr: "Customer Payment Delay probability", val: "Apex Steel Works at 94% threshold", trend: "Increasing Delinquency", status: "negative" },
                { dr: "Incoming Raw material shipments", val: "Steel imports wire queued on July 24", trend: "Scheduled Outflow", status: "neutral" },
                { dr: "Average Days Sales Outstanding", val: "Stabilized at 34 days ledger average", trend: "Optimized Collections", status: "positive" },
              ].map((drv) => (
                <div key={drv.dr} className="text-xs p-2 rounded bg-[#1a1a1a] border border-[#222]">
                  <div className="flex justify-between font-semibold">
                    <span className="text-white/80">{drv.dr}</span>
                    <span className={drv.status === "positive" ? "text-green-400" : drv.status === "negative" ? "text-red-400" : "text-white/40"}>
                      {drv.trend}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/30 mt-1">{drv.val}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-white/40 py-2">No data available</div>
          )}
        </Panel>

        {/* AI Insight and confidence */}
        <Panel className="bg-[#111] border-[#222] justify-between" padded>
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-[#faff69]" /> Forecast Trust Margin
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#1a1a1a] rounded-lg border border-[#222] space-y-1">
                <span className="text-[9px] text-white/40 uppercase block">Confidence Interval</span>
                <span className="text-lg font-bold text-green-400 font-mono">{hasData ? "95.4%" : "---"}</span>
                <span className="text-[9px] text-white/30 block">{hasData ? "Based on 14d rolling models" : "Based on 14d rolling models: ---"}</span>
              </div>
              <div className="p-3 bg-[#1a1a1a] rounded-lg border border-[#222] space-y-1">
                <span className="text-[9px] text-white/40 uppercase block">Projected Cash Balance</span>
                <span className="text-lg font-bold text-white font-mono">{hasData ? "₹3,62,000" : "---"}</span>
                <span className="text-[9px] text-green-400 block">{hasData ? "+6.4% expected gain" : "Expected gain: ---"}</span>
              </div>
            </div>
            <div className="p-3 bg-[#1a1a1a] border border-[#222] rounded-lg text-xs leading-relaxed text-white/70">
              <span className="text-[#faff69] font-bold">Gemma AI Forecast digest:</span>{" "}
              {hasData 
                ? "Net cash flow projections remain positive over Q3. Delinquency recoveries represent the primary opportunity to maximize sweeps yields."
                : "No financial documents have been processed yet."
              }
            </div>
          </div>

          <div className="text-[10px] text-white/30 pt-2 border-t border-[#222] flex justify-between items-center mt-3">
            <span>Forecast generated July 19, 2026.</span>
            <button
              onClick={() => {
                if (hasData) {
                  alert("Re-compiling predictive timeseries forecasts.");
                }
              }}
              disabled={!hasData}
              className="text-[#faff69] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Force Re-generate Forecast
            </button>
          </div>
        </Panel>
      </div>
    </Section>
  );
}

// ─── 8. AI FINANCIAL COPILOT (PLACEHOLDER ONLY) ────────────────────────────
export function AICopilotPanel() {
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;

  const suggestedQuestions = [
    "What is the probability of Apex Steel paying invoice INV-089 this week?",
    "Can we afford to release the ₹45,000 maintenance payout tomorrow?",
    "Show me scenario stress-test logs for sales drops of 30%.",
  ];

  return (
    <Panel className="bg-[#111] border-[#222] space-y-4" padded>
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Bot className="w-4 h-4 text-[#faff69] animate-pulse" /> AI Copilot Telemetry
        </h3>
        <span className="px-1.5 py-0.5 text-[8px] font-bold rounded bg-[#faff69]/10 text-[#faff69] border border-[#faff69]/20 uppercase tracking-widest">
          Gemma 2B Engine
        </span>
      </div>

      <div className="space-y-3">
        {/* Risks/Opportunities summary */}
        <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#222] space-y-2 text-xs">
          <span className="text-[9px] text-[#faff69] font-bold uppercase tracking-wider block">Real-time Solvency Digest</span>
          <p className="text-white/70 leading-relaxed font-medium">
            {hasData 
              ? "I have audited your ledger. Receivables delay index has risen by +4.2% this week. Sweeping ₹42,000 excess buffer into Neon Sweep account is recommended immediately to capture the 4.8% APY overnight yield."
              : "No financial documents have been processed yet."
            }
          </p>
        </div>

        {/* Suggested Actions */}
        <div className="space-y-1.5">
          <span className="text-[9px] text-white/40 uppercase tracking-wider font-bold block">Recommended Actions</span>
          {hasData ? (
            <div className="space-y-1">
              {[
                { act: "Trigger L4 escalation to Apex CEO", severity: "critical" },
                { act: "Sweep ₹42k excess into Neon Sweep", severity: "optimal" },
              ].map((a) => (
                <button
                  key={a.act}
                  onClick={() => alert(`AI Dispatched trigger action: "${a.act}"`)}
                  className="w-full text-left px-2.5 py-1.5 rounded bg-[#1a1a1a]/60 hover:bg-[#1a1a1a] border border-[#222] hover:border-[#333] text-[11px] font-medium text-white/80 flex items-center justify-between transition-colors"
                >
                  <span>{a.act}</span>
                  <span className={a.severity === "critical" ? "text-red-400 text-[9px] font-bold" : "text-[#faff69] text-[9px] font-bold"}>
                    {a.severity.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-xs text-white/40 py-1">No data available</div>
          )}
        </div>

        {/* Recommended Questions */}
        {hasData && (
          <div className="space-y-1.5">
            <span className="text-[9px] text-white/40 uppercase tracking-wider font-bold block">Ask Copilot (Suggested Prompts)</span>
            <div className="space-y-1.5">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => alert(`Copilot query dispatched: "${q}"`)}
                  className="w-full text-left p-2 rounded bg-[#0d0d0d] hover:bg-[#1a1a1a] border border-[#222] text-[10px] text-white/50 hover:text-[#faff69] transition-colors leading-relaxed"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}

// ─── 9. ALERTS & APPROVALS PANEL ───────────────────────────────────────────
export function AlertsApprovalsPanel() {
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;

  const alerts = [
    { title: "Invoice INV-089 (Apex Steel) 45d Overdue", type: "critical" },
    { title: "Bank Sync Feed delay check needed", type: "warning" },
    { title: "Failed OCR Import check on receipt-33.png", type: "error" },
  ];

  return (
    <Panel className="bg-[#111] border-[#222] space-y-4" padded>
      <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
        <Bell className="w-4 h-4 text-red-500" /> Exceptions &amp; Approvals
      </h3>

      <div className="space-y-2">
        {/* Approvals */}
        <div className="space-y-1.5">
          <span className="text-[9px] text-white/40 uppercase tracking-wider font-bold block">Pending Actions Requiring Approval</span>
          {hasData ? (
            <ApprovalCard
              title="Q3 Solvency Runway Release"
              description="Authorize publication of the board report."
              requestedBy="Sarah Jenkins"
              requestedAt="Today, 11:20"
              amount="₹3,42,000 baseline"
              status="pending"
              onApprove={() => alert("Board runway report publication approved.")}
              onReject={() => alert("Report publication rejected.")}
            />
          ) : (
            <div className="text-xs text-white/40 py-2">No data available</div>
          )}
        </div>

        {/* Critical Alerts */}
        <div className="space-y-1.5 border-t border-[#222] pt-3">
          <span className="text-[9px] text-white/40 uppercase tracking-wider font-bold block">System Warnings &amp; Logs</span>
          {hasData ? (
            <div className="space-y-1.5">
              {alerts.map((al) => (
                <div
                  key={al.title}
                  className={[
                    "p-2 rounded text-[10px] flex items-center gap-2 border",
                    al.type === "critical" ? "bg-red-500/[0.02] border-red-500/10 text-red-400" :
                    al.type === "error" ? "bg-red-500/[0.02] border-red-500/10 text-red-400" :
                    "bg-amber-500/[0.02] border-amber-500/10 text-amber-400"
                  ].join(" ")}
                >
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{al.title}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-white/40 py-2">No data available</div>
          )}
        </div>
      </div>
    </Panel>
  );
}

// ─── 10. SYSTEM HEALTH MONITOR ──────────────────────────────────────────────
export function SystemHealthPanel() {
  const systems = [
    { name: "ClickHouse Ingestion Engine", status: "online" },
    { name: "NeonDB Server cluster", status: "online" },
    { name: "Gemma AI Inference node", status: "online" },
    { name: "OCR Ingestion worker", status: "online" },
    { name: "SMS Reminders Service", status: "online" },
    { name: "Email Relay (SMTP)", status: "online" },
  ];

  return (
    <Panel className="bg-[#111] border-[#222] space-y-3" padded>
      <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
        <Server className="w-3.5 h-3.5 text-white/40" /> Core System Telemetry Health
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {systems.map((sys) => (
          <div key={sys.name} className="p-2 rounded bg-[#1a1a1a] border border-[#222] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] font-semibold text-white/70 block truncate" title={sys.name}>
                {sys.name}
              </span>
              <span className="text-[8px] text-green-400 uppercase tracking-widest font-black block">
                {sys.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
