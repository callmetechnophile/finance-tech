"use client";

import React from "react";
import { Bot } from "lucide-react";
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
          Forecast Predictor
        </span>
      </div>

      <div className="p-4 rounded-xl bg-[#1a1a1a] border border-[#222] text-xs text-white/60 text-center">
        {hasData ? "Active forecast model context loaded." : "Waiting for financial context."}
      </div>
    </Panel>
  );
}
