"use client";

import React from "react";
import { AlertTriangle, AlertCircle, Bell, ArrowRight } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";

export function AlertsPanelRegion() {
  const alerts = [
    {
      id: "alt-1",
      title: "Apex Steel 45d Delinquency",
      message: "Overdue invoice INV-2024-089 ($47,500) has exceeded L4 escalation threshold.",
      severity: "critical",
      time: "14 min ago",
    },
    {
      id: "alt-2",
      title: "CNC Maintenance Payment Due",
      message: "Annual maintenance wire ($45,000) scheduled for July 24.",
      severity: "warning",
      time: "1 hour ago",
    },
    {
      id: "alt-3",
      title: "Yield Sweep Recommendation",
      message: "Idle cash of $42,000 available for overnight treasury sweep.",
      severity: "info",
      time: "3 hours ago",
    },
  ];

  return (
    <Panel className="bg-[#111] border-[#222] space-y-3" padded>
      <div className="flex justify-between items-center border-b border-[#222] pb-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-red-400" /> Critical Liquidity Alerts
        </h3>
        <span className="px-1.5 py-0.5 text-[8px] font-bold rounded bg-red-500/10 text-red-400 border border-red-500/20 uppercase">
          {alerts.length} Active
        </span>
      </div>

      <div className="space-y-2">
        {alerts.map((alt) => (
          <div
            key={alt.id}
            className={[
              "p-2.5 rounded-lg border text-xs space-y-1 transition-colors",
              alt.severity === "critical" ? "bg-red-500/5 border-red-500/20" :
              alt.severity === "warning" ? "bg-amber-500/5 border-amber-500/20" :
              "bg-[#1a1a1a] border-[#222]"
            ].join(" ")}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                {alt.severity === "critical" ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
                {alt.title}
              </span>
              <span className="text-[9px] text-white/30">{alt.time}</span>
            </div>
            <p className="text-[10px] text-white/60 leading-relaxed pl-5">{alt.message}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
