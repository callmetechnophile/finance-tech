"use client";

import React from "react";
import { Database } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { useDocumentStatusStore } from "@/shared/stores/document-status.store";

export function ContextPanelRegion() {
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;

  return (
    <Panel className="bg-[#111] border-[#222] space-y-3" padded>
      <div className="flex justify-between items-center border-b border-[#222] pb-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-[#faff69]" /> Live Copilot Context
        </h3>
        <span className="px-1.5 py-0.5 text-[8px] font-bold rounded bg-white/10 text-white/60 uppercase">
          {hasData ? "Active Context" : "0 Records"}
        </span>
      </div>

      {hasData ? (
        <div className="py-4 text-xs text-white/60 text-center">
          Active ledger context connected.
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-white/40">
          No context available.
        </div>
      )}
    </Panel>
  );
}
