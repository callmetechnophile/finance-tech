"use client";
import React from "react";
import { cn } from "@/shared/utils/cn";

type PanelVariant = "default" | "elevated" | "ghost" | "accent";

interface PanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: PanelVariant;
  padded?: boolean;
  rounded?: "sm" | "md" | "lg" | "xl";
  role?: string;
  "aria-label"?: string;
}

const variantStyles: Record<PanelVariant, string> = {
  default: "bg-[#1a1a1a] border border-[#2a2a2a]",
  elevated: "bg-[#222222] border border-[#333333] shadow-xl shadow-black/40",
  ghost: "bg-transparent border border-[#2a2a2a]/50",
  accent: "bg-[#1a1a1a] border border-[#faff69]/20",
};

const roundedMap = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
};

export function Panel({
  children,
  className,
  variant = "default",
  padded = true,
  rounded = "lg",
  role,
  "aria-label": ariaLabel,
}: PanelProps) {
  return (
    <div
      role={role}
      aria-label={ariaLabel}
      className={cn(
        "flex flex-col",
        variantStyles[variant],
        roundedMap[rounded],
        padded && "p-4",
        className
      )}
    >
      {children}
    </div>
  );
}
