"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { useDocumentStatusStore } from "@/shared/stores/document-status.store";

export function AIInsightsPanelRegion() {
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;

  return (
    <Panel className="bg-[#111] border-[#222] space-y-3" padded>
      <div className="flex justify-between items-center border-b border-[#222] pb-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#faff69]" /> AI Intelligence Insights
        </h3>
        <span className="text-[10px] text-white/40 font-mono">{hasData ? "Active Model" : "0 Insights"}</span>
      </div>

      {hasData ? (
        <div className="py-4 text-xs text-white/60 text-center">
          Active AI insights available.
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-white/40">
          Waiting for financial context.
        </div>
      )}
    </Panel>
  );
}
