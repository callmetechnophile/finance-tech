"use client";

import React from "react";
import { Paperclip } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { useDocumentStatusStore } from "@/shared/stores/document-status.store";

export function AttachmentsPanelRegion() {
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;

  return (
    <Panel className="bg-[#111] border-[#222] space-y-3" padded>
      <div className="flex justify-between items-center border-b border-[#222] pb-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Paperclip className="w-3.5 h-3.5 text-white/50" /> Loaded Documents
        </h3>
        <span className="text-[9px] text-white/30 font-mono">{hasData ? "Active Files" : "0 Documents"}</span>
      </div>

      {hasData ? (
        <div className="py-4 text-xs text-white/60 text-center">
          Active documents loaded.
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-white/40">
          No financial documents have been processed yet.
        </div>
      )}
    </Panel>
  );
}
