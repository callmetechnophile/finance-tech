"use client";
import { cn } from "@/shared/utils/cn";

interface CurrencyDisplayProps {
  value: number;
  currency?: string;
  locale?: string;
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
  currency = "USD",
  locale = "en-US",
  size = "md",
  compact = false,
  className,
  showSign = false,
  colorCode = false,
}: CurrencyDisplayProps) {
  const formatted = compact
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(value)
    : new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);

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
      aria-label={`${currency} ${value}`}
    >
      {showSign && value > 0 ? "+" : ""}
      {formatted}
    </span>
  );
}
