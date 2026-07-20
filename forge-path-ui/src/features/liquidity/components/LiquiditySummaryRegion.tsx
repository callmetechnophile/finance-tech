"use client";

import React from "react";
import { Activity, ShieldCheck, DollarSign, ArrowUpRight, Percent } from "lucide-react";
import { Section } from "@/shared/components/layout/Section";
import { MetricCard } from "@/shared/components/cards/MetricCard";

export function LiquiditySummaryRegion() {
  return (
    <Section title="Liquidity Position &amp; Solvency Telemetry" compact>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3" aria-label="Liquidity summary metric indicators">
        <MetricCard
          label="Liquidity Rating"
          value="84/100"
          trend={{ value: "Optimal Runway", direction: "up" }}
          severity="positive"
          icon={<Activity className="w-4 h-4 text-green-400" aria-hidden="true" />}
        />
        <MetricCard
          label="Quick Ratio (Acid-Test)"
          value="1.8x"
          trend={{ value: "Target > 1.5x", direction: "up" }}
          severity="positive"
          icon={<ShieldCheck className="w-4 h-4 text-[#faff69]" aria-hidden="true" />}
        />
        <MetricCard
          label="Current Ratio"
          value="2.4x"
          trend={{ value: "Healthy", direction: "up" }}
          severity="positive"
          icon={<Percent className="w-4 h-4 text-blue-400" aria-hidden="true" />}
        />
        <MetricCard
          label="Net Working Capital"
          value="$224,100"
          trend={{ value: "+5.8%", direction: "up", label: "vs 30d" }}
          severity="normal"
          icon={<DollarSign className="w-4 h-4 text-white/40" aria-hidden="true" />}
        />
        <MetricCard
          label="Operating Cash Reserve"
          value="$342,000"
          trend={{ value: "68 Days", direction: "up", label: "runway" }}
          severity="positive"
          icon={<ArrowUpRight className="w-4 h-4 text-green-400" aria-hidden="true" />}
        />
      </div>
    </Section>
  );
}
