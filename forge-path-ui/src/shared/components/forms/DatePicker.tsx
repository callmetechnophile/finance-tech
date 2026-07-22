"use client";
import React, { forwardRef, useId } from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface DatePickerProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  className?: string;
  id?: string;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, value, onChange, error, disabled, min, max, className, id }, ref) => {
    const generatedId = useId();
    const inputId = id ?? `date-${generatedId}`;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-white/60">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <Calendar className="absolute left-3 w-3.5 h-3.5 text-white/30 pointer-events-none" />
          <input
            ref={ref}
            id={inputId}
            type="date"
            value={value}
            min={min}
            max={max}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            aria-invalid={!!error}
            className={cn(
              "w-full h-9 pl-9 pr-3 rounded-md bg-[#1a1a1a] border text-white/80 text-xs",
              "focus:outline-none focus:ring-1 focus:ring-[#faff69]/50 focus:border-[#faff69]/50",
              "transition-colors disabled:opacity-40 [color-scheme:dark]",
              error ? "border-red-500/50" : "border-[#2a2a2a]",
              className
            )}
          />
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
DatePicker.displayName = "DatePicker";
