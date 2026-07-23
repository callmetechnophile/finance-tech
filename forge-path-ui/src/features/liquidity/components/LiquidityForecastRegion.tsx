"use client";

import React from "react";
import { Clock } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { Section } from "@/shared/components/layout/Section";
import { useDocumentStatusStore } from "@/shared/stores/document-status.store";

export function LiquidityForecastRegion() {
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;

  return (
    <Section title="Liquidity Forecast &amp; Buffer Projections" compact>
      <Panel className="bg-[#111] border-[#222] space-y-4" padded>
        <div className="flex justify-between items-center border-b border-[#222] pb-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#faff69]" aria-hidden="true" /> Solvency Horizon Forecast
          </h3>
          <span className="text-[10px] text-white/40 font-mono">{hasData ? "Active Horizon" : "Forecast unavailable"}</span>
        </div>

        {hasData ? (
          <div className="py-4 text-xs text-white/60 text-center">
            Liquidity horizon active.
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-white/40">
            No liquidity metrics calculated.
          </div>
        )}
      </Panel>
    </Section>
  );
}
