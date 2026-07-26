"use client";

import React from "react";
import { Bot, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { useDocumentStatusStore } from "@/shared/stores/document-status.store";

export function AIPanelPlaceholder() {
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;

  return (
    <Panel className="bg-[#111] border-[#222] space-y-4" padded>
      <div className="flex justify-between items-center border-b border-[#222] pb-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Bot className="w-4 h-4 text-[#faff69]" /> Gemma Analyst
        </h3>
        <span className="px-1.5 py-0.5 text-[8px] font-bold rounded bg-[#faff69]/10 text-[#faff69] border border-[#faff69]/20 uppercase tracking-widest">
          Liquidity Predictor
        </span>
      </div>

      {hasData ? (
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-white/80 space-y-2">
            <div className="flex items-center gap-1.5 text-[#faff69] font-bold text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              Live Telemetry Analysis
            </div>
            <p className="text-[11px] text-white/70 leading-relaxed">
              Solvency buffer is optimal. Current liquid reserves support <strong>68 days</strong> of operational runway with zero liquidity shortfalls projected across all 16 processing stages.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/10 text-[10px] text-green-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Quick ratio of 1.8x exceeds minimum 1.5x solvency safety threshold.</span>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-[#1a1a1a] border border-[#222] text-xs text-white/60 text-center">
          Waiting for financial context. Upload documents to activate AI predictions.
        </div>
      )}
    </Panel>
  );
}
