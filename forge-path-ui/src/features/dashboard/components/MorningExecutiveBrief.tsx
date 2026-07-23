"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Sparkles,
  AlertTriangle,
  IndianRupee,
  Clock,
  Activity,
  Building,
  Calendar,
} from "lucide-react";

import { Panel } from "@/shared/components/layout/Panel";
import { Skeleton } from "@/shared/components/feedback/Skeleton";
import { EmptyState } from "@/shared/components/feedback/EmptyState";
import { ErrorState } from "@/shared/components/feedback/ErrorState";
import { MetricCard } from "@/shared/components/cards/MetricCard";
import { useSessionStore } from "@/shared/stores/session.store";
import { useDocumentStatusStore } from "@/shared/stores/document-status.store";

interface MorningExecutiveBriefProps {
  state?: "loaded" | "loading" | "empty" | "error";
  onRetry?: () => void;
  data?: {
    cash_position?: string | null;
    cash_runway?: string | null;
    solvency_rating?: string | null;
    briefing_digest?: string | null;
    alerts?: Array<{ id: string; title: string; message: string; severity: "critical" | "warning" | "info" }>;
    recommendations?: Array<{ title: string; description: string; priority: "critical" | "high" | "medium"; impact: string }>;
  };
}

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

export function MorningExecutiveBrief({ state = "loaded", onRetry, data }: MorningExecutiveBriefProps) {
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const { user, isAuthenticated } = useSessionStore();
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0 && !!data?.cash_position;
  const firstName = isAuthenticated && user?.name ? user.name.split(" ")[0] : null;
  const organization = isAuthenticated && user?.organization ? user.organization : null;

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
    setCurrentDate(new Date().toLocaleDateString("en-IN", dateOptions));

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const motionProps = prefersReducedMotion
    ? {}
    : { variants: containerVariants, initial: "hidden", animate: "visible" };

  const motionItemProps = prefersReducedMotion ? {} : { variants: itemVariants };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (state === "loading") {
    return (
      <div className="space-y-6" role="status" aria-label="Loading executive brief">
        <div className="flex flex-col gap-2">
          <Skeleton height={20} width="250px" />
          <div className="flex gap-4">
            <Skeleton height={12} width="120px" />
            <Skeleton height={12} width="160px" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Panel key={i} className="min-h-[100px] justify-between">
              <Skeleton height={10} width="50%" />
              <Skeleton height={20} width="40%" />
            </Panel>
          ))}
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
          description="No financial documents have been processed yet."
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
          title="Unable to retrieve data."
          message="Failed to fetch real-time solvency data from backend."
          onRetry={onRetry}
          size="md"
        />
      </div>
    );
  }

  // ── Loaded / Ready ───────────────────────────────────────────────────────
  const alertsList = data?.alerts ?? [];
  const recommendationsList = data?.recommendations ?? [];

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
            {greeting}
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
          value={hasData && data?.cash_position ? data.cash_position : "---"}
          trend={hasData ? { value: "---", direction: "flat" } : { value: "No financial data available", direction: "flat" }}
          severity="normal"
          icon={<IndianRupee className="w-4 h-4 text-[#faff69]" aria-hidden="true" />}
        />
        <MetricCard
          label="Estimated Cash Runway"
          value={hasData && data?.cash_runway ? data.cash_runway : "---"}
          trend={{ value: "Forecast unavailable", direction: "flat" }}
          severity="normal"
          icon={<Clock className="w-4 h-4 text-white/40" aria-hidden="true" />}
        />
        <MetricCard
          label="Business Solvency Rating"
          value={hasData && data?.solvency_rating ? data.solvency_rating : "---"}
          trend={{ value: "No solvency model generated yet.", direction: "flat" }}
          severity="normal"
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
              className="bg-gradient-to-br from-[#111] via-[#161616] to-[#111] border-[#222]"
              padded={true}
              aria-label="AI executive summary"
            >
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#faff69]/10 text-[#faff69] mt-0.5 flex-shrink-0">
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
                    {hasData && data?.briefing_digest
                      ? data.briefing_digest
                      : "No financial documents have been processed yet."}
                  </p>
                </div>
              </div>
            </Panel>
          </motion.div>

          {/* Critical Alerts Panel */}
          <motion.div {...motionItemProps}>
            <Panel
              className="bg-[#141414] border border-[#222]"
              padded={true}
              role="region"
              aria-label="Critical alerts requiring action"
            >
              <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-white/40" aria-hidden="true" />
                Action Required: {alertsList.length > 0 ? `${alertsList.length} Exceptions` : "0 Exceptions"}
              </h3>
              {alertsList.length > 0 ? (
                <ul className="space-y-2 list-none">
                  {alertsList.map((alt) => (
                    <li key={alt.id}>
                      <div className="flex items-start gap-2.5 p-2 rounded bg-red-500/[0.02] border border-red-500/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                        <p className="min-w-0 text-xs text-white/70">
                          <span className="text-white/80 font-medium">{alt.title}:</span> {alt.message}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-xs text-white/40 py-2">No notifications.</div>
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
            {recommendationsList.length > 0 ? (
              <div className="space-y-2">
                {recommendationsList.map((rec, i) => (
                  <div key={i} className="p-3 bg-[#111] border border-[#222] rounded-xl space-y-1 text-xs">
                    <span className="font-bold text-white">{rec.title}</span>
                    <p className="text-white/60 text-[11px]">{rec.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-[#222] text-center text-xs text-[#848e9c] bg-[#111]/30">
                Waiting for financial context.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
