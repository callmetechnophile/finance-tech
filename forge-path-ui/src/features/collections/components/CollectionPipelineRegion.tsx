"use client";

import React from "react";
import { ArrowRight, Mail, MessageSquare, PhoneCall, ShieldAlert } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { Section } from "@/shared/components/layout/Section";
import { useDocumentStatusStore } from "@/shared/stores/document-status.store";

export function CollectionPipelineRegion() {
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;

  const stages = [
    { level: "L1", title: "Friendly Email", icon: <Mail className="w-3.5 h-3.5 text-blue-400" /> },
    { level: "L2", title: "SMS Demand", icon: <MessageSquare className="w-3.5 h-3.5 text-[#faff69]" /> },
    { level: "L3", title: "Phone Call", icon: <PhoneCall className="w-3.5 h-3.5 text-amber-400" /> },
    { level: "L4", title: "Legal Notice", icon: <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> },
  ];

  return (
    <Section title="Collection Workflow Pipeline &amp; Escalation Stages" compact>
      <Panel className="bg-[#111] border-[#222] space-y-3" padded>
        <div className="flex justify-between items-center border-b border-[#222] pb-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <ArrowRight className="w-3.5 h-3.5 text-[#faff69]" /> Automated Escalation Workflow
          </h3>
          <span className="text-[10px] text-white/40 font-mono">{hasData ? "Active Queue" : "0 Invoices Queued"}</span>
        </div>

        {hasData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {stages.map((stg) => (
              <div key={stg.level} className="p-3 rounded-lg border border-[#222] bg-[#1a1a1a] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-white/10 text-white">
                    Stage {stg.level}
                  </span>
                  {stg.icon}
                </div>
                <h4 className="font-bold text-white text-xs">{stg.title}</h4>
                <div className="border-t border-white/10 pt-2 flex justify-between items-center">
                  <span className="text-[10px] text-white/40">Total:</span>
                  <span className="font-mono font-bold text-white">---</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-white/40">
            No receivables imported.
          </div>
        )}
      </Panel>
    </Section>
  );
}
