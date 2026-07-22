"use client";
import React, { useId } from "react";
import { Check } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  id?: string;
  indeterminate?: boolean;
}

export function Checkbox({
  checked,
  onChange,
  label,
  error,
  disabled,
  id,
  indeterminate,
}: CheckboxProps) {
  const generatedId = useId();
  const checkId = id ?? `check-${generatedId}`;

  return (
    <div className="flex flex-col gap-1">
      <div className={cn("flex items-center gap-2", disabled && "opacity-40")}>
        <button
          id={checkId}
          role="checkbox"
          aria-checked={indeterminate ? "mixed" : checked}
          aria-label={label}
          disabled={disabled}
          onClick={() => onChange(!checked)}
          className={cn(
            "w-4 h-4 rounded flex items-center justify-center border flex-shrink-0 transition-all",
            "focus:outline-none focus:ring-1 focus:ring-[#faff69]/50",
            checked || indeterminate
              ? "bg-[#faff69] border-[#faff69]"
              : "bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#3a3a3a]",
            error && "border-red-500/50"
          )}
        >
          {indeterminate ? (
            <div className="w-2 h-0.5 bg-black rounded-full" />
          ) : checked ? (
            <Check className="w-2.5 h-2.5 text-black" strokeWidth={3} />
          ) : null}
        </button>
        {label && (
          <label
            htmlFor={checkId}
            className={cn("text-xs text-white/70", !disabled && "cursor-pointer")}
          >
            {label}
          </label>
        )}
      </div>
      {error && (
        <p role="alert" className="text-xs text-red-400 ml-6">
          {error}
        </p>
      )}
    </div>
  );
}
