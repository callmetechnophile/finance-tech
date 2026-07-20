"use client";

import React from "react";
import { DollarSign, Clock, TrendingUp, ShieldCheck, Activity } from "lucide-react";
import { Section } from "@/shared/components/layout/Section";
import { MetricCard } from "@/shared/components/cards/MetricCard";

export function CashSummaryRegion() {
  return (
    <Section title="Cash Telemetry &amp; Solvency Summary" compact>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3" aria-label="Cash summary metric indicators">
        <MetricCard
          label="Available Liquid Cash"
          value="$342,000"
          trend={{ value: "+4.2%", direction: "up", label: "vs 7d" }}
          severity="normal"
          icon={<DollarSign className="w-4 h-4 text-[#faff69]" aria-hidden="true" />}
        />
        <MetricCard
          label="Daily Burn Rate"
          value="$5,000/d"
          trend={{ value: "Stable", direction: "flat" }}
          severity="normal"
          icon={<Activity className="w-4 h-4 text-white/40" aria-hidden="true" />}
        />
        <MetricCard
          label="Estimated Runway"
          value="68 Days"
          trend={{ value: "Optimal", direction: "up" }}
          severity="positive"
          icon={<Clock className="w-4 h-4 text-green-400" aria-hidden="true" />}
        />
        <MetricCard
          label="30d Net Inflow"
          value="$118,400"
          trend={{ value: "+8.4%", direction: "up", label: "forecast" }}
          severity="positive"
          icon={<TrendingUp className="w-4 h-4 text-green-400" aria-hidden="true" />}
        />
        <MetricCard
          label="Capital Buffer Reserve"
          value="$250,000"
          trend={{ value: "Target met", direction: "up" }}
          severity="positive"
          icon={<ShieldCheck className="w-4 h-4 text-blue-400" aria-hidden="true" />}
        />
      </div>
    </Section>
  );
}
