"use client";

import React from "react";
import { Layers } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { Section } from "@/shared/components/layout/Section";
import { useDocumentStatusStore } from "@/shared/stores/document-status.store";

export function CashFlowTimelineRegion() {
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;

  return (
    <Section title="Cash Flow Timeline &amp; Net Liquidity" compact>
      <Panel className="bg-[#111] border-[#222] space-y-3" padded>
        <div className="flex justify-between items-center border-b border-[#222] pb-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#faff69]" /> Weekly Net Cash Flow Telemetry
          </h3>
          <span className="text-[10px] text-white/40 font-mono">{hasData ? "Actuals Telemetry" : "0 Transactions"}</span>
        </div>

        {hasData ? (
          <div className="py-4 text-xs text-white/60 text-center">
            Cash flow transactions loaded.
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-white/40">
            No transactions available.
          </div>
        )}
      </Panel>
    </Section>
  );
}
