"use client";

import React from "react";
import { Landmark, Plus } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { Section } from "@/shared/components/layout/Section";
import { useDocumentStatusStore } from "@/shared/stores/document-status.store";

export function BankAccountsRegion() {
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;

  return (
    <Section title="Connected Banking Infrastructure &amp; Accounts" compact>
      <Panel className="bg-[#111] border-[#222] space-y-3" padded>
        <div className="flex justify-between items-center border-b border-[#222] pb-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5 text-[#faff69]" /> Bank Accounts Telemetry
          </h3>
          <span className="text-[10px] text-white/40 font-mono">{hasData ? "Active Integrations" : "0 Accounts Connected"}</span>
        </div>

        {hasData ? (
          <div className="py-4 text-xs text-white/60 text-center">
            Active banking connection established.
          </div>
        ) : (
          <div className="py-8 text-center space-y-3">
            <p className="text-xs text-white/40">No banking integrations configured.</p>
            <button
              onClick={() => alert("Bank Integration Dialog — Link Bank Account")}
              className="px-3 py-1.5 bg-[#faff69] hover:bg-[#e6eb5f] text-black text-xs font-bold rounded uppercase tracking-wider transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Connect Bank
            </button>
          </div>
        )}
      </Panel>
    </Section>
  );
}
