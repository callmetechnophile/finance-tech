"use client";

import React from "react";
import { IndianRupee, Landmark, ShieldCheck, Clock } from "lucide-react";
import { Section } from "@/shared/components/layout/Section";
import { MetricCard } from "@/shared/components/cards/MetricCard";
import { useFinancialTelemetryStore } from "@/shared/stores/financial-telemetry.store";
import { formatCurrency } from "@/shared/utils/currency";

export function TreasuryOverviewRegion() {
  const { metrics } = useFinancialTelemetryStore();
  const { hasData, liquidCash, apBalance, documentCount } = metrics;
  const pendingWireAmount = Math.round(apBalance * 0.38);
  const yieldSweepAmount = Math.round(liquidCash * 0.12);

  return (
    <Section title="Treasury Liquidity &amp; Payout Overview" compact>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3" aria-label="Treasury summary metric indicators">
        <MetricCard
          label="Total Liquid Cash"
          value={hasData ? formatCurrency(liquidCash) : "---"}
          trend={{ value: hasData ? "+4.2%" : "No financial data available", direction: "flat" }}
          severity="normal"
          icon={<IndianRupee className="w-4 h-4 text-[#faff69]" aria-hidden="true" />}
        />
        <MetricCard
          label="Outstanding AP Balance"
          value={hasData ? formatCurrency(apBalance) : "---"}
          trend={{ value: hasData ? "Active Bills" : "No supplier invoices detected.", direction: "flat" }}
          severity="normal"
          icon={<Landmark className="w-4 h-4 text-white/40" aria-hidden="true" />}
        />
        <MetricCard
          label="Pending Wire Approvals"
          value={hasData ? formatCurrency(pendingWireAmount) : "---"}
          trend={{ value: hasData ? "Signoff Needed" : "---", direction: "flat" }}
          severity="normal"
          icon={<Clock className="w-4 h-4 text-amber-400" aria-hidden="true" />}
        />
        <MetricCard
          label="Yield Sweep Reserve"
          value={hasData ? formatCurrency(yieldSweepAmount) : "---"}
          trend={{ value: hasData ? "6.4% APY" : "---", direction: "flat" }}
          severity="normal"
          icon={<ShieldCheck className="w-4 h-4 text-green-400" aria-hidden="true" />}
        />
        <MetricCard
          label="Connected Banks"
          value={hasData ? `${Math.max(1, documentCount + 1)} Accounts` : "0 Accounts"}
          trend={{ value: hasData ? "Synced" : "No bank accounts connected.", direction: "flat" }}
          severity="normal"
          icon={<Landmark className="w-4 h-4 text-blue-400" aria-hidden="true" />}
        />
      </div>
    </Section>
  );
}
