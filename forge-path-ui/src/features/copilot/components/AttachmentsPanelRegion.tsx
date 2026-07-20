"use client";

import React from "react";
import { FileText, Paperclip, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";

export function AttachmentsPanelRegion() {
  const attachments = [
    { name: "Apex_Steel_Invoice_89.pdf", size: "1.4 MB", type: "PDF", status: "Parsed (98% conf)" },
    { name: "CNC_Maintenance_Bill.xlsx", size: "320 KB", type: "XLSX", status: "Parsed (100% conf)" },
    { name: "Chase_Bank_Statement.csv", size: "840 KB", type: "CSV", status: "Synced (ACID DB)" },
  ];

  return (
    <Panel className="bg-[#111] border-[#222] space-y-3" padded>
      <div className="flex justify-between items-center border-b border-[#222] pb-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Paperclip className="w-3.5 h-3.5 text-white/50" /> Loaded Documents ({attachments.length})
        </h3>
        <span className="text-[9px] text-white/30 font-mono">Copilot Context</span>
      </div>

      <div className="space-y-2">
        {attachments.map((att) => (
          <div
            key={att.name}
            className="p-2 rounded-lg bg-[#1a1a1a] border border-[#222] text-xs flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-white/80 font-medium truncate block text-[11px]">{att.name}</span>
                <span className="text-[9px] text-white/30 block">{att.size} · {att.type}</span>
              </div>
            </div>
            <span className="text-[9px] text-green-400 font-mono shrink-0 flex items-center gap-0.5">
              <CheckCircle2 className="w-2.5 h-2.5" /> Parsed
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
