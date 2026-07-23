"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Sparkles,
  AlertTriangle,
  DollarSign,
  Clock,
  Activity,
  Building,
  Calendar,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import { Panel } from "@/shared/components/layout/Panel";
import { Skeleton } from "@/shared/components/feedback/Skeleton";
import { EmptyState } from "@/shared/components/feedback/EmptyState";
import { ErrorState } from "@/shared/components/feedback/ErrorState";
import { MetricCard } from "@/shared/components/cards/MetricCard";
import { RecommendationCard } from "@/shared/components/ai/RecommendationCard";
import { useSessionStore } from "@/shared/stores/session.store";
import { useDocumentStatusStore } from "@/shared/stores/document-status.store";

interface MorningExecutiveBriefProps {
  state: "loaded" | "loading" | "empty" | "error";
  onRetry?: () => void;
}

// Stagger children animation variants — disabled when prefers-reduced-motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

export function MorningExecutiveBrief({ state, onRetry }: MorningExecutiveBriefProps) {
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState("Sunday, July 19, 2026");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Derive identity from live session — never cached or hardcoded
  const { user, isAuthenticated } = useSessionStore();
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;
  const firstName = isAuthenticated && user?.name ? user.name.split(" ")[0] : null;
  const organization = isAuthenticated && user?.organization ? user.organization : null;

  // Time-aware greeting
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const greeting = firstName ? `${timeGreeting}, ${firstName}` : "Welcome";

  useEffect(() => {
    setMounted(true);
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDate(new Date().toLocaleDateString("en-US", dateOptions));

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const handleAlertKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>, action: () => void) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        action();
      }
    },
    []
  );

  const motionProps = prefersReducedMotion
    ? {}
    : { variants: containerVariants, initial: "hidden", animate: "visible" };

  const motionItemProps = prefersReducedMotion ? {} : { variants: itemVariants };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (state === "loading") {
    return (
      <div className="space-y-6" role="status" aria-label="Loading executive brief" aria-live="polite">
        <div className="flex flex-col gap-2">
          <Skeleton height={20} width="250px" />
          <div className="flex gap-4">
            <Skeleton height={12} width="120px" />
            <Skeleton height={12} width="160px" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" aria-hidden="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <Panel key={i} className="min-h-[100px] justify-between">
              <Skeleton height={10} width="50%" />
              <Skeleton height={20} width="40%" />
            </Panel>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" aria-hidden="true">
          <div className="lg:col-span-8 space-y-4">
            <Panel className="min-h-[120px]">
              <Skeleton height={12} width="20%" className="mb-3" />
              <Skeleton height={10} width="95%" lines={3} />
            </Panel>
          </div>
          <div className="lg:col-span-4 space-y-4">
            <Panel className="min-h-[120px]">
              <Skeleton height={12} width="40%" className="mb-3" />
              <Skeleton height={24} width="100%" lines={2} />
            </Panel>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty ────────────────────────────────────────────────────────────────
  if (state === "empty") {
    return (
      <div className="py-8" role="status">
        <EmptyState
          icon={<Bot className="w-10 h-10 text-white/30" aria-hidden="true" />}
          title="No Morning Brief Available"
          description="Solvency telemetry could not find daily journal sync updates from yesterday."
          size="md"
        />
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (state === "error") {
    return (
      <div className="py-8" role="alert">
        <ErrorState
          title="Brief Telemetry Ingestion Failed"
          message="Failed to compute real-time solvency runways due to pipeline data ingestion lag."
          onRetry={onRetry}
          size="md"
        />
      </div>
    );
  }

  // ── Loaded ───────────────────────────────────────────────────────────────
  return (
    <motion.div
      className="space-y-6"
      {...motionProps}
      aria-label="Morning Executive Brief"
    >
      {/* 1. Greeting Header */}
      <motion.div
        {...motionItemProps}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-[#2a2a2a] pb-4"
      >
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
            {greeting}{" "}
            {firstName && <span role="img" aria-label="waving hand">👋</span>}
          </h2>
          <div className="flex items-center gap-3 text-xs text-white/40 mt-1 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#faff69]" aria-hidden="true" />
              <time dateTime={new Date().toISOString().split("T")[0]}>
                {mounted ? currentDate : ""}
              </time>
            </span>
            {organization && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" aria-hidden="true" />
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-[#faff69]" aria-hidden="true" />
                  {organization}
                </span>
              </>
            )}
          </div>
        </div>
        <span
          className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-[#faff69]/10 text-[#faff69] border border-[#faff69]/20 tracking-wider uppercase select-none"
          aria-label="Workspace status: Active"
        >
          Active Workspace
        </span>
      </motion.div>

      {/* 2. KPI Indicators */}
      <motion.div
        {...motionItemProps}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        aria-label="Key solvency indicators"
      >
        <MetricCard
          label="Total Available Cash Position"
          value={hasData ? "$342,000" : "---"}
          trend={hasData ? { value: "+4.2%", direction: "up", label: "vs 7d ago" } : { value: "---", direction: "flat" }}
          severity="normal"
          icon={<DollarSign className="w-4 h-4 text-[#faff69]" aria-hidden="true" />}
        />
        <MetricCard
          label="Estimated Cash Runway"
          value={hasData ? "68 Days" : "---"}
          trend={hasData ? { value: "Stable buffer", direction: "flat" } : { value: "---", direction: "flat" }}
          severity="normal"
          icon={<Clock className="w-4 h-4 text-white/40" aria-hidden="true" />}
        />
        <MetricCard
          label="Business Solvency Rating"
          value={hasData ? "Optimal (84/100)" : "---"}
          trend={hasData ? { value: "Low Exposure", direction: "up" } : { value: "---", direction: "flat" }}
          severity={hasData ? "positive" : "normal"}
          icon={<Activity className="w-4 h-4 text-green-400" aria-hidden="true" />}
        />
      </motion.div>

      {/* 3. Summary, Alerts & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Summary + Alerts */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Executive Summary Panel */}
          <motion.div {...motionItemProps}>
            <Panel
              className="bg-gradient-to-br from-[#111] via-[#161616] to-[#111] border-[#222] transition-shadow duration-200 hover:shadow-lg hover:shadow-black/30"
              padded={true}
              aria-label="AI executive summary"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#faff69]/10 text-[#faff69] mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                >
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-[#faff69] uppercase tracking-wider block">
                    Gemma AI Briefing Digest
                  </span>
                  <h3 className="text-xs font-semibold text-white/95 mt-0.5">
                    Corporate Cash Runway &amp; Solvency Report
                  </h3>
                  <p className="text-xs text-white/70 mt-2 leading-relaxed font-medium">
                    {hasData ? (
                      <>
                        Your business health is{" "}
                        <strong className="text-white/90">stable</strong> with $342,000
                        in liquid accounts. Receivables display a backlog of{" "}
                        <strong className="text-white/90">$284,500</strong>, where{" "}
                        <strong className="text-amber-400">Apex Steel Works</strong> invoices
                        have exceeded delinquent targets by 14 days. Outflow projections
                        identify a scheduled contract wire for machine maintenance ($45,000)
                        on July 24, which will compress short-term runways slightly, but cash
                        reserves will remain within baseline buffer targets.
                      </>
                    ) : (
                      "No financial documents have been processed yet."
                    )}
                  </p>
                </div>
              </div>
            </Panel>
          </motion.div>

          {/* Critical Alerts Panel */}
          <motion.div {...motionItemProps}>
            <Panel
              className="bg-[#141414] border border-[#222] transition-colors duration-200"
              padded={true}
              role="region"
              aria-label="Critical alerts requiring action"
            >
              <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-white/40" aria-hidden="true" />
                Action Required: {hasData ? "2 Critical Exceptions" : "0 Exceptions"}
              </h3>
              {hasData ? (
                <ul className="space-y-2 list-none" aria-label="Critical alert list">
                  <li>
                    <div
                      className="flex items-start gap-2.5 p-2 rounded bg-red-500/[0.02] border border-red-500/10 hover:border-red-500/30 hover:bg-red-500/[0.04] transition-all duration-150 cursor-default focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400"
                      tabIndex={0}
                      role="listitem"
                      aria-label="Delinquency warning: Apex Steel Works invoice overdue"
                      onKeyDown={(e) =>
                        handleAlertKeyDown(e, () =>
                          alert("View INV-2024-089 in Collections workspace.")
                        )
                      }
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"
                        aria-hidden="true"
                      />
                      <p className="min-w-0 text-xs text-white/70">
                        <span className="text-white/80 font-medium">Delinquency warning:</span>{" "}
                        Apex Steel Works ($47,500 · INV-2024-089) is 45 days overdue. Level 4
                        escalation triggers are active.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div
                      className="flex items-start gap-2.5 p-2 rounded bg-amber-500/[0.02] border border-amber-500/10 hover:border-amber-500/30 hover:bg-amber-500/[0.04] transition-all duration-150 cursor-default focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
                      tabIndex={0}
                      role="listitem"
                      aria-label="Upcoming wire outflow: $45,000 due in 5 days"
                      onKeyDown={(e) =>
                        handleAlertKeyDown(e, () =>
                          alert("View scheduled payout in Treasury workspace.")
                        )
                      }
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"
                        aria-hidden="true"
                      />
                      <p className="min-w-0 text-xs text-white/70">
                        <span className="text-white/80 font-medium">Upcoming wire outflow:</span>{" "}
                        $45,000 scheduled mechanical service agreement payment due in 5 days.
                      </p>
                    </div>
                  </li>
                </ul>
              ) : (
                <div className="text-xs text-white/40 py-2">No active warnings or critical alerts.</div>
              )}
            </Panel>
          </motion.div>
        </div>

        {/* Right: AI Recommendations */}
        <motion.div
          {...motionItemProps}
          className="lg:col-span-4 flex flex-col gap-4"
          aria-label="AI guidance recommendations"
        >
          <div className="flex flex-col gap-2">
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-white/40" aria-hidden="true" />
              AI Guidance Playbook
            </h3>
            {hasData ? (
              <>
                <RecommendationCard
                  title="Escalate Apex Steel Delinquency"
                  description="Automate payment reminders and flag accounting profiles directly to CEO/CFO signature review layers."
                  priority="critical"
                  impact="Recovers +$47.5k ledger buffer"
                  action={{
                    label: "Escalate Now",
                    onClick: () => {
                      alert("Triggering collection protocol for invoice INV-2024-089.");
                    },
                  }}
                  confidence={94}
                />
                <RecommendationCard
                  title="Optimize High-Yield Treasury Sweep"
                  description="Sweep excess balance exceeding $300k reserve buffer into overnight cash assets to earn 4.8% APY."
                  priority="medium"
                  impact="Generates estimated $140 monthly yield"
                  action={{
                    label: "Open Treasury",
                    onClick: () => {},
                  }}
                  confidence={82}
                />
              </>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-[#222] text-center text-xs text-[#848e9c] bg-[#111]/30">
                No financial documents have been processed yet.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
