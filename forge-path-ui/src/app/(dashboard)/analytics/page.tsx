"use client";

import React from "react";
import { Activity, Layers, Database } from "lucide-react";
import { PageContainer } from "@/shared/components/layout/PageContainer";
import { WorkspaceHeader } from "@/shared/components/layout/WorkspaceHeader";
import { Section } from "@/shared/components/layout/Section";
import { Panel } from "@/shared/components/layout/Panel";
import { useDocumentStatusStore } from "@/shared/stores/document-status.store";

export default function AnalyticsPage() {
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;

  const HeaderActions = (
    <div className="flex items-center gap-2">
      <button
        onClick={() => alert("Re-querying analytics engine...")}
        className="px-3 py-1.5 rounded-lg bg-[#faff69] hover:bg-[#e6eb52] text-black text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        <Activity className="w-3.5 h-3.5" />
        <span>Refresh BI Engine</span>
      </button>
    </div>
  );

  const HeaderBadge = (
    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-white/10 text-white/60 border border-white/20 uppercase tracking-wider">
      {hasData ? "Telemetry Active" : "Engine Standby"}
    </span>
  );

  return (
    <div className="h-full flex flex-col min-h-0 bg-[#0a0a0a]" aria-label="Business Analytics Workspace">
      <WorkspaceHeader
        title="Business Analytics &amp; BI Grids"
        subtitle="Real-time pipeline benchmarks, DSO collections efficiency, transaction query performance, and AI confidence telemetry."
        icon={<Activity className="w-5 h-5 text-[#faff69]" aria-hidden="true" />}
        badge={HeaderBadge}
        actions={HeaderActions}
        bordered={true}
        className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#2a2a2a]"
      />

      <PageContainer scrollable={true} padded={true} className="flex-1 space-y-6 pb-16">
        <Section title="BI Operational Benchmarks" compact>
          {hasData ? (
            <div className="py-4 text-xs text-white/60 text-center">
              BI telemetry active.
            </div>
          ) : (
            <Panel className="bg-[#111] border-[#222] py-8 text-center" padded>
              <p className="text-xs text-white/40">Analytics unavailable.</p>
            </Panel>
          )}
        </Section>
      </PageContainer>
    </div>
  );
}
