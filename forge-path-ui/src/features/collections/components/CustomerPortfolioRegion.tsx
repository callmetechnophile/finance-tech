"use client";

import React from "react";
import { CreditCard, Users, AlertTriangle, Clock, ShieldCheck } from "lucide-react";
import { Section } from "@/shared/components/layout/Section";
import { MetricCard } from "@/shared/components/cards/MetricCard";
import { useDocumentStatusStore } from "@/shared/stores/document-status.store";

export function CustomerPortfolioRegion() {
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;

  return (
    <Section title="Customer Portfolio &amp; Accounts Receivable Overview" compact>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3" aria-label="Customer portfolio metric indicators">
        <MetricCard
          label="Outstanding AR Balance"
          value={hasData ? "₹2,84,500" : "---"}
          trend={{ value: hasData ? "+12%" : "No receivables imported.", direction: "flat" }}
          severity="normal"
          icon={<CreditCard className="w-4 h-4 text-[#faff69]" aria-hidden="true" />}
        />
        <MetricCard
          label="Active Accounts"
          value={hasData ? "12 Clients" : "0 Clients"}
          trend={{ value: hasData ? "Stable" : "---", direction: "flat" }}
          severity="normal"
          icon={<Users className="w-4 h-4 text-white/40" aria-hidden="true" />}
        />
        <MetricCard
          label="High Risk Overdue"
          value={hasData ? "₹47,500" : "---"}
          trend={{ value: hasData ? "L4 Escalated" : "---", direction: "flat" }}
          severity={hasData ? "critical" : "normal"}
          icon={<AlertTriangle className="w-4 h-4 text-red-400" aria-hidden="true" />}
        />
        <MetricCard
          label="Average DSO"
          value={hasData ? "38 Days" : "---"}
          trend={{ value: hasData ? "-4 days" : "---", direction: "flat" }}
          severity={hasData ? "positive" : "normal"}
          icon={<Clock className="w-4 h-4 text-green-400" aria-hidden="true" />}
        />
        <MetricCard
          label="Recovered This Month"
          value={hasData ? "₹1,12,000" : "---"}
          trend={{ value: hasData ? "94% target" : "---", direction: "flat" }}
          severity={hasData ? "positive" : "normal"}
          icon={<ShieldCheck className="w-4 h-4 text-blue-400" aria-hidden="true" />}
        />
      </div>
    </Section>
  );
}
