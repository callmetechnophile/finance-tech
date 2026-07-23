"use client";

import React, { useState } from "react";
import { Sliders, AlertTriangle, ShieldCheck, RefreshCw, Play } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { Section } from "@/shared/components/layout/Section";

export function ScenarioAnalysisRegion() {
  const [selectedScenario, setSelectedScenario] = useState("baseline");
  const [arDelayDays, setArDelayDays] = useState(14);
  const [costEscalation, setCostEscalation] = useState(10);

  const scenarios = [
    {
      id: "baseline",
      name: "Baseline Execution",
      runway: "68 Days",
      minCash: "₹3,42,000",
      risk: "Low",
      color: "text-green-400",
      desc: "Standard operating cash flow with current collection velocities.",
    },
    {
      id: "ar_stress",
      name: "AR Delay (-25% Collection)",
      runway: "52 Days",
      minCash: "₹2,85,000",
      risk: "Medium",
      color: "text-[#faff69]",
      desc: "Simulates major client payment delays (Apex Steel 45d lapse).",
    },
    {
      id: "supply_shock",
      name: "Supply Chain Shock (+15% AP)",
      runway: "44 Days",
      minCash: "₹2,12,000",
      risk: "High",
      color: "text-amber-400",
      desc: "Raw material cost surge and unexpected vendor payment demands.",
    },
  ];

  return (
    <Section title="Scenario Analysis &amp; Stress Testing" compact>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Preset Scenarios List */}
        <Panel className="bg-[#111] border-[#222] md:col-span-2 space-y-3" padded>
          <div className="flex justify-between items-center border-b border-[#222] pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#faff69]" /> Stress Test Preset Scenarios
            </h3>
            <span className="text-[10px] text-white/40">Select to evaluate runway exposure</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {scenarios.map((sc) => (
              <button
                key={sc.id}
                onClick={() => setSelectedScenario(sc.id)}
                className={[
                  "p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-3",
                  selectedScenario === sc.id
                    ? "bg-[#1a1a1a] border-[#faff69] shadow-md"
                    : "bg-[#0d0d0d] border-[#222] hover:border-[#333]"
                ].join(" ")}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-white">{sc.name}</span>
                    <span className={`text-[9px] font-semibold uppercase ${sc.color}`}>{sc.risk}</span>
                  </div>
                  <p className="text-[10px] text-white/40 mt-1 leading-relaxed">{sc.desc}</p>
                </div>

                <div className="border-t border-[#222] pt-2 flex justify-between items-center text-[10px]">
                  <span className="text-white/40">Min Cash: <strong className="text-white">{sc.minCash}</strong></span>
                  <span className={`font-bold font-mono ${sc.color}`}>{sc.runway}</span>
                </div>
              </button>
            ))}
          </div>
        </Panel>

        {/* Custom Parameter Simulation Controls */}
        <Panel className="bg-[#111] border-[#222] space-y-3 justify-between" padded>
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-white/50" /> Parameter Sandbox
            </h3>

            {/* Parameter sliders */}
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-white/60">AR Payment Lag:</span>
                  <span className="text-[#faff69] font-mono font-bold">+{arDelayDays} Days</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={arDelayDays}
                  onChange={(e) => setArDelayDays(parseInt(e.target.value))}
                  className="w-full accent-[#faff69] h-1 bg-[#222] rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-white/60">Vendor Cost Inflation:</span>
                  <span className="text-amber-400 font-mono font-bold">+{costEscalation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={costEscalation}
                  onChange={(e) => setCostEscalation(parseInt(e.target.value))}
                  className="w-full accent-amber-400 h-1 bg-[#222] rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => alert(`Simulated custom stress run: AR delay +${arDelayDays}d, Vendor cost +${costEscalation}%. Projecting runway exposure.`)}
            className="w-full py-2 rounded bg-[#faff69] hover:bg-[#e6eb52] text-black text-xs font-bold uppercase transition-colors flex items-center justify-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-black" /> Run Custom Simulation
          </button>
        </Panel>
      </div>
    </Section>
  );
}
