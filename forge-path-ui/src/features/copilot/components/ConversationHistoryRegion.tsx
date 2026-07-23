"use client";

import React from "react";
import { MessageSquare } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { useDocumentStatusStore } from "@/shared/stores/document-status.store";

export function ConversationHistoryRegion() {
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;

  return (
    <Panel className="bg-[#111] border-[#222] space-y-3" padded>
      <div className="flex justify-between items-center border-b border-[#222] pb-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-[#faff69]" /> Threads History
        </h3>
        <span className="text-[10px] text-white/40 font-mono">{hasData ? "Active Thread" : "0 Threads"}</span>
      </div>

      {hasData ? (
        <div className="py-4 text-xs text-white/60 text-center">
          Active thread history loaded.
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-white/40">
          No AI conversations.
        </div>
      )}
    </Panel>
  );
}
