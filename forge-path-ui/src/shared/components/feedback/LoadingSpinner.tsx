"use client";
import { cn } from "@/shared/utils/cn";

interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  label?: string;
  color?: "yellow" | "white" | "muted";
}

const sizeMap = {
  xs: "w-3 h-3 border",
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-2",
  xl: "w-12 h-12 border-4",
};

const colorMap = {
  yellow: "border-[#faff69] border-t-transparent",
  white: "border-white border-t-transparent",
  muted: "border-white/30 border-t-white/70",
};

export function LoadingSpinner({
  size = "md",
  className,
  label = "Loading...",
  color = "yellow",
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn("flex items-center justify-center", className)}
    >
      <div
        className={cn("rounded-full animate-spin", sizeMap[size], colorMap[color])}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
