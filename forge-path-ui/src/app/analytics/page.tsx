"use client";

import { AppShell } from "@/components/layout/AppShell";
import { Activity, ShieldCheck, Zap } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <AppShell>
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <div>
          <h2 className="text-xl font-bold text-white">Interactive Analytics & BI Grids</h2>
          <p className="text-xs text-[#888888] mt-1">
            Standard Ledger analytical profiles and cash intelligence graphs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] space-y-4">
            <div className="w-10 h-10 rounded-md bg-[#faff69]/10 border border-[#faff69]/25 flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#faff69]" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Ingestion Performance</h3>
            <p className="text-xs text-[#cccccc]">
              Standardized invoice processing latency is under 180ms using NVIDIA NIM acceleration.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] space-y-4">
            <div className="w-10 h-10 rounded-md bg-[#faff69]/10 border border-[#faff69]/25 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#faff69]" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">NeonDB Integrity</h3>
            <p className="text-xs text-[#cccccc]">
              All processed ledgers are synchronized with primary Neon postgres tables with 100% durability.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] space-y-4">
            <div className="w-10 h-10 rounded-md bg-[#faff69]/10 border border-[#faff69]/25 flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#faff69]" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Standard Metrics</h3>
            <p className="text-xs text-[#cccccc]">
              Real-time calculation of EBITDA, cash conversion cycles, and DSO metrics.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
