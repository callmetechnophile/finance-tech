"use client";

import React from "react";
import { Inbox, Send, Download, Layers, ShieldCheck, Users } from "lucide-react";
import { PageContainer } from "@/shared/components/layout/PageContainer";
import { WorkspaceHeader } from "@/shared/components/layout/WorkspaceHeader";
import { SplitView } from "@/shared/components/layout/SplitView";
import { CustomerPortfolioRegion } from "@/features/collections/components/CustomerPortfolioRegion";
import { AgingAnalysisRegion } from "@/features/collections/components/AgingAnalysisRegion";
import { CollectionPipelineRegion } from "@/features/collections/components/CollectionPipelineRegion";
import { CommunicationCenterRegion } from "@/features/collections/components/CommunicationCenterRegion";
import { AIPanelPlaceholder } from "@/features/collections/components/AIPanelPlaceholder";
import { ActivityTimelineRegion } from "@/features/collections/components/ActivityTimelineRegion";

export default function CollectionsPage() {
  const HeaderActions = (
    <div className="flex items-center gap-2">
      <button
        onClick={() => alert("Batch dispatching friendly L1 email reminders across 5 eligible accounts.")}
        className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] text-xs font-semibold text-white transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        <Send className="w-3.5 h-3.5 text-[#faff69]" />
        <span>Batch Reminders</span>
      </button>

      <button
        onClick={() => alert("Exporting AR Aging Audit & Delinquency Report (PDF)...")}
        className="px-3 py-1.5 rounded-lg bg-[#faff69] hover:bg-[#e6eb52] text-black text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 fill-black" />
        <span>Export Aging Report</span>
      </button>
    </div>
  );

  const HeaderBadge = (
    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#faff69]/10 text-[#faff69] border border-[#faff69]/20 uppercase tracking-wider flex items-center gap-1">
      <Inbox className="w-3 h-3" /> 12 Active Collections • $284,500 AR
    </span>
  );

  const MainColumn = (
    <div className="h-full overflow-y-auto pr-2 space-y-6">
      {/* 1. Aging Analysis Region */}
      <AgingAnalysisRegion />

      {/* 2. Collection Pipeline Region */}
      <CollectionPipelineRegion />

      {/* 3. Communication Center Region */}
      <CommunicationCenterRegion />
    </div>
  );

  const SidebarColumn = (
    <div className="h-full overflow-y-auto pl-2 space-y-6">
      {/* 4. AI Panel Placeholder */}
      <AIPanelPlaceholder />

      {/* 5. Activity Timeline Region */}
      <ActivityTimelineRegion />
    </div>
  );

  return (
    <div className="h-full flex flex-col min-h-0 bg-[#0a0a0a]" aria-label="Collections Operations Center">
      {/* Sticky Workspace Header */}
      <WorkspaceHeader
        title="Collections Operations Center"
        subtitle="Intelligent Accounts Receivable collection velocity, aging buckets, automated outreach, and escalation workflows."
        icon={<Inbox className="w-5 h-5 text-[#faff69]" aria-hidden="true" />}
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
        aria-label="Collections Operations Center content"
      >
        {/* Top Customer Portfolio Telemetry */}
        <CustomerPortfolioRegion />

        {/* Resizable Split Layout: Main Analytics vs AI/Activity Sidebar */}
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
