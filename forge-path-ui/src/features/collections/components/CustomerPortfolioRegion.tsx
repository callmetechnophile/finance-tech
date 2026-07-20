"use client";

import React from "react";
import { CreditCard, Users, AlertTriangle, Clock, ShieldCheck } from "lucide-react";
import { Section } from "@/shared/components/layout/Section";
import { MetricCard } from "@/shared/components/cards/MetricCard";

export function CustomerPortfolioRegion() {
  return (
    <Section title="Customer Portfolio &amp; Accounts Receivable Overview" compact>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3" aria-label="Customer portfolio metric indicators">
        <MetricCard
          label="Outstanding AR Balance"
          value="$284,500"
          trend={{ value: "+12%", direction: "up", label: "vs 30d" }}
          severity="normal"
          icon={<CreditCard className="w-4 h-4 text-[#faff69]" aria-hidden="true" />}
        />
        <MetricCard
          label="Active Accounts"
          value="12 Clients"
          trend={{ value: "Stable", direction: "flat" }}
          severity="normal"
          icon={<Users className="w-4 h-4 text-white/40" aria-hidden="true" />}
        />
        <MetricCard
          label="High Risk Overdue"
          value="$47,500"
          trend={{ value: "L4 Escalated", direction: "up" }}
          severity="critical"
          icon={<AlertTriangle className="w-4 h-4 text-red-400" aria-hidden="true" />}
        />
        <MetricCard
          label="Average DSO"
          value="38 Days"
          trend={{ value: "-4 days", direction: "down", label: "improved" }}
          severity="positive"
          icon={<Clock className="w-4 h-4 text-green-400" aria-hidden="true" />}
        />
        <MetricCard
          label="Recovered This Month"
          value="$112,000"
          trend={{ value: "94% target", direction: "up" }}
          severity="positive"
          icon={<ShieldCheck className="w-4 h-4 text-blue-400" aria-hidden="true" />}
        />
      </div>
    </Section>
  );
}
