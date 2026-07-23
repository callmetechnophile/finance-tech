"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Layers, ChevronRight, Sliders, Calendar } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { Section } from "@/shared/components/layout/Section";
import { useDocumentStatusStore } from "@/shared/stores/document-status.store";

export type ForecastHorizon = "7d" | "30d" | "90d" | "365d";

interface ForecastRegionProps {
  currentHorizon?: ForecastHorizon;
  onHorizonChange?: (horizon: ForecastHorizon) => void;
}

export function ForecastRegion({
  currentHorizon = "30d",
  onHorizonChange,
}: ForecastRegionProps) {
  const [horizon, setHorizon] = useState<ForecastHorizon>(currentHorizon);
  const [showProjected, setShowProjected] = useState(true);
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;

  const handleHorizon = (h: ForecastHorizon) => {
    setHorizon(h);
    onHorizonChange?.(h);
  };

  const horizonData: Record<ForecastHorizon, { label: string; periods: number[]; target: string }> = {
    "7d": {
      label: "7-Day Daily Granularity",
      periods: [342, 345, 340, 350, 358, 362, 368],
      target: "₹3,20,000",
    },
    "30d": {
      label: "30-Day Rolling Forecast",
      periods: [310, 320, 315, 338, 345, 342, 355, 360, 372, 368, 380, 385],
      target: "₹3,00,000",
    },
    "90d": {
      label: "90-Day Quarterly Horizon",
      periods: [290, 310, 342, 360, 375, 350, 365, 380, 395, 410, 405, 420],
      target: "₹2,80,000",
    },
    "365d": {
      label: "365-Day Annual Fiscal Horizon",
      periods: [250, 280, 310, 342, 370, 390, 410, 430, 450, 470, 490, 510],
      target: "₹2,50,000",
    },
  };

  const activeData = horizonData[horizon];

  return (
    <Section title="Cash Flow &amp; Predictive Forecast Engine" compact>
      <Panel className="bg-[#111] border-[#222] space-y-4 relative overflow-hidden" padded>
        {/* Header Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#222] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#faff69]" aria-hidden="true" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Predictive Cash Projection Model
              </h3>
            </div>
            <p className="text-[10px] text-white/40 mt-0.5">{hasData ? activeData.label : "---"}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Projection toggle */}
            <button
              onClick={() => setShowProjected(!showProjected)}
              disabled={!hasData}
              className={[
                "px-2.5 py-1 text-[10px] font-semibold rounded border transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed",
                showProjected && hasData
                  ? "bg-[#faff69]/10 text-[#faff69] border-[#faff69]/30"
                  : "bg-[#1a1a1a] text-white/50 border-[#2a2a2a] hover:text-white"
              ].join(" ")}
            >
              <Sliders className="w-3 h-3" />
              <span>Projected Line</span>
            </button>

            {/* Horizon Selector Tabs */}
            <div className="flex items-center gap-1 bg-[#1a1a1a] p-1 rounded border border-[#2a2a2a]" role="tablist" aria-label="Forecast Horizon Tabs">
              {(["7d", "30d", "90d", "365d"] as ForecastHorizon[]).map((h) => (
                <button
                  key={h}
                  role="tab"
                  aria-selected={horizon === h}
                  onClick={() => handleHorizon(h)}
                  disabled={!hasData}
                  className={[
                    "px-2.5 py-1 text-[10px] font-bold rounded transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed",
                    horizon === h && hasData
                      ? "bg-[#faff69] text-black shadow-sm"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  ].join(" ")}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timeseries Visualizer */}
        <div className="h-[220px] flex flex-col justify-end pt-4 relative">
          {hasData ? (
            /* Chart Bars */
            <div className="flex-1 flex items-end gap-2 border-b border-l border-[#222] pb-2 pl-2 relative">
              {/* Grid guides */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 py-2">
                <div className="border-b border-[#333] w-full" />
                <div className="border-b border-[#333] w-full" />
                <div className="border-b border-[#333] w-full" />
              </div>

              <div className="w-full h-full absolute inset-0 flex items-end justify-between px-3 pb-2 z-10">
                {activeData.periods.map((val, idx) => {
                  const heightPct = Math.min(100, Math.max(15, (val / 550) * 100));
                  const isFuture = idx >= Math.floor(activeData.periods.length * 0.65);

                  return (
                    <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPct}%` }}
                        transition={{ duration: 0.35, delay: idx * 0.03 }}
                        className={[
                          "w-full max-w-[24px] rounded-t transition-all",
                          isFuture
                            ? showProjected
                              ? "bg-gradient-to-t from-[#faff69]/10 to-[#faff69]/30 border border-dashed border-[#faff69]/40"
                              : "opacity-20 bg-white/10"
                            : "bg-gradient-to-t from-[#faff69]/30 to-[#faff69]"
                        ].join(" ")}
                        title={`Period ${idx + 1}: $${val},000`}
                      />
                      <span className="text-[8px] font-mono text-white/30">
                        P{String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center border border-dashed border-[#222] rounded-xl bg-[#111]/30">
              <span className="text-xs text-[#848e9c]">No historical data.</span>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex justify-between items-center text-[10px] text-white/40 pt-2 border-t border-[#222]">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#faff69]" />
            <span>Target Reserve Threshold: {hasData ? activeData.target : "---"}</span>
          </span>
          <span className="text-white/30">Confidence Score: {hasData ? "95.4% (Rolling Ledger Index)" : "---"}</span>
        </div>
      </Panel>
    </Section>
  );
}
