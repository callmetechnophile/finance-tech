"use client";

import React from "react";
import { Clock, Activity, CheckCircle2, RefreshCw } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { AuditCard } from "@/shared/components/enterprise/AuditCard";

export function TimelinePlaceholder() {
  return (
    <Panel className="bg-[#111] border-[#222] space-y-3" padded>
      <div className="flex justify-between items-center border-b border-[#222] pb-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-white/50" /> Forecast Operations Timeline
        </h3>
        <span className="text-[10px] text-white/40 font-mono">Live Feed</span>
      </div>

      <div className="divide-y divide-[#222]/60">
        <AuditCard
          actor="Gemma AI Predictor"
          action="re-calculated 30-day forecast horizon for"
          target="Q3 Cash Model"
          timestamp="10 min ago"
          detail="Adjusted runway buffer to 68 days based on Delta Fab wire receipt."
        />
        <AuditCard
          actor="Alexander Miller"
          action="executed stress scenario run"
          target="Supply Chain Cost Shock"
          timestamp="1 hour ago"
          detail="Evaluated minimum cash exposure at ₹2,12,000 threshold."
        />
        <AuditCard
          actor="NeonDB Ledger Sync"
          action="ingested bank statement feed"
          target="Chase Operating ...0192"
          timestamp="3 hours ago"
          detail="Matched 12 bank statement lines against pending receivables queue."
        />
      </div>
    </Panel>
  );
}
