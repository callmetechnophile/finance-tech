"use client";

import React from "react";
import { Landmark, DollarSign, Download, Send, ShieldCheck, Clock } from "lucide-react";
import { PageContainer } from "@/shared/components/layout/PageContainer";
import { WorkspaceHeader } from "@/shared/components/layout/WorkspaceHeader";
import { SplitView } from "@/shared/components/layout/SplitView";
import { useDocumentStatusStore } from "@/shared/stores/document-status.store";
import { TreasuryOverviewRegion } from "@/features/treasury/components/TreasuryOverviewRegion";
import { PaymentQueueRegion } from "@/features/treasury/components/PaymentQueueRegion";
import { BankAccountsRegion } from "@/features/treasury/components/BankAccountsRegion";
import { ApprovalCenterRegion } from "@/features/treasury/components/ApprovalCenterRegion";
import { AIPanelPlaceholder } from "@/features/treasury/components/AIPanelPlaceholder";
import { TreasuryTimelineRegion } from "@/features/treasury/components/TreasuryTimelineRegion";

export default function TreasuryPage() {
  const HeaderActions = (
    <div className="flex items-center gap-2">
      <button
        onClick={() => alert("Batch executing approved vendor payouts (₹63,400 total).")}
        className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] text-xs font-semibold text-white transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        <Send className="w-3.5 h-3.5 text-[#faff69]" />
        <span>Batch Payout</span>
      </button>

      <button
        onClick={() => alert("Exporting Treasury & Banking Reconciliation Audit Report (PDF)...")}
        className="px-3 py-1.5 rounded-lg bg-[#faff69] hover:bg-[#e6eb52] text-black text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 fill-black" />
        <span>Export Treasury Report</span>
      </button>
    </div>
  );

  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;

  const HeaderBadge = (
    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#faff69]/10 text-[#faff69] border border-[#faff69]/20 uppercase tracking-wider flex items-center gap-1">
      <Landmark className="w-3 h-3" /> {hasData ? "3 Accounts Connected" : "0 Bank Accounts Connected"}
    </span>
  );

  const MainColumn = (
    <div className="h-full overflow-y-auto pr-2 space-y-6">
      {/* 1. Payment Queue Region */}
      <PaymentQueueRegion />

      {/* 2. Bank Accounts Region */}
      <BankAccountsRegion />

      {/* 3. Approval Center Region */}
      <ApprovalCenterRegion />
    </div>
  );

  const SidebarColumn = (
    <div className="h-full overflow-y-auto pl-2 space-y-6">
      {/* 4. AI Panel Placeholder */}
      <AIPanelPlaceholder />

      {/* 5. Treasury Timeline Region */}
      <TreasuryTimelineRegion />
    </div>
  );

  return (
    <div className="h-full flex flex-col min-h-0 bg-[#0a0a0a]" aria-label="Treasury Operations Center">
      {/* Sticky Workspace Header */}
      <WorkspaceHeader
        title="Treasury Operations Center"
        subtitle="Liquidity management, vendor payout scheduling, multi-bank account sweep controls, and wire release approvals."
        icon={<Landmark className="w-5 h-5 text-[#faff69]" aria-hidden="true" />}
        badge={HeaderBadge}
        actions={HeaderActions}
        bordered={true}
        className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#2a2a2a]"
      />

      {/* Workspace Body */}
      <PageContainer
        scrollable={false}
        padded={true}
        className="flex-1 min-h-0 gap-6 pb-6 overflow-hidden"
        aria-label="Treasury Operations Center content"
      >
        {/* Top Treasury Overview Telemetry */}
        <TreasuryOverviewRegion />

        {/* Resizable Split Layout: Main Analytics vs AI/Timeline Sidebar */}
        <div className="flex-1 min-h-0 w-full overflow-hidden">
          <SplitView
            left={MainColumn}
            right={SidebarColumn}
            defaultLeftWidth={68}
            minLeft={45}
            maxLeft={85}
            resizable={true}
            className="w-full h-full"
          />
        </div>
      </PageContainer>
    </div>
  );
}
