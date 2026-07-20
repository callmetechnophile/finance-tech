"use client";
import React from "react";
import { cn } from "@/shared/utils/cn";

interface DrawerFooterProps {
  primaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  extraActions?: React.ReactNode;
  className?: string;
}

export function DrawerFooter({
  primaryAction,
  secondaryAction,
  extraActions,
  className,
}: DrawerFooterProps) {
  return (
    <footer
      className={cn(
        "flex items-center justify-between gap-3 px-4 py-3 border-t border-[#2a2a2a] bg-[#0f0f0f] flex-shrink-0",
        className
      )}
    >
      <div className="flex items-center gap-2">{extraActions}</div>
      <div className="flex items-center gap-2">
        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            disabled={secondaryAction.disabled}
            className="px-3 py-1.5 rounded-md text-xs font-medium text-white/60 bg-[#1a1a1a] border border-[#2a2a2a] hover:bg-[#222] hover:text-white/80 transition-colors disabled:opacity-40"
          >
            {secondaryAction.label}
          </button>
        )}
        {primaryAction && (
          <button
            onClick={primaryAction.onClick}
            disabled={primaryAction.disabled || primaryAction.loading}
            className="px-3 py-1.5 rounded-md text-xs font-semibold bg-[#faff69] text-black hover:bg-[#e8ec5a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {primaryAction.loading ? "Saving…" : primaryAction.label}
          </button>
        )}
      </div>
    </footer>
  );
}
