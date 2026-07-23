"use client";

import React from "react";
import { IndianRupee } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { Section } from "@/shared/components/layout/Section";
import { useDocumentStatusStore } from "@/shared/stores/document-status.store";

export function PaymentQueueRegion() {
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;

  return (
    <Section title="Vendor Payment Queue &amp; Discount Capture" compact>
      <Panel className="bg-[#111] border-[#222] space-y-3" padded>
        <div className="flex justify-between items-center border-b border-[#222] pb-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5 text-[#faff69]" /> Scheduled Supplier Payouts
          </h3>
          <span className="text-[10px] text-white/40 font-mono">{hasData ? "Active Queue" : "0 Payables Queued"}</span>
        </div>

        {hasData ? (
          <div className="py-4 text-xs text-white/60 text-center">
            Active vendor payout queue loaded.
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-white/40">
            No supplier invoices detected.
          </div>
        )}
      </Panel>
    </Section>
  );
}
