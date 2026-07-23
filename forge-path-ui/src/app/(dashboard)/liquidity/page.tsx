"use client";

import React from "react";
import { ShieldCheck, Play, Download, RefreshCw, Activity, Layers } from "lucide-react";
import { PageContainer } from "@/shared/components/layout/PageContainer";
import { WorkspaceHeader } from "@/shared/components/layout/WorkspaceHeader";
import { SplitView } from "@/shared/components/layout/SplitView";
import { useDocumentStatusStore } from "@/shared/stores/document-status.store";
import { LiquiditySummaryRegion } from "@/features/liquidity/components/LiquiditySummaryRegion";
import { LiquidityForecastRegion } from "@/features/liquidity/components/LiquidityForecastRegion";
import { CashFlowTimelineRegion } from "@/features/liquidity/components/CashFlowTimelineRegion";
import { RiskAnalysisRegion } from "@/features/liquidity/components/RiskAnalysisRegion";
import { AIPanelPlaceholder } from "@/features/liquidity/components/AIPanelPlaceholder";
import { AlertsPanelRegion } from "@/features/liquidity/components/AlertsPanelRegion";

export default function LiquidityPage() {
  const HeaderActions = (
    <div className="flex items-center gap-2">
      <button
        onClick={() => alert("Executing solvency stress test across raw material price surge & AR payment delays.")}
        className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] text-xs font-semibold text-white transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        <Play className="w-3.5 h-3.5 text-white/50 fill-white/50" />
        <span>Run Stress Test</span>
      </button>

      <button
        onClick={() => alert("Exporting Liquidity Audit & Solvency Report (PDF)...")}
        className="px-3 py-1.5 rounded-lg bg-[#faff69] hover:bg-[#e6eb52] text-black text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 fill-black" />
        <span>Export Liquidity Report</span>
      </button>
    </div>
  );

  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;

  const HeaderBadge = (
    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#faff69]/10 text-[#faff69] border border-[#faff69]/20 uppercase tracking-wider flex items-center gap-1">
      <Activity className="w-3 h-3" /> {hasData ? "Liquidity Score: 84/100" : "Liquidity Score: ---"}
    </span>
  );

  const MainColumn = (
    <div className="h-full overflow-y-auto pr-2 space-y-6">
      {/* 1. Liquidity Forecast Region */}
      <LiquidityForecastRegion />

      {/* 2. Cash Flow Timeline Region */}
      <CashFlowTimelineRegion />

      {/* 3. Risk Analysis Region */}
      <RiskAnalysisRegion />
    </div>
  );

  const SidebarColumn = (
    <div className="h-full overflow-y-auto pl-2 space-y-6">
      {/* 4. AI Panel Placeholder */}
      <AIPanelPlaceholder />

      {/* 5. Alerts Panel */}
      <AlertsPanelRegion />
    </div>
  );

  return (
    <div className="h-full flex flex-col min-h-0 bg-[#0a0a0a]" aria-label="Liquidity Command Center">
      {/* Sticky Workspace Header */}
      <WorkspaceHeader
        title="Liquidity Command Center"
        subtitle="Daily solvency buffer monitoring, stress test risk indicators, and automated liquidity gap alerts."
        icon={<ShieldCheck className="w-5 h-5 text-[#faff69]" aria-hidden="true" />}
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
        aria-label="Liquidity Command Center content"
      >
        {/* Top Liquidity Summary Telemetry */}
        <LiquiditySummaryRegion />

        {/* Resizable Split Layout: Main Analytics vs AI/Alerts Sidebar */}
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
