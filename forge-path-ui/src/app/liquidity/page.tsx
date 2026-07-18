"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { formatCurrency } from "@/lib/utils";
import { Activity, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";

interface StressScenario {
  id: string;
  name: string;
  description: string;
  impact_cash: number;
  impact_runway: number;
  status: "Passed" | "Failed" | "Warning";
}

export default function LiquidityPage() {
  const [scenarios, setScenarios] = useState<StressScenario[]>([
    { id: "s-1", name: "Apex Steel Delays Payment 30 Days", description: "Simulates delay of INV-2024-089 collections timeline.", impact_cash: -47500, impact_runway: -9, status: "Warning" },
    { id: "s-2", name: "15% Inflation Spike on Raw Sheets", description: "Materials procurement cost spikes on all supply vendors.", impact_cash: -18000, impact_runway: -4, status: "Passed" },
    { id: "s-3", name: "Major Order Cancellation (Delta Aerospace)", description: "Delta cancels CNC machining parts batch contract.", impact_cash: -64000, impact_runway: -12, status: "Failed" }
  ]);

  const runTest = (id: string, name: string) => {
    toast.success(`Stress test scenario "${name}" recalculated successfully.`);
  };

  return (
    <AppShell>
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <div>
          <h2 className="text-xl font-bold text-white">Liquidity Intelligence & Scenario Testing</h2>
          <p className="text-xs text-[#888888] mt-1">
            Simulate macroeconomic shocks, late customer payments, and supply chain inflation spikes to stress-test your cash runway.
          </p>
        </div>

        {/* stress test scenario grid */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-[#2a2a2a] flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Shock Scenario Simulator</h3>
          </div>

          <div className="divide-y divide-[#2a2a2a]">
            {scenarios.map((s) => (
              <div key={s.id} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white">{s.name}</h4>
                  <p className="text-[10px] text-[#888888]">{s.description}</p>
                  <div className="text-[10px] text-[#cccccc] flex gap-3 pt-1">
                    <span>Cash Impact: <strong className="text-red-400 font-tabular">{formatCurrency(s.impact_cash)}</strong></span>
                    <span>Runway Impact: <strong className="text-red-400">{s.impact_runway} days</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    s.status === "Passed" ? "bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/25" :
                    s.status === "Warning" ? "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/25" :
                    "bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/25"
                  }`}>
                    {s.status}
                  </span>
                  <button onClick={() => runTest(s.id, s.name)} className="btn-secondary text-[11px] h-8 py-0 px-3">
                    Run Scenario
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
