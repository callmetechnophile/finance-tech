"use client";

import React from "react";
import { Clock } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { useDocumentStatusStore } from "@/shared/stores/document-status.store";

export function TimelinePlaceholder() {
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;

  return (
    <Panel className="bg-[#111] border-[#222] space-y-3" padded>
      <div className="flex justify-between items-center border-b border-[#222] pb-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-white/50" /> Forecast Operations Timeline
        </h3>
        <span className="text-[10px] text-white/40 font-mono">Live Feed</span>
      </div>

      <div className="py-6 text-center text-xs text-white/40">
        No audit activity.
      </div>
    </Panel>
  );
}
