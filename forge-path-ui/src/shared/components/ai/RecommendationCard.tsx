"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/shared/utils/cn";

import { useDocumentStatusStore } from "@/shared/stores/document-status.store";

type RecommendationPriority = "critical" | "high" | "medium" | "low";

interface RecommendationCardProps {
  title: string;
  description: string;
  priority: RecommendationPriority;
  impact?: string;
  action?: { label: string; onClick: () => void };
  confidence?: number;
  className?: string;
}

const priorityConfig: Record<RecommendationPriority, { dot: string; border: string }> =
  {
    critical: { dot: "bg-red-500", border: "border-red-500/20" },
    high: { dot: "bg-orange-500", border: "border-orange-500/20" },
    medium: { dot: "bg-amber-500", border: "border-amber-500/20" },
    low: { dot: "bg-green-500", border: "border-green-500/20" },
  };

export function RecommendationCard({
  title: rawTitle,
  description: rawDescription,
  priority,
  impact: rawImpact,
  action: rawAction,
  confidence: rawConfidence,
  className,
}: RecommendationCardProps) {
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;
  const title = hasData ? rawTitle : "AI Guidance Playbook";
  const description = hasData ? rawDescription : "No financial documents have been processed yet.";
  const impact = hasData ? rawImpact : undefined;
  const action = hasData ? rawAction : undefined;
  const confidence = hasData ? rawConfidence : undefined;
  const cfg = priorityConfig[priority];

  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "p-3 rounded-lg bg-[#1a1a1a] border flex flex-col gap-2",
        cfg.border,
        className
      )}
    >
      <div className="flex items-start gap-2">
        <div className={cn("w-2 h-2 rounded-full flex-shrink-0 mt-1", cfg.dot)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-white/90">{title}</span>
            {confidence !== undefined && (
              <span className="text-[10px] text-white/30 flex-shrink-0">
                {confidence}%
              </span>
            )}
          </div>
          <p className="text-xs text-white/50 mt-0.5">{description}</p>
        </div>
      </div>
      {(impact || action) && (
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#2a2a2a]">
          {impact && (
            <span className="text-[10px] text-[#faff69]/60">Impact: {impact}</span>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className="flex items-center gap-1 text-[10px] font-medium text-[#faff69]/80 hover:text-[#faff69] transition-colors ml-auto"
            >
              {action.label} <ArrowRight className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
