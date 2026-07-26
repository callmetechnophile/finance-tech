"use client";

import React from "react";
import { Activity, ShieldCheck, IndianRupee, ArrowUpRight, Percent } from "lucide-react";
import { Section } from "@/shared/components/layout/Section";
import { MetricCard } from "@/shared/components/cards/MetricCard";
import { useFinancialTelemetryStore } from "@/shared/stores/financial-telemetry.store";
import { formatCurrency } from "@/shared/utils/currency";

export function LiquiditySummaryRegion() {
  const { metrics } = useFinancialTelemetryStore();
  const { hasData, liquidityScore, quickRatio, currentRatio, workingCapital, liquidCash, runwayDays } = metrics;

  return (
    <Section title="Liquidity Position &amp; Solvency Telemetry" compact>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3" aria-label="Liquidity summary metric indicators">
        <MetricCard
          label="Liquidity Rating"
          value={hasData ? `${liquidityScore}/100` : "---"}
          trend={{ value: hasData ? "Optimal Runway" : "No liquidity metrics calculated.", direction: "flat" }}
          severity="normal"
          icon={<Activity className="w-4 h-4 text-green-400" aria-hidden="true" />}
        />
        <MetricCard
          label="Quick Ratio (Acid-Test)"
          value={hasData ? `${quickRatio}x` : "---"}
          trend={{ value: hasData ? "Target > 1.5x" : "---", direction: "flat" }}
          severity="normal"
          icon={<ShieldCheck className="w-4 h-4 text-[#faff69]" aria-hidden="true" />}
        />
        <MetricCard
          label="Current Ratio"
          value={hasData ? `${currentRatio}x` : "---"}
          trend={{ value: hasData ? "Healthy" : "---", direction: "flat" }}
          severity="normal"
          icon={<Percent className="w-4 h-4 text-blue-400" aria-hidden="true" />}
        />
        <MetricCard
          label="Net Working Capital"
          value={hasData ? formatCurrency(workingCapital) : "---"}
          trend={{ value: hasData ? "+5.8%" : "---", direction: "flat" }}
          severity="normal"
          icon={<IndianRupee className="w-4 h-4 text-white/40" aria-hidden="true" />}
        />
        <MetricCard
          label="Operating Cash Reserve"
          value={hasData ? formatCurrency(liquidCash) : "---"}
          trend={{ value: hasData ? `${runwayDays} Days` : "No financial data available", direction: "flat" }}
          severity="normal"
          icon={<ArrowUpRight className="w-4 h-4 text-green-400" aria-hidden="true" />}
        />
      </div>
    </Section>
  );
}
