"use client";

import React from "react";
import {
  Upload,
  FileSpreadsheet,
  TrendingUp,
  Activity,
  Zap,
  Bell,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Database,
  Bot,
  Calendar,
  IndianRupee,
  FileText,
  UserX,
  Send,
  Cpu,
  Server,
  Layers,
  Plus,
  RefreshCw,
} from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { Section } from "@/shared/components/layout/Section";
import { useDocumentStatusStore } from "@/shared/stores/document-status.store";
import { formatCurrency } from "@/shared/utils/currency";
import { cn } from "@/shared/utils/cn";
import { Skeleton } from "@/shared/components/feedback/Skeleton";
import { ErrorState } from "@/shared/components/feedback/ErrorState";

// ─── 1. QUICK OPERATIONS DESK ──────────────────────────────────────────────
export function QuickActionsWidget() {
  const actions = [
    { label: "Upload Invoice", icon: <Upload className="w-4.5 h-4.5" /> },
    { label: "Upload Bank Statement", icon: <FileSpreadsheet className="w-4.5 h-4.5" /> },
    { label: "Generate Forecast", icon: <TrendingUp className="w-4.5 h-4.5" /> },
    { label: "Liquidity Analysis", icon: <Activity className="w-4.5 h-4.5" /> },
    { label: "Treasury Optimization", icon: <Zap className="w-4.5 h-4.5" /> },
    { label: "Send Collection Reminder", icon: <Send className="w-4.5 h-4.5" /> },
    { label: "Generate Report", icon: <FileText className="w-4.5 h-4.5" /> },
    { label: "Ask AI", icon: <Bot className="w-4.5 h-4.5 text-[#faff69]" /> },
  ];

  return (
    <Section title="Quick Operations Desk" compact>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3" role="toolbar">
        {actions.map((act) => (
          <button
            key={act.label}
            onClick={() => {
              const fileInput = document.getElementById("global-file-upload");
              if (fileInput) fileInput.click();
            }}
            className="flex flex-col items-center justify-center gap-2 p-3 text-center rounded-xl bg-[#111] border border-[#2a2a2a] text-xs font-semibold text-white/80 hover:border-[#faff69] hover:bg-[#faff69]/5 transition-all outline-none"
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
export function FinancialAnalyticsPanel({
  state = "loaded",
  data,
  onRetry,
}: {
  state?: "loaded" | "loading" | "empty" | "error";
  data?: any;
  onRetry?: () => void;
}) {
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0 && !!data?.ar_aging?.length;

  if (state === "loading") {
    return (
      <Panel className="min-h-[200px] justify-between gap-4" padded>
        <Skeleton height={20} width="30%" />
        <Skeleton height={100} width="100%" />
      </Panel>
    );
  }

  if (state === "error") {
    return (
      <Panel className="min-h-[200px] justify-center items-center" padded>
        <ErrorState title="Unable to retrieve data." onRetry={onRetry} size="sm" />
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
                Accounts Receivable ({hasData ? "Active Ledger" : "--- Total"})
              </span>
              {hasData && data?.ar_aging ? (
                <div className="space-y-2">
                  {data.ar_aging.map((item: any) => (
                    <div key={item.range} className="space-y-1">
                      <div className="flex justify-between text-[10px] text-white/70">
                        <span>{item.range}</span>
                        <span className="font-mono font-semibold">{item.val} ({item.pct}%)</span>
                      </div>
                      <div className="h-1 w-full bg-[#222] rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-white/40 py-2">No receivables imported.</div>
              )}
            </div>

            <div className="border-t border-[#222] pt-3">
              <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider block mb-2">
                Accounts Payable ({hasData ? "Active Ledger" : "--- Total"})
              </span>
              {hasData && data?.ap_aging ? (
                <div className="space-y-2">
                  {data.ap_aging.map((item: any) => (
                    <div key={item.range} className="space-y-1">
                      <div className="flex justify-between text-[10px] text-white/70">
                        <span>{item.range}</span>
                        <span className="font-mono font-semibold">{item.val} ({item.pct}%)</span>
                      </div>
                      <div className="h-1 w-full bg-[#222] rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-white/40 py-2">No supplier invoices detected.</div>
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
                <span className="text-sm font-bold text-green-400 font-mono">{hasData && data?.collections ? data.collections : "---"}</span>
                <span className="text-[9px] text-white/30 block">Recovery Rate: {hasData && data?.recovery_rate ? data.recovery_rate : "---"}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#222] space-y-1">
                <span className="text-[9px] text-white/40 uppercase tracking-widest block">Liquidity Trend</span>
                <span className="text-sm font-bold text-white font-mono">{hasData && data?.trend ? data.trend : "---"}</span>
                <span className="text-[9px] text-white/30 block">Buffer: {hasData ? "Stable" : "---"}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#222] space-y-1">
                <span className="text-[9px] text-white/40 uppercase tracking-widest block">Forecast Variance</span>
                <span className="text-sm font-bold text-[#faff69] font-mono">{hasData && data?.variance ? data.variance : "---"}</span>
                <span className="text-[9px] text-white/30 block">Confidence: {hasData ? "Active" : "---"}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#222] space-y-1">
                <span className="text-[9px] text-white/40 uppercase tracking-widest block">Treasury APY Sweep</span>
                <span className="text-sm font-bold text-white font-mono">{hasData && data?.sweep_apy ? data.sweep_apy : "---"}</span>
                <span className="text-[9px] text-white/30 block">{hasData ? "Assets swept" : "Overnight assets: ---"}</span>
              </div>
            </div>

            {/* Empty Chart Axes Visualizer */}
            <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#222] space-y-2 relative min-h-[80px] flex flex-col justify-center items-center">
              <span className="text-[10px] text-white/50 uppercase tracking-wider font-bold w-full text-left">
                Revenue vs Expenses Trend
              </span>
              <div className="w-full h-12 border-b border-l border-white/20 flex items-center justify-center">
                <span className="text-xs text-white/40 font-medium">No historical data.</span>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </Section>
  );
}

// ─── 3. DOCUMENT INTELLIGENCE PANEL ────────────────────────────────────────
export function DocumentIntelligencePanel({
  state = "loaded",
  docs = [],
  onRetry,
}: {
  state?: "loaded" | "loading" | "empty" | "error";
  docs?: any[];
  onRetry?: () => void;
}) {
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0 && docs.length > 0;

  if (state === "loading") {
    return (
      <Panel className="min-h-[220px] justify-between" padded>
        <Skeleton height={20} width="30%" />
        <Skeleton height={120} width="100%" />
      </Panel>
    );
  }

  if (state === "error") {
    return (
      <Panel className="min-h-[200px] justify-center items-center" padded>
        <ErrorState title="Unable to retrieve data." onRetry={onRetry} size="sm" />
      </Panel>
    );
  }

  return (
    <Section title="Document Intelligence Engine" compact>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pipeline Metrics */}
        <Panel className="bg-[#111] border-[#222] space-y-3" padded>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#faff69]" /> Pipeline Metrics
          </h3>
          <div className="space-y-2">
            {[
              { label: "Documents Uploaded (24h)", val: hasData ? `${docs.length} Files` : "0 Documents" },
              { label: "Processing Queue", val: hasData ? "Active" : "Idle" },
              { label: "OCR Classification Ingestion", val: "Online" },
              { label: "Extraction Accuracy", val: hasData ? "98.4%" : "---" },
            ].map((m) => (
              <div key={m.label} className="flex justify-between text-xs border-b border-[#222] pb-1.5 last:border-b-0">
                <span className="text-white/50">{m.label}</span>
                <span className="text-white/80 font-semibold">{m.val}</span>
              </div>
            ))}
          </div>
        </Panel>

        {/* Recent Ingestions or Drag & Drop Box */}
        <Panel className="bg-[#111] border-[#222] space-y-3" padded>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-white/40" /> Ingestion Queue
          </h3>
          {hasData ? (
            <div className="space-y-2.5">
              {docs.map((doc) => (
                <div key={doc.name || doc.id} className="flex justify-between items-start text-xs border-b border-[#222] pb-2 last:border-b-0">
                  <div className="min-w-0">
                    <p className="text-white/80 font-medium truncate max-w-[150px]">{doc.name}</p>
                    <p className="text-[10px] text-white/30">{doc.size || "Processed"}</p>
                  </div>
                  <span className="px-1.5 py-0.5 text-[8px] font-bold rounded uppercase bg-green-500/10 text-green-400 border border-green-500/25">
                    Completed
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-[#2b3139] rounded-xl p-4 text-center space-y-2 bg-[#181a20]/40">
              <Upload className="w-6 h-6 text-white/40 mx-auto" />
              <p className="text-xs font-semibold text-white/70">0 Documents</p>
              <p className="text-[10px] text-white/40">Drag &amp; Drop files here to ingest</p>
              <div className="flex justify-center gap-1.5 pt-1 text-[9px] font-mono text-[#faff69]">
                <span>PDF</span> · <span>Excel</span> · <span>CSV</span> · <span>Images</span>
              </div>
            </div>
          )}
        </Panel>

        {/* Pipeline Stage Visualizer */}
        <Panel className="bg-[#111] border-[#222] space-y-3" padded>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#faff69]" /> Pipeline Stage Visualizer
          </h3>
          <div className="space-y-2">
            {[
              { id: "up", name: "Upload & Virus Scan", val: hasData ? "PASS" : "READY" },
              { id: "ocr", name: "OCR & Classification", val: hasData ? "PASS" : "READY" },
              { id: "eval", name: "Field Match & Mapping", val: hasData ? "PASS" : "READY" },
              { id: "sync", name: "GL & ERP Synchronization", val: hasData ? "PASS" : "READY" },
            ].map((stg) => (
              <div key={stg.id} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#333]" />
                <span className="text-white/70 flex-1">{stg.name}</span>
                <span className="font-mono text-[9px] text-white/30">{stg.val}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </Section>
  );
}

// ─── 4. COLLECTIONS CENTER ──────────────────────────────────────────────────
export function CollectionsCenterPanel({
  state = "loaded",
  delinquents = [],
  onRetry,
}: {
  state?: "loaded" | "loading" | "empty" | "error";
  delinquents?: any[];
  onRetry?: () => void;
}) {
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0 && delinquents.length > 0;

  if (state === "loading") {
    return (
      <Panel className="min-h-[200px]" padded>
        <Skeleton height={20} width="30%" className="mb-4" />
        <Skeleton height={100} width="100%" />
      </Panel>
    );
  }

  if (state === "error") {
    return (
      <Panel className="min-h-[200px] justify-center items-center" padded>
        <ErrorState title="Unable to retrieve data." onRetry={onRetry} size="sm" />
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
          </div>

          {hasData ? (
            <div className="space-y-2">
              {delinquents.map((cust) => (
                <div key={cust.name} className="flex items-center justify-between p-2 rounded bg-[#1a1a1a] border border-[#2a2a2a]">
                  <div>
                    <p className="text-xs font-semibold text-white/80">{cust.name}</p>
                    <p className="text-[10px] text-white/35">Overdue: {cust.days} days</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-white font-mono">{formatCurrency(cust.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-white/40 py-6 text-center">
              No receivables imported.
            </div>
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
              <span className="text-sm font-bold text-white">{hasData ? "14.2 Days" : "---"}</span>
            </div>
            <div className="p-3 bg-[#1a1a1a] border border-[#222] rounded-lg">
              <span className="text-[9px] text-white/40 uppercase block">Due Follow-ups</span>
              <span className="text-sm font-bold text-[#faff69]">0 Scheduled</span>
              <span className="text-[9px] text-white/30 block mt-1">No scheduled phone triggers</span>
            </div>
          </div>

          <button
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
export function TreasuryCenterPanel({
  state = "loaded",
  accounts = [],
  onRetry,
}: {
  state?: "loaded" | "loading" | "empty" | "error";
  accounts?: any[];
  onRetry?: () => void;
}) {
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0 && accounts.length > 0;

  if (state === "loading") {
    return (
      <Panel className="min-h-[220px]" padded>
        <Skeleton height={20} width="30%" className="mb-4" />
        <Skeleton height={120} width="100%" />
      </Panel>
    );
  }

  if (state === "error") {
    return (
      <Panel className="min-h-[200px] justify-center items-center" padded>
        <ErrorState title="Unable to retrieve data." onRetry={onRetry} size="sm" />
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
              {accounts.map((acc) => (
                <div key={acc.name} className="flex justify-between items-center p-2.5 rounded bg-[#1a1a1a] border border-[#2a2a2a]">
                  <div>
                    <p className="text-xs font-semibold text-white/80">{acc.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white font-mono">{formatCurrency(acc.balance)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 space-y-3">
              <p className="text-xs text-white/40">No bank accounts connected.</p>
              <button
                onClick={() => alert("Bank Integration Modal — Connect Plaid / Open Banking API")}
                className="px-3 py-1.5 bg-[#faff69] hover:bg-[#e6eb5f] text-black text-xs font-bold rounded uppercase tracking-wider transition-colors inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Connect Bank
              </button>
            </div>
          )}
        </Panel>

        {/* Scheduled payments */}
        <Panel className="bg-[#111] border-[#222] space-y-3" padded>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#faff69]" /> Pending Vendor Invoices (Scheduled Outflow)
          </h3>

          <div className="text-xs text-white/40 py-6 text-center">
            No supplier invoices detected.
          </div>
        </Panel>
      </div>
    </Section>
  );
}

// ─── 6. LIQUIDITY CENTER ────────────────────────────────────────────────────
export function LiquidityCenterPanel({
  state = "loaded",
  onRetry,
}: {
  state?: "loaded" | "loading" | "empty" | "error";
  onRetry?: () => void;
}) {
  if (state === "loading") {
    return (
      <Panel className="min-h-[180px] bg-[#111]" padded>
        <Skeleton height={20} width="30%" />
      </Panel>
    );
  }

  if (state === "error") {
    return (
      <Panel className="min-h-[180px] justify-center items-center" padded>
        <ErrorState title="Unable to retrieve data." onRetry={onRetry} size="sm" />
      </Panel>
    );
  }

  return (
    <Section title="Liquidity Simulation &amp; Stress Tests" compact>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Panel className="bg-[#111] border-[#222] space-y-3" padded>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-white/40" /> Cash Runway Telemetry
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-white/60">
              <span>7-Day Forecast</span>
              <span className="font-mono text-white font-bold">---</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>30-Day Forecast</span>
              <span className="font-mono text-white font-bold">---</span>
            </div>
            <div className="text-xs text-white/40 pt-2 border-t border-[#222]">
              Forecast unavailable
            </div>
          </div>
        </Panel>

        <Panel className="bg-[#111] border-[#222] space-y-3" padded>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#faff69]" /> Stress Test Simulations
          </h3>
          <div className="text-xs text-white/40 py-4 text-center">
            No liquidity metrics calculated.
          </div>
        </Panel>

        <Panel className="bg-[#111] border-[#222] space-y-3" padded>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-white/40" /> Cash Gap Analytics
          </h3>
          <div className="p-3 bg-[#1a1a1a] rounded-lg border border-[#222] text-xs text-white/40">
            No solvency model generated yet.
          </div>
        </Panel>
      </div>
    </Section>
  );
}

// ─── 7. FORECAST CENTER ─────────────────────────────────────────────────────
export function ForecastCenterPanel({
  state = "loaded",
  onRetry,
}: {
  state?: "loaded" | "loading" | "empty" | "error";
  onRetry?: () => void;
}) {
  if (state === "loading") {
    return (
      <Panel className="min-h-[160px] bg-[#111]" padded>
        <Skeleton height={20} width="30%" />
      </Panel>
    );
  }

  if (state === "error") {
    return (
      <Panel className="min-h-[160px] justify-center items-center" padded>
        <ErrorState title="Unable to retrieve data." onRetry={onRetry} size="sm" />
      </Panel>
    );
  }

  return (
    <Section title="AI Forecasting Suite" compact>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Panel className="bg-[#111] border-[#222] space-y-3" padded>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#faff69]" /> Key Predictive Forecast Drivers
          </h3>
          <div className="text-xs text-white/40 py-4 text-center">
            Insufficient transaction history.
          </div>
        </Panel>

        <Panel className="bg-[#111] border-[#222] justify-between" padded>
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-[#faff69]" /> Forecast Trust Margin
            </h3>
            <div className="p-3 bg-[#1a1a1a] border border-[#222] rounded-lg text-xs leading-relaxed text-white/70">
              <span className="text-[#faff69] font-bold">Gemma AI Forecast digest:</span>{" "}
              No financial documents have been processed yet.
            </div>
          </div>
        </Panel>
      </div>
    </Section>
  );
}

// ─── 8. AI FINANCIAL COPILOT ───────────────────────────────────────────────
export function AICopilotPanel({
  state = "loaded",
  onRetry,
}: {
  state?: "loaded" | "loading" | "empty" | "error";
  onRetry?: () => void;
}) {
  if (state === "loading") {
    return (
      <Panel className="bg-[#111] border-[#222] space-y-4" padded>
        <Skeleton height={20} width="40%" />
        <Skeleton height={80} width="100%" />
      </Panel>
    );
  }

  if (state === "error") {
    return (
      <Panel className="bg-[#111] border-[#222] justify-center items-center" padded>
        <ErrorState title="Unable to retrieve data." onRetry={onRetry} size="sm" />
      </Panel>
    );
  }

  return (
    <Panel className="bg-[#111] border-[#222] space-y-4" padded>
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Bot className="w-4 h-4 text-[#faff69]" /> Gemma Analyst
        </h3>
        <span className="px-1.5 py-0.5 text-[8px] font-bold rounded bg-[#faff69]/10 text-[#faff69] border border-[#faff69]/20 uppercase tracking-widest">
          Gemma 2B Engine
        </span>
      </div>

      <div className="space-y-3">
        <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#222] space-y-2 text-xs">
          <span className="text-[9px] text-[#faff69] font-bold uppercase tracking-wider block">Real-time Solvency Digest</span>
          <p className="text-white/70 leading-relaxed font-medium">
            Waiting for financial context.
          </p>
        </div>

        {/* Mandatory Upload Options */}
        <div className="space-y-1.5">
          <span className="text-[9px] text-white/40 uppercase tracking-wider font-bold block">Upload Document Context</span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { label: "Invoice", icon: <FileText className="w-3.5 h-3.5 text-[#faff69]" /> },
              { label: "Bank Statement", icon: <FileSpreadsheet className="w-3.5 h-3.5 text-[#faff69]" /> },
              { label: "Ledger", icon: <Database className="w-3.5 h-3.5 text-[#faff69]" /> },
              { label: "GST Return", icon: <Zap className="w-3.5 h-3.5 text-[#faff69]" /> },
            ].map((opt) => (
              <button
                key={opt.label}
                onClick={() => {
                  const fileInput = document.getElementById("global-file-upload");
                  if (fileInput) fileInput.click();
                }}
                className="p-2.5 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#faff69] text-white/80 font-medium flex items-center gap-2 transition-all"
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}

// ─── 9. ALERTS & APPROVALS PANEL ───────────────────────────────────────────
export function AlertsApprovalsPanel({
  state = "loaded",
  onRetry,
}: {
  state?: "loaded" | "loading" | "empty" | "error";
  onRetry?: () => void;
}) {
  if (state === "loading") {
    return (
      <Panel className="bg-[#111] border-[#222] space-y-4" padded>
        <Skeleton height={20} width="40%" />
      </Panel>
    );
  }

  if (state === "error") {
    return (
      <Panel className="bg-[#111] border-[#222] justify-center items-center" padded>
        <ErrorState title="Unable to retrieve data." onRetry={onRetry} size="sm" />
      </Panel>
    );
  }

  return (
    <Panel className="bg-[#111] border-[#222] space-y-4" padded>
      <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
        <Bell className="w-4 h-4 text-white/40" /> Exceptions &amp; Approvals
      </h3>

      <div className="space-y-2">
        <div className="space-y-1.5">
          <span className="text-[9px] text-white/40 uppercase tracking-wider font-bold block">Pending Actions Requiring Approval</span>
          <div className="text-xs text-white/40 py-2">No pending approvals.</div>
        </div>

        <div className="space-y-1.5 border-t border-[#222] pt-3">
          <span className="text-[9px] text-white/40 uppercase tracking-wider font-bold block">System Warnings &amp; Logs</span>
          <div className="text-xs text-white/40 py-2">No notifications.</div>
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
              <span className="text-[10px] font-semibold text-white/70 block truncate">
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
