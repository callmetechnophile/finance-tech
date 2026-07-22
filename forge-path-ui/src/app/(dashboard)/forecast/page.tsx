"use client";

import React, { useState } from "react";
import { TrendingUp, Sliders, Download, RefreshCw, Sparkles, Layers } from "lucide-react";
import { PageContainer } from "@/shared/components/layout/PageContainer";
import { WorkspaceHeader } from "@/shared/components/layout/WorkspaceHeader";
import { SplitView } from "@/shared/components/layout/SplitView";
import { CashSummaryRegion } from "@/features/forecast/components/CashSummaryRegion";
import { ForecastRegion, ForecastHorizon } from "@/features/forecast/components/ForecastRegion";
import { ScenarioAnalysisRegion } from "@/features/forecast/components/ScenarioAnalysisRegion";
import { CashDriversRegion } from "@/features/forecast/components/CashDriversRegion";
import { AIPanelPlaceholder } from "@/features/forecast/components/AIPanelPlaceholder";
import { TimelinePlaceholder } from "@/features/forecast/components/TimelinePlaceholder";

export default function ForecastPage() {
  const [horizon, setHorizon] = useState<ForecastHorizon>("30d");

  const HeaderActions = (
    <div className="flex items-center gap-2">
      <button
        onClick={() => alert(`Exporting Cash Intelligence Forecast Report (${horizon} horizon) to PDF...`)}
        className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] text-xs font-semibold text-white transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 text-white/50" />
        <span>Export Report</span>
      </button>

      <button
        onClick={() => alert("Re-calculating cash flow projections across all horizons.")}
        className="px-3 py-1.5 rounded-lg bg-[#faff69] hover:bg-[#e6eb52] text-black text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        <RefreshCw className="w-3.5 h-3.5 fill-black" />
        <span>Sync Forecast</span>
      </button>
    </div>
  );

  const HeaderBadge = (
    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-wider">
      Predictive Engine Active
    </span>
  );

  const MainColumn = (
    <div className="h-full overflow-y-auto pr-2 space-y-6">
      {/* 1. Forecast Region */}
      <ForecastRegion currentHorizon={horizon} onHorizonChange={setHorizon} />

      {/* 2. Scenario Analysis Region */}
      <ScenarioAnalysisRegion />

      {/* 3. Cash Drivers Region */}
      <CashDriversRegion />
    </div>
  );

  const SidebarColumn = (
    <div className="h-full overflow-y-auto pl-2 space-y-6">
      {/* 4. AI Panel Placeholder */}
      <AIPanelPlaceholder />

      {/* 5. Timeline Placeholder */}
      <TimelinePlaceholder />
    </div>
  );

  return (
    <div className="h-full flex flex-col min-h-0 bg-[#0a0a0a]" aria-label="Cash Intelligence Workspace">
      {/* Sticky Workspace Header */}
      <WorkspaceHeader
        title="Cash Intelligence Workspace"
        subtitle="Predictive cash flow modeling, stress scenario simulations, and liquidity risk drivers."
        icon={<TrendingUp className="w-5 h-5 text-[#faff69]" aria-hidden="true" />}
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
        aria-label="Cash Intelligence content"
      >
        {/* Top Summary Region */}
        <CashSummaryRegion />

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
