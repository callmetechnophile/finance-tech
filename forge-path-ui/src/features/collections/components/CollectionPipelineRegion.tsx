"use client";

import React from "react";
import { ArrowRight, Mail, MessageSquare, PhoneCall, ShieldAlert, ChevronRight } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { Section } from "@/shared/components/layout/Section";

export function CollectionPipelineRegion() {
  const stages = [
    {
      level: "L1",
      title: "Friendly Email",
      count: "5 Invoices",
      amount: "₹1,12,000",
      icon: <Mail className="w-3.5 h-3.5 text-blue-400" />,
      color: "border-blue-500/30 bg-blue-500/5",
    },
    {
      level: "L2",
      title: "SMS Demand",
      count: "3 Invoices",
      amount: "₹65,000",
      icon: <MessageSquare className="w-3.5 h-3.5 text-[#faff69]" />,
      color: "border-[#faff69]/30 bg-[#faff69]/5",
    },
    {
      level: "L3",
      title: "Phone Call",
      count: "2 Invoices",
      amount: "₹35,000",
      icon: <PhoneCall className="w-3.5 h-3.5 text-amber-400" />,
      color: "border-amber-500/30 bg-amber-500/5",
    },
    {
      level: "L4",
      title: "Legal Notice",
      count: "2 Invoices",
      amount: "₹72,500",
      icon: <ShieldAlert className="w-3.5 h-3.5 text-red-400" />,
      color: "border-red-500/30 bg-red-500/5",
    },
  ];

  return (
    <Section title="Collection Workflow Pipeline &amp; Escalation Stages" compact>
      <Panel className="bg-[#111] border-[#222] space-y-3" padded>
        <div className="flex justify-between items-center border-b border-[#222] pb-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <ArrowRight className="w-3.5 h-3.5 text-[#faff69]" /> Automated Escalation Workflow
          </h3>
          <span className="text-[10px] text-white/40 font-mono">12 Total Invoices Queued</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {stages.map((stg) => (
            <div
              key={stg.level}
              className={`p-3 rounded-lg border ${stg.color} space-y-2 text-xs flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-white/10 text-white">
                    Stage {stg.level}
                  </span>
                  {stg.icon}
                </div>
                <h4 className="font-bold text-white mt-2 text-xs">{stg.title}</h4>
                <p className="text-[10px] text-white/50 mt-0.5">{stg.count}</p>
              </div>

              <div className="border-t border-white/10 pt-2 flex justify-between items-center">
                <span className="text-[10px] text-white/40">Total:</span>
                <span className="font-mono font-bold text-white">{stg.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </Section>
  );
}
