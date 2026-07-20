"use client";

import React, { useState } from "react";
import { Sliders, Activity, Server, Database, Bot, Users, Shield, RefreshCw, Terminal, CheckCircle2 } from "lucide-react";
import { PageContainer } from "@/shared/components/layout/PageContainer";
import { WorkspaceHeader } from "@/shared/components/layout/WorkspaceHeader";
import { Section } from "@/shared/components/layout/Section";
import { Panel } from "@/shared/components/layout/Panel";
import { MetricCard } from "@/shared/components/cards/MetricCard";
import { AuditCard } from "@/shared/components/enterprise/AuditCard";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"health" | "logs" | "workers" | "security">("health");

  const HeaderActions = (
    <div className="flex items-center gap-2">
      <button
        onClick={() => alert("Re-syncing system health telemetry across all services.")}
        className="px-3 py-1.5 rounded-lg bg-[#faff69] hover:bg-[#e6eb52] text-black text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        <RefreshCw className="w-3.5 h-3.5 fill-black" />
        <span>Refresh Metrics</span>
      </button>
    </div>
  );

  const HeaderBadge = (
    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-wider flex items-center gap-1">
      <Activity className="w-3 h-3" /> System Status: Operational
    </span>
  );

  const apiLogs = [
    { method: "GET", path: "/api/v1/health", status: 200, latency: "1.2ms", time: "Just now" },
    { method: "POST", path: "/api/v1/copilot/chat", status: 200, latency: "145ms", time: "1 min ago" },
    { method: "GET", path: "/api/v1/cashflow/forecast", status: 200, latency: "4.8ms", time: "2 min ago" },
    { method: "POST", path: "/api/v1/documents/upload", status: 200, latency: "320ms", time: "5 min ago" },
  ];

  const workers = [
    { name: "OCR Ingestion Worker #1", status: "Idle / Active", queue: "0 pending", uptime: "99.98%" },
    { name: "NeonDB ACID Writer", status: "Processing", queue: "1 job", uptime: "100.0%" },
    { name: "Brevo Email Dispatcher", status: "Idle", queue: "0 pending", uptime: "99.95%" },
    { name: "NVIDIA NIM Inference Proxy", status: "Active", queue: "0 pending", uptime: "99.99%" },
  ];

  return (
    <div className="h-full flex flex-col min-h-0 bg-[#0a0a0a]" aria-label="Administration & System Health Console">
      <WorkspaceHeader
        title="Admin Console &amp; Monitoring Dashboard"
        subtitle="Real-time system telemetry, API latency monitoring, worker queue health, and security audit trail."
        icon={<Sliders className="w-5 h-5 text-[#faff69]" aria-hidden="true" />}
        badge={HeaderBadge}
        actions={HeaderActions}
        bordered={true}
        className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#2a2a2a]"
      />

      <PageContainer scrollable={true} padded={true} className="flex-1 space-y-6">
        {/* System Metrics Telemetry Row */}
        <Section title="Infrastructure Telemetry" compact>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard
              label="API Uptime"
              value="99.99%"
              trend={{ value: "Operational", direction: "up" }}
              severity="positive"
              icon={<Server className="w-4 h-4 text-green-400" />}
            />
            <MetricCard
              label="Avg API Latency"
              value="14.2 ms"
              trend={{ value: "Optimal", direction: "up" }}
              severity="positive"
              icon={<Activity className="w-4 h-4 text-[#faff69]" />}
            />
            <MetricCard
              label="NeonDB Health"
              value="Connected"
              trend={{ value: "1.2ms query", direction: "up" }}
              severity="positive"
              icon={<Database className="w-4 h-4 text-blue-400" />}
            />
            <MetricCard
              label="NVIDIA NIM AI Proxy"
              value="145 ms"
              trend={{ value: "Operational", direction: "up" }}
              severity="positive"
              icon={<Bot className="w-4 h-4 text-green-400" />}
            />
          </div>
        </Section>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-[#222] pb-2">
          {(["health", "logs", "workers", "security"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={[
                "px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer",
                activeTab === t
                  ? "bg-[#2a2a2a] text-white border border-white/10"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              ].join(" ")}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab Panels */}
        {activeTab === "health" && (
          <Section title="System Component Services" compact>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Panel className="bg-[#111] border-[#222] space-y-3" padded>
                <div className="flex justify-between items-center border-b border-[#222] pb-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-[#faff69]" /> Service Health Probe
                  </h3>
                  <span className="text-[9px] font-mono text-green-400">All 5 Probe Groups OK</span>
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    { name: "FastAPI Backend Core", status: "200 OK (1.2ms)", type: "API Engine" },
                    { name: "Neon PostgreSQL Instance", status: "Connected (Pool: 10/20)", type: "Database" },
                    { name: "Redis 7 Cache Cluster", status: "PONG (0.4ms)", type: "Broker" },
                    { name: "NVIDIA NIM Gemma Proxy", status: "Operational (145ms)", type: "Inference Engine" },
                  ].map((s) => (
                    <div key={s.name} className="p-2.5 rounded bg-[#1a1a1a] border border-[#222] flex justify-between items-center">
                      <div>
                        <span className="text-white font-semibold block">{s.name}</span>
                        <span className="text-[9px] text-white/40 block">{s.type}</span>
                      </div>
                      <span className="text-[10px] font-mono text-green-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {s.status}
                      </span>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel className="bg-[#111] border-[#222] space-y-3" padded>
                <div className="flex justify-between items-center border-b border-[#222] pb-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-white/50" /> System Audit Trail
                  </h3>
                  <span className="text-[10px] text-white/40 font-mono">Live Audit Logs</span>
                </div>
                <div className="divide-y divide-[#222]/60">
                  <AuditCard
                    actor="Alexander Miller (CFO)"
                    action="updated security config"
                    target="Session Timeout Policy"
                    timestamp="5 min ago"
                    detail="Set active JWT token expiration to 60 minutes."
                  />
                  <AuditCard
                    actor="FastAPI Middleware"
                    action="validated CORS headers for"
                    target="forge-path-ui.vercel.app"
                    timestamp="12 min ago"
                    detail="Allowed origins matched production whitelist."
                  />
                </div>
              </Panel>
            </div>
          </Section>
        )}

        {activeTab === "logs" && (
          <Section title="Access &amp; Request Latency Logs" compact>
            <Panel className="bg-[#111] border-[#222] space-y-2 font-mono text-xs" padded>
              <div className="flex justify-between items-center border-b border-[#222] pb-2 text-[10px] text-white/40">
                <span>Method / Path</span>
                <span>Status</span>
                <span>Latency</span>
                <span>Timestamp</span>
              </div>
              {apiLogs.map((log, idx) => (
                <div key={idx} className="p-2 rounded bg-[#1a1a1a] border border-[#222] flex justify-between items-center text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 text-[9px] font-bold">
                      {log.method}
                    </span>
                    <span className="text-white">{log.path}</span>
                  </div>
                  <span className="text-green-400 font-bold">{log.status}</span>
                  <span className="text-[#faff69]">{log.latency}</span>
                  <span className="text-white/40 text-[9px]">{log.time}</span>
                </div>
              ))}
            </Panel>
          </Section>
        )}

        {activeTab === "workers" && (
          <Section title="Background Job Workers" compact>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {workers.map((w) => (
                <Panel key={w.name} className="bg-[#111] border-[#222] space-y-2" padded>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{w.name}</span>
                    <span className="text-[9px] font-mono text-green-400 px-1.5 py-0.5 rounded bg-green-500/10 border border-green-500/20">
                      {w.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-white/40 border-t border-[#222] pt-2">
                    <span>Queue: <strong className="text-white">{w.queue}</strong></span>
                    <span>Uptime: <strong className="text-white">{w.uptime}</strong></span>
                  </div>
                </Panel>
              ))}
            </div>
          </Section>
        )}

        {activeTab === "security" && (
          <Section title="Security &amp; RBAC Control Panel" compact>
            <Panel className="bg-[#111] border-[#222] space-y-3" padded>
              <div className="flex justify-between items-center border-b border-[#222] pb-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#faff69]" /> Authentication &amp; Access Controls
                </h3>
                <span className="text-[10px] text-white/40 font-mono">Clerk &amp; Edge Protection</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#222] space-y-1">
                  <span className="text-[10px] text-white/40 uppercase block font-bold">Session Validation</span>
                  <span className="text-white font-semibold block">JWT Token Encryption</span>
                  <span className="text-green-400 text-[9px]">Active (HSTS &amp; Edge)</span>
                </div>
                <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#222] space-y-1">
                  <span className="text-[10px] text-white/40 uppercase block font-bold">Role-Based Access (RBAC)</span>
                  <span className="text-white font-semibold block">Admin / CFO / Analyst</span>
                  <span className="text-green-400 text-[9px]">3 Roles Enforced</span>
                </div>
                <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#222] space-y-1">
                  <span className="text-[10px] text-white/40 uppercase block font-bold">Rate Limiting</span>
                  <span className="text-white font-semibold block">100 req / minute</span>
                  <span className="text-[#faff69] text-[9px]">Enforced via Middleware</span>
                </div>
              </div>
            </Panel>
          </Section>
        )}
      </PageContainer>
    </div>
  );
}
