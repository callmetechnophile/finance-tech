"use client";

import React from "react";
import { DollarSign, Clock, ShieldAlert, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { Section } from "@/shared/components/layout/Section";

export function PaymentQueueRegion() {
  const payouts = [
    {
      id: "pay-1",
      vendor: "CNC Machinery Corp",
      amount: "$45,000",
      dueDate: "July 24, 2026",
      status: "Approval Pending",
      discount: "Save $900 (2/10 net 30)",
      isHighValue: true,
    },
    {
      id: "pay-2",
      vendor: "NVIDIA NIM Cloud Services",
      amount: "$18,400",
      dueDate: "July 28, 2026",
      status: "Scheduled",
      discount: "Save $368 (2/10 net 30)",
      isHighValue: false,
    },
    {
      id: "pay-3",
      vendor: "Steel Traders Inc",
      amount: "$22,000",
      dueDate: "August 2, 2026",
      status: "Queued",
      discount: "N/A",
      isHighValue: false,
    },
    {
      id: "pay-4",
      vendor: "Apex Industrial Tooling",
      amount: "$33,000",
      dueDate: "August 10, 2026",
      status: "Queued",
      discount: "N/A",
      isHighValue: false,
    },
  ];

  return (
    <Section title="Vendor Payment Queue &amp; Discount Capture" compact>
      <Panel className="bg-[#111] border-[#222] space-y-3" padded>
        <div className="flex justify-between items-center border-b border-[#222] pb-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-[#faff69]" /> Scheduled Supplier Payouts
          </h3>
          <span className="text-[10px] text-white/40 font-mono">4 Payables Queued ($118,400)</span>
        </div>

        <div className="space-y-2">
          {payouts.map((p) => (
            <div
              key={p.id}
              className="p-3 rounded-lg bg-[#1a1a1a] border border-[#222] flex flex-wrap items-center justify-between gap-3 text-xs"
            >
              <div className="min-w-[160px]">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white">{p.vendor}</span>
                  {p.isHighValue && (
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
                      High Value
                    </span>
                  )}
                </div>
                <span className="text-[9px] text-white/40 block mt-0.5">Due: {p.dueDate}</span>
              </div>

              <div className="flex items-center gap-4">
                {p.discount !== "N/A" && (
                  <span className="text-[10px] text-green-400 font-semibold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                    {p.discount}
                  </span>
                )}
                <span className="font-mono font-bold text-white text-sm">{p.amount}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Initiated early payment processing for ${p.vendor} (${p.amount}).`)}
                  className="px-2.5 py-1 rounded bg-[#faff69] hover:bg-[#e6eb52] text-black text-[10px] font-bold uppercase transition-colors cursor-pointer"
                >
                  Pay Now
                </button>
                <button
                  onClick={() => alert(`Deferred payment for ${p.vendor} by +14 days.`)}
                  className="px-2.5 py-1 rounded bg-[#2a2a2a] hover:bg-[#333] text-white/70 text-[10px] font-semibold border border-[#333] transition-colors cursor-pointer"
                >
                  Delay +14d
                </button>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </Section>
  );
}
