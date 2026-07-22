"use client";
import React, { forwardRef, useId, useState } from "react";
import { cn } from "@/shared/utils/cn";

interface CurrencyInputProps {
  label?: string;
  value?: number | string;
  onChange?: (value: number | null) => void;
  currency?: string;
  locale?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      label,
      value,
      onChange,
      currency = "USD",
      locale = "en-US",
      error,
      placeholder = "0.00",
      disabled,
      className,
      id,
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? `currency-${generatedId}`;
    const [raw, setRaw] = useState(value !== undefined ? String(value) : "");

    const symbol =
      new Intl.NumberFormat(locale, { style: "currency", currency })
        .formatToParts(0)
        .find((p) => p.type === "currency")?.value ?? "$";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const stripped = e.target.value.replace(/[^0-9.]/g, "");
      setRaw(stripped);
      const num = parseFloat(stripped);
      onChange?.(isNaN(num) ? null : num);
    };

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-white/60">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <span className="absolute left-3 text-white/40 text-xs font-medium pointer-events-none">
            {symbol}
          </span>
          <input
            ref={ref}
            id={inputId}
            type="text"
            inputMode="decimal"
            value={raw}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={!!error}
            className={cn(
              "w-full pl-8 pr-3 h-9 rounded-md bg-[#1a1a1a] border text-white/80 text-xs",
              "placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[#faff69]/50 focus:border-[#faff69]/50",
              "transition-colors disabled:opacity-40",
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
CurrencyInput.displayName = "CurrencyInput";
