"use client";

import React from "react";
import { Sliders } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { Section } from "@/shared/components/layout/Section";
import { useDocumentStatusStore } from "@/shared/stores/document-status.store";

export function ScenarioAnalysisRegion() {
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;

  return (
    <Section title="Scenario Analysis &amp; Stress Testing" compact>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Panel className="bg-[#111] border-[#222] md:col-span-2 space-y-3" padded>
          <div className="flex justify-between items-center border-b border-[#222] pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#faff69]" /> Stress Test Preset Scenarios
            </h3>
            <span className="text-[10px] text-white/40">{hasData ? "Active Model" : "0 Scenarios Active"}</span>
          </div>

          {hasData ? (
            <div className="py-4 text-xs text-white/60 text-center">
              Scenario analysis model active.
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-white/40">
              No solvency model generated yet.
            </div>
          )}
        </Panel>

        <Panel className="bg-[#111] border-[#222] space-y-3 justify-between" padded>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Parameter Sandbox
          </h3>
          <div className="text-xs text-white/40 text-center py-4">
            Upload financial records to enable sandbox.
          </div>
        </Panel>
      </div>
    </Section>
  );
}
