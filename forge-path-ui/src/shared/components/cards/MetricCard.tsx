"use client";
import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/shared/utils/cn";

type TrendDirection = "up" | "down" | "flat";
type MetricSeverity = "normal" | "warning" | "critical" | "positive";

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: { value: string; direction: TrendDirection; label?: string };
  severity?: MetricSeverity;
  icon?: React.ReactNode;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}

const severityBorder: Record<MetricSeverity, string> = {
  normal: "border-[#2a2a2a]",
  warning: "border-amber-500/30",
  critical: "border-red-500/30",
  positive: "border-green-500/30",
};

const trendColor: Record<TrendDirection, string> = {
  up: "text-green-400",
  down: "text-red-400",
  flat: "text-white/40",
};

const TrendIcon = ({ direction }: { direction: TrendDirection }) => {
  if (direction === "up") return <TrendingUp className="w-3 h-3" />;
  if (direction === "down") return <TrendingDown className="w-3 h-3" />;
  return <Minus className="w-3 h-3" />;
};

export function MetricCard({
  label,
  value,
  trend,
  severity = "normal",
  icon,
  loading = false,
  className,
  onClick,
}: MetricCardProps) {
  return (
    <motion.div
      whileHover={onClick ? { scale: 1.01 } : undefined}
      whileTap={onClick ? { scale: 0.99 } : undefined}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        "flex flex-col gap-3 p-4 rounded-xl bg-[#1a1a1a] border",
        severityBorder[severity],
        onClick && "cursor-pointer hover:border-[#faff69]/30 transition-colors",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs text-white/50 font-medium">{label}</span>
        {icon && <div className="text-white/30">{icon}</div>}
      </div>

      {loading ? (
        <div className="h-8 w-24 bg-[#2a2a2a] animate-pulse rounded-md" />
      ) : (
        <span className="text-2xl font-semibold text-white tracking-tight">{value}</span>
      )}

      {trend && !loading && (
        <div
          className={cn(
            "flex items-center gap-1 text-xs font-medium",
            trendColor[trend.direction]
          )}
        >
          <TrendIcon direction={trend.direction} />
          <span>{trend.value}</span>
          {trend.label && (
            <span className="text-white/30 font-normal">{trend.label}</span>
          )}
        </div>
      )}
    </motion.div>
  );
}
