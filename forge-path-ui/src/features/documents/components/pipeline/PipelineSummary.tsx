"use client";

/**
 * PipelineSummary
 *
 * Summary stats bar at the top of the pipeline view.
 * Reuses MetricCard from the shared component library.
 */

import React from "react";
import {
  Files,
  Loader2,
  CheckCircle2,
  XCircle,
  Timer,
  Zap,
  ListOrdered,
} from "lucide-react";
import { MetricCard } from "@/shared/components/cards/MetricCard";
import { type PipelineSummaryStats } from "../../types/pipeline.types";
import { formatDuration } from "../../data/pipeline.mock";

interface PipelineSummaryProps {
  stats: PipelineSummaryStats;
}

export function PipelineSummary({ stats }: PipelineSummaryProps) {
  const pendingCount = stats.processing + stats.queueLength;

  const cards = [
    {
      label: "Total Documents",
      value: stats.totalDocuments,
      icon: <Files className="w-4 h-4" />,
      severity: "normal" as const,
      trend: undefined,
    },
    {
      label: "Processing",
      value: stats.processing,
      icon: <Loader2 className={`w-4 h-4 ${stats.processing > 0 ? "animate-spin text-[#faff69]" : "text-white/30"}`} />,
      severity: "normal" as const,
      trend: stats.processing > 0
        ? { value: "Active pipeline", direction: "flat" as const }
        : { value: "Pipeline idle", direction: "flat" as const },
    },
    {
      label: "Successfully Processed",
      value: stats.completed,
      icon: <CheckCircle2 className="w-4 h-4 text-green-400" />,
      severity: "positive" as const,
      trend: {
        value: `${Math.round((stats.completed / Math.max(stats.totalDocuments, 1)) * 100)}% success rate`,
        direction: "up" as const,
      },
    },
    {
      label: "Failed Documents",
      value: stats.failed,
      icon: <XCircle className={`w-4 h-4 ${stats.failed > 0 ? "text-red-400" : "text-white/30"}`} />,
      severity: stats.failed > 0 ? ("critical" as const) : ("normal" as const),
      trend: stats.failed > 0
        ? { value: "Requires attention", direction: "down" as const }
        : { value: "No failures", direction: "flat" as const },
    },
    {
      label: "Avg Processing Time",
      value: formatDuration(stats.avgProcessingMs),
      icon: <Timer className="w-4 h-4" />,
      severity: "normal" as const,
      trend: { value: "16-stage pipeline", direction: "flat" as const },
    },
    {
      label: "Avg Confidence",
      value: `${stats.avgConfidence}%`,
      icon: <Zap className="w-4 h-4 text-[#faff69]" />,
      severity: stats.avgConfidence >= 90 ? ("positive" as const) : ("warning" as const),
      trend: {
        value: stats.avgConfidence >= 90 ? "Excellent accuracy" : "Acceptable",
        direction: "up" as const,
      },
    },
    {
      label: "Queue Items",
      value: stats.totalDocuments,
      icon: <ListOrdered className="w-4 h-4" />,
      severity: "normal" as const,
      trend: {
        value: pendingCount > 0 ? `${pendingCount} pending` : "All items completed",
        direction: "flat" as const,
      },
    },
  ];

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3"
      role="region"
      aria-label="Pipeline summary statistics"
    >
      {cards.map((card) => (
        <MetricCard
          key={card.label}
          label={card.label}
          value={card.value}
          icon={card.icon}
          severity={card.severity}
          trend={card.trend}
        />
      ))}
    </div>
  );
}
