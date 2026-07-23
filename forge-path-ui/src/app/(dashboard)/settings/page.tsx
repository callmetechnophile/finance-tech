"use client";

import React, { useState } from "react";
import { Sliders, Shield, Key, Building2, Bell, Save, CheckCircle2, UserCheck } from "lucide-react";
import { PageContainer } from "@/shared/components/layout/PageContainer";
import { WorkspaceHeader } from "@/shared/components/layout/WorkspaceHeader";
import { Section } from "@/shared/components/layout/Section";
import { Panel } from "@/shared/components/layout/Panel";
import { useWorkspaceStore } from "@/shared/stores/workspace.store";
import type { SupportedCurrency } from "@/shared/utils/currency";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const { currency, setCurrency } = useWorkspaceStore();

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const HeaderActions = (
    <div className="flex items-center gap-2">
      <button
        onClick={handleSave}
        className="px-3 py-1.5 rounded-lg bg-[#faff69] hover:bg-[#e6eb52] text-black text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        <Save className="w-3.5 h-3.5 fill-black" />
        <span>{saved ? "Settings Saved!" : "Save Changes"}</span>
      </button>
    </div>
  );

  const HeaderBadge = (
    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#faff69]/10 text-[#faff69] border border-[#faff69]/20 uppercase tracking-wider">
      Clerk RBAC &amp; System Configuration
    </span>
  );

  return (
    <div className="h-full flex flex-col min-h-0 bg-[#0a0a0a]" aria-label="Settings & Security Configuration">
      <WorkspaceHeader
        title="Settings &amp; Workspace Security"
        subtitle="Manage organization profiles, Clerk auth options, API provider keys, and automated risk alert thresholds."
        icon={<Sliders className="w-5 h-5 text-[#faff69]" aria-hidden="true" />}
        badge={HeaderBadge}
        actions={HeaderActions}
        bordered={true}
        className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#2a2a2a]"
      />

      <PageContainer scrollable={true} padded={true} className="flex-1 space-y-6 pb-16">
        {/* Organization Profile */}
        <Section title="Organization &amp; Legal Entity Profile" compact>
          <Panel className="bg-[#111] border-[#222] space-y-4" padded>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">Company Name</label>
                <input
                  type="text"
                  defaultValue="Apex Manufacturing Inc."
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-[#faff69]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">Industry Sector</label>
                <input
                  type="text"
                  defaultValue="CNC Machinery & Fabrication"
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-[#faff69]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">Base Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-[#faff69] cursor-pointer"
                >
                  <option value="INR">INR (₹) — Indian Rupee</option>
                  <option value="USD">USD ($) — US Dollar</option>
                  <option value="EUR">EUR (€) — Euro</option>
                  <option value="GBP">GBP (£) — British Pound</option>
                  <option value="JPY">JPY (¥) — Japanese Yen</option>
                  <option value="AED">AED (د.إ) — UAE Dirham</option>
                  <option value="SGD">SGD (S$) — Singapore Dollar</option>
                </select>
                <p className="text-[9px] text-white/25 mt-1">Changes apply globally across all modules.</p>
              </div>
            </div>
          </Panel>
        </Section>

        {/* API Credentials & Integrations */}
        <Section title="External Provider Credentials &amp; Integrations" compact>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Panel className="bg-[#111] border-[#222] space-y-3" padded>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#faff69]" /> AI &amp; Database API Keys
              </h3>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-white/40 uppercase block mb-1">NVIDIA NIM Inference Key</span>
                  <input
                    type="password"
                    defaultValue="nvapi-live-prod-gemma-inference-token-9982"
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded px-3 py-1.5 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase block mb-1">Neon Serverless PostgreSQL URL</span>
                  <input
                    type="password"
                    defaultValue="postgresql://forge_user:****@ep-cool-db-123456.neon.tech/neondb"
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded px-3 py-1.5 text-white font-mono text-xs"
                  />
                </div>
              </div>
            </Panel>

            <Panel className="bg-[#111] border-[#222] space-y-3" padded>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-blue-400" /> Outreach &amp; Notification Providers
              </h3>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-white/40 uppercase block mb-1">Brevo Transactional Email Key</span>
                  <input
                    type="password"
                    defaultValue="xkeysib-prod-brevo-email-dispatch-token"
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded px-3 py-1.5 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase block mb-1">Twilio SMS Account SID</span>
                  <input
                    type="password"
                    defaultValue="AC_prod_twilio_sid_99218"
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded px-3 py-1.5 text-white font-mono text-xs"
                  />
                </div>
              </div>
            </Panel>
          </div>
        </Section>

        {/* Team Members & RBAC Table */}
        <Section title="Team Members &amp; Clerk Role Permissions" compact>
          <Panel className="bg-[#111] border-[#222] space-y-3" padded>
            <div className="divide-y divide-[#222]/60 text-xs">
              {[
                { name: "Alexander Miller", email: "finance@apex.com", role: "CFO / Admin", status: "Active Session" },
                { name: "Sarah Jenkins", email: "treasury@apex.com", role: "Treasury Officer", status: "Active Session" },
                { name: "David Vance", email: "collections@apex.com", role: "Collections Specialist", status: "Active" },
              ].map((m) => (
                <div key={m.email} className="py-2.5 flex justify-between items-center">
                  <div>
                    <span className="text-white font-bold block">{m.name}</span>
                    <span className="text-[10px] text-white/40">{m.email}</span>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded bg-[#faff69]/10 text-[#faff69] border border-[#faff69]/20 font-bold text-[9px] uppercase">
                      {m.role}
                    </span>
                    <span className="text-[9px] text-green-400 block mt-0.5">{m.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </Section>
      </PageContainer>
    </div>
  );
}
