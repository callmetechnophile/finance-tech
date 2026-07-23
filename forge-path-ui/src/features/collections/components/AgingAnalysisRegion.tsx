"use client";

import React from "react";
import { Clock } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { Section } from "@/shared/components/layout/Section";
import { useDocumentStatusStore } from "@/shared/stores/document-status.store";

export function AgingAnalysisRegion() {
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;

  return (
    <Section title="AR Aging Analysis &amp; Delinquency Buckets" compact>
      <Panel className="bg-[#111] border-[#222] space-y-4" padded>
        <div className="flex justify-between items-center border-b border-[#222] pb-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#faff69]" /> Aging Distribution
          </h3>
          <span className="text-[10px] text-white/40 font-mono">Real-time Audit</span>
        </div>

        {hasData ? (
          <div className="space-y-4">
            <div className="h-3 w-full rounded bg-[#1a1a1a] flex overflow-hidden p-0.5 border border-[#222]">
              <div style={{ width: "100%" }} className="bg-green-400 h-full rounded" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#222]">
                <span className="text-white/60">Current (0-30 Days)</span>
                <span className="text-base font-bold text-white font-mono block">₹0</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-white/40">
            No receivables imported.
          </div>
        )}
      </Panel>
    </Section>
  );
}
