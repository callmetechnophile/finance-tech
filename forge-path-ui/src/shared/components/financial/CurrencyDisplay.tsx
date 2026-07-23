"use client";
import { cn } from "@/shared/utils/cn";
import { useWorkspaceStore } from "@/shared/stores/workspace.store";
import { formatCurrency, formatCompact } from "@/shared/utils/currency";
import type { SupportedCurrency } from "@/shared/utils/currency";

interface CurrencyDisplayProps {
  value: number;
  currency?: SupportedCurrency | string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  compact?: boolean;
  className?: string;
  showSign?: boolean;
  colorCode?: boolean;
}

const sizeMap: Record<string, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
};

export function CurrencyDisplay({
  value,
  currency,
  size = "md",
  compact = false,
  className,
  showSign = false,
  colorCode = false,
}: CurrencyDisplayProps) {
  // Fall back to workspace currency when no prop given
  const workspaceCurrency = useWorkspaceStore((s) => s.currency);
  const activeCurrency = (currency ?? workspaceCurrency) as SupportedCurrency;

  const formatted = compact
    ? formatCompact(value, activeCurrency)
    : formatCurrency(value, activeCurrency);

  const color = colorCode
    ? value > 0
      ? "text-green-400"
      : value < 0
        ? "text-red-400"
        : "text-white/60"
    : undefined;

  return (
    <span
      className={cn("font-semibold tabular-nums", sizeMap[size], color, className)}
      aria-label={`${activeCurrency} ${value}`}
    >
      {showSign && value > 0 ? "+" : ""}
      {formatted}
    </span>
  );
}
