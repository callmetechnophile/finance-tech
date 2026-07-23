"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { Section } from "@/shared/components/layout/Section";
import { useDocumentStatusStore } from "@/shared/stores/document-status.store";

export function ApprovalCenterRegion() {
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;

  return (
    <Section title="Dual-Signature Wire Release Approval Queue" compact>
      <Panel className="bg-[#111] border-[#222] space-y-3" padded>
        <div className="flex justify-between items-center border-b border-[#222] pb-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#faff69]" /> High-Value Payout Approvals
          </h3>
          <span className="px-1.5 py-0.5 text-[8px] font-bold rounded bg-white/10 text-white/60 uppercase">
            {hasData ? "Active Queue" : "0 Pending Release"}
          </span>
        </div>

        {hasData ? (
          <div className="py-4 text-xs text-white/60 text-center">
            Active wire approval queue loaded.
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-white/40">
            No pending approvals.
          </div>
        )}
      </Panel>
    </Section>
  );
}
