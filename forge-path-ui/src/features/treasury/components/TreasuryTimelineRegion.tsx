"use client";

import React from "react";
import { Clock, Landmark, CheckCircle2, ShieldCheck, DollarSign } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { AuditCard } from "@/shared/components/enterprise/AuditCard";

export function TreasuryTimelineRegion() {
  return (
    <Panel className="bg-[#111] border-[#222] space-y-3" padded>
      <div className="flex justify-between items-center border-b border-[#222] pb-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-white/50" /> Treasury Operations Feed
        </h3>
        <span className="text-[10px] text-white/40 font-mono">Real-time Feed</span>
      </div>

      <div className="divide-y divide-[#222]/60">
        <AuditCard
          actor="Alexander Miller"
          action="approved dual-signature wire for"
          target="CNC Machine Contract (₹45,000)"
          timestamp="30 min ago"
          detail="1st signature authorized. Pending 2nd CFO authorization."
        />
        <AuditCard
          actor="Gemma Treasury Engine"
          action="executed automated yield sweep of"
          target="₹42,000 → Neon Yield Reserve"
          timestamp="2 hours ago"
          detail="Swept idle Chase checking funds to 4.8% APY reserve."
        />
        <AuditCard
          actor="Chase Open Banking API"
          action="reconciled 8 bank statement transactions for"
          target="Chase Operating ...0192"
          timestamp="5 hours ago"
          detail="Zero reconciliation discrepancy detected across accounts payable."
        />
      </div>
    </Panel>
  );
}
