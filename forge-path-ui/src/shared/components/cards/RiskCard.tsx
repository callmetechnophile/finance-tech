"use client";
import React from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/shared/utils/cn";

type RiskLevel = "critical" | "high" | "medium" | "low" | "none";

interface RiskCardProps {
  title: string;
  level: RiskLevel;
  score?: number;
  description?: string;
  className?: string;
  onClick?: () => void;
}

const riskConfig: Record<RiskLevel, { color: string; bg: string; label: string }> = {
  critical: { color: "text-red-400", bg: "bg-red-500", label: "Critical" },
  high: { color: "text-orange-400", bg: "bg-orange-500", label: "High" },
  medium: { color: "text-amber-400", bg: "bg-amber-500", label: "Medium" },
  low: { color: "text-green-400", bg: "bg-green-500", label: "Low" },
  none: { color: "text-white/30", bg: "bg-white/20", label: "None" },
};

export function RiskCard({
  title,
  level,
  score,
  description,
  className,
  onClick,
}: RiskCardProps) {
  const config = riskConfig[level];
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        "p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex flex-col gap-3",
        onClick && "cursor-pointer hover:border-[#3a3a3a] transition-colors",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className={cn("w-4 h-4", config.color)} />
          <span className="text-xs font-medium text-white/80">{title}</span>
        </div>
        <span className={cn("text-xs font-semibold", config.color)}>{config.label}</span>
      </div>
      {score !== undefined && (
        <div className="flex flex-col gap-1">
          <div className="h-1 w-full bg-[#2a2a2a] rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", config.bg)}
              style={{ width: `${score}%` }}
            />
          </div>
          <span className="text-[10px] text-white/30 text-right">{score}/100</span>
        </div>
      )}
      {description && (
        <p className="text-xs text-white/40">{description}</p>
      )}
    </div>
  );
}
