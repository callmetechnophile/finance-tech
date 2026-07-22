"use client";
import React, { forwardRef, useId } from "react";
import { cn } from "@/shared/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputSize?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-7 text-xs px-2.5",
  md: "h-9 text-xs px-3",
  lg: "h-11 text-sm px-4",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      inputSize = "md",
      className,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? `input-${generatedId}`;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-white/60">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-white/30 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            className={cn(
              "w-full rounded-md bg-[#1a1a1a] border text-white/80 placeholder:text-white/25",
              "focus:outline-none focus:ring-1 focus:ring-[#faff69]/50 focus:border-[#faff69]/50",
              "transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
              error
                ? "border-red-500/50"
                : "border-[#2a2a2a] hover:border-[#3a3a3a]",
              sizeMap[inputSize],
              leftIcon && "pl-9",
              rightIcon && "pr-9",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-white/30">{rightIcon}</div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} role="alert" className="text-xs text-red-400">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-xs text-white/30">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
