"use client";

import React from "react";
import { DollarSign, Landmark, ShieldCheck, Clock, Percent } from "lucide-react";
import { Section } from "@/shared/components/layout/Section";
import { MetricCard } from "@/shared/components/cards/MetricCard";

export function TreasuryOverviewRegion() {
  return (
    <Section title="Treasury Liquidity &amp; Payout Overview" compact>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3" aria-label="Treasury summary metric indicators">
        <MetricCard
          label="Total Liquid Cash"
          value="$342,000"
          trend={{ value: "+4.2%", direction: "up", label: "vs 7d" }}
          severity="positive"
          icon={<DollarSign className="w-4 h-4 text-[#faff69]" aria-hidden="true" />}
        />
        <MetricCard
          label="Outstanding AP Balance"
          value="$118,400"
          trend={{ value: "8 Vendor Bills", direction: "flat" }}
          severity="normal"
          icon={<Landmark className="w-4 h-4 text-white/40" aria-hidden="true" />}
        />
        <MetricCard
          label="Pending Wire Approvals"
          value="$45,000"
          trend={{ value: "CFO Signoff Needed", direction: "up" }}
          severity="warning"
          icon={<Clock className="w-4 h-4 text-amber-400" aria-hidden="true" />}
        />
        <MetricCard
          label="Yield Sweep Reserve"
          value="$42,000"
          trend={{ value: "4.8% APY", direction: "up" }}
          severity="positive"
          icon={<ShieldCheck className="w-4 h-4 text-green-400" aria-hidden="true" />}
        />
        <MetricCard
          label="Connected Banks"
          value="3 Accounts"
          trend={{ value: "100% Synced", direction: "up" }}
          severity="positive"
          icon={<Landmark className="w-4 h-4 text-blue-400" aria-hidden="true" />}
        />
      </div>
    </Section>
  );
}
