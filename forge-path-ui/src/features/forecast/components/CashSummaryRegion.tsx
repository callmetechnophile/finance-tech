"use client";

import React from "react";
import { IndianRupee, Clock, TrendingUp, ShieldCheck, Activity } from "lucide-react";
import { Section } from "@/shared/components/layout/Section";
import { MetricCard } from "@/shared/components/cards/MetricCard";
import { useFinancialTelemetryStore } from "@/shared/stores/financial-telemetry.store";
import { formatCurrency } from "@/shared/utils/currency";

export function CashSummaryRegion() {
  const { metrics } = useFinancialTelemetryStore();
  const { hasData, liquidCash, dailyBurn, runwayDays, netInflow30d, capitalBuffer } = metrics;

  return (
    <Section title="Cash Telemetry &amp; Solvency Summary" compact>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3" aria-label="Cash summary metric indicators">
        <MetricCard
          label="Available Liquid Cash"
          value={hasData ? formatCurrency(liquidCash) : "---"}
          trend={{ value: hasData ? "+4.2%" : "No financial data available", direction: "flat" }}
          severity="normal"
          icon={<IndianRupee className="w-4 h-4 text-[#faff69]" aria-hidden="true" />}
        />
        <MetricCard
          label="Daily Burn Rate"
          value={hasData ? `${formatCurrency(dailyBurn)}/d` : "---"}
          trend={{ value: hasData ? "Stable" : "---", direction: "flat" }}
          severity="normal"
          icon={<Activity className="w-4 h-4 text-white/40" aria-hidden="true" />}
        />
        <MetricCard
          label="Estimated Runway"
          value={hasData ? `${runwayDays} Days` : "---"}
          trend={{ value: hasData ? "Optimal" : "Forecast unavailable", direction: "flat" }}
          severity="normal"
          icon={<Clock className="w-4 h-4 text-green-400" aria-hidden="true" />}
        />
        <MetricCard
          label="30d Net Inflow"
          value={hasData ? formatCurrency(netInflow30d) : "---"}
          trend={{ value: hasData ? "+8.4%" : "---", direction: "flat" }}
          severity="normal"
          icon={<TrendingUp className="w-4 h-4 text-green-400" aria-hidden="true" />}
        />
        <MetricCard
          label="Capital Buffer Reserve"
          value={hasData ? formatCurrency(capitalBuffer) : "---"}
          trend={{ value: hasData ? "Target met" : "---", direction: "flat" }}
          severity="normal"
          icon={<ShieldCheck className="w-4 h-4 text-blue-400" aria-hidden="true" />}
        />
      </div>
    </Section>
  );
}
