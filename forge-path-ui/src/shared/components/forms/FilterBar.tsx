"use client";
import React from "react";
import { X } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export interface FilterOption {
  key: string;
  label: string;
}

interface FilterBarProps {
  options: FilterOption[];
  active: string[];
  onToggle: (key: string) => void;
  onClear?: () => void;
  className?: string;
  label?: string;
}

export function FilterBar({
  options,
  active,
  onToggle,
  onClear,
  className,
  label,
}: FilterBarProps) {
  return (
    <div
      className={cn("flex items-center gap-2 flex-wrap", className)}
      role="group"
      aria-label={label ?? "Filters"}
    >
      {options.map((opt) => {
        const isActive = active.includes(opt.key);
        return (
          <button
            key={opt.key}
            onClick={() => onToggle(opt.key)}
            aria-pressed={isActive}
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium transition-all",
              isActive
                ? "bg-[#faff69] text-black"
                : "bg-[#1a1a1a] border border-[#2a2a2a] text-white/50 hover:border-[#3a3a3a] hover:text-white/70"
            )}
          >
            {opt.label}
          </button>
        );
      })}
      {active.length > 0 && onClear && (
        <button
          onClick={onClear}
          className="flex items-center gap-1 px-2 py-1 text-xs text-white/30 hover:text-white/60 transition-colors"
          aria-label="Clear all filters"
        >
          <X className="w-3 h-3" /> Clear
        </button>
      )}
    </div>
  );
}
