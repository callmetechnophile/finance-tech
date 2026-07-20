"use client";

import React from "react";
import { ShieldCheck, Check, X, Clock, AlertTriangle } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { Section } from "@/shared/components/layout/Section";

export function ApprovalCenterRegion() {
  const pendingApprovals = [
    {
      id: "appr-1",
      title: "CNC Machine #3 Annual Maintenance Payout",
      vendor: "CNC Machinery Corp",
      amount: "$45,000",
      requestedBy: "Alexander Miller (CFO)",
      requiredSig: "2 / 2 Signatures Needed",
      urgency: "Due in 5 days",
    },
    {
      id: "appr-2",
      title: "NVIDIA NIM Infrastructure License Wire",
      vendor: "NVIDIA NIM Cloud",
      amount: "$18,400",
      requestedBy: "System Ingestion Engine",
      requiredSig: "1 / 2 Signatures Needed",
      urgency: "Due in 9 days",
    },
  ];

  return (
    <Section title="Dual-Signature Wire Release Approval Queue" compact>
      <Panel className="bg-[#111] border-[#222] space-y-3" padded>
        <div className="flex justify-between items-center border-b border-[#222] pb-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#faff69]" /> High-Value Payout Approvals
          </h3>
          <span className="px-1.5 py-0.5 text-[8px] font-bold rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
            {pendingApprovals.length} Pending Release
          </span>
        </div>

        <div className="space-y-2">
          {pendingApprovals.map((ap) => (
            <div
              key={ap.id}
              className="p-3 rounded-lg bg-[#1a1a1a] border border-[#222] flex flex-wrap items-center justify-between gap-3 text-xs"
            >
              <div className="min-w-[180px]">
                <span className="font-bold text-white block">{ap.title}</span>
                <span className="text-[10px] text-white/50 block mt-0.5">
                  Vendor: <strong className="text-white">{ap.vendor}</strong> · Req by {ap.requestedBy}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {ap.requiredSig}
                </span>
                <span className="font-mono font-bold text-white text-sm">{ap.amount}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Approved wire release for ${ap.title} (${ap.amount}). Signature verified.`)}
                  className="px-3 py-1 rounded bg-green-500 hover:bg-green-400 text-black text-[10px] font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3 h-3" /> Approve Wire
                </button>
                <button
                  onClick={() => alert(`Rejected wire release request for ${ap.title}.`)}
                  className="px-2 py-1 rounded bg-[#2a2a2a] hover:bg-red-500/20 hover:text-red-400 text-white/50 text-[10px] font-bold transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </Section>
  );
}
