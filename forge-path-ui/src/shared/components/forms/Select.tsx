"use client";
import React, { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: "h-7 text-xs", md: "h-9 text-xs", lg: "h-11 text-sm" };

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      value,
      onChange,
      placeholder,
      error,
      disabled,
      className,
      id,
      size = "md",
    },
    ref
  ) => {
    const selectId = id ?? `select-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-xs font-medium text-white/60">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            aria-invalid={!!error}
            className={cn(
              "w-full appearance-none rounded-md bg-[#1a1a1a] border px-3 pr-8 text-white/80",
              "focus:outline-none focus:ring-1 focus:ring-[#faff69]/50 focus:border-[#faff69]/50",
              "transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
              error ? "border-red-500/50" : "border-[#2a2a2a]",
              sizeMap[size],
              className
            )}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
        </div>
        {error && (
          <p role="alert" className="text-xs text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";
