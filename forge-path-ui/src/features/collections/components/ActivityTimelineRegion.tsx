"use client";

import React from "react";
import { Clock, CheckCircle2, AlertTriangle, Mail, PhoneCall } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { AuditCard } from "@/shared/components/enterprise/AuditCard";

export function ActivityTimelineRegion() {
  return (
    <Panel className="bg-[#111] border-[#222] space-y-3" padded>
      <div className="flex justify-between items-center border-b border-[#222] pb-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-white/50" /> Collections Activity Feed
        </h3>
        <span className="text-[10px] text-white/40 font-mono">Real-time Stream</span>
      </div>

      <div className="divide-y divide-[#222]/60">
        <AuditCard
          actor="Alexander Miller"
          action="sent Brevo L2 Demand SMS to"
          target="Apex Steel Works"
          timestamp="14 min ago"
          detail="Targeted overdue invoice INV-2024-089 (₹47,500)."
        />
        <AuditCard
          actor="System Ingestion"
          action="recorded wire payment match for"
          target="Delta Fabrication (₹28,000)"
          timestamp="2 hours ago"
          detail="Cleared invoice INV-2024-074 from collections queue."
        />
        <AuditCard
          actor="Gemma Collections AI"
          action="adjusted payment probability vector for"
          target="Titan Aerospace (₹18,000)"
          timestamp="4 hours ago"
          detail="Confidence rating updated to 88% based on historical payment pattern."
        />
      </div>
    </Panel>
  );
}
