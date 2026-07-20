"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/utils/cn";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  id?: string;
  size?: "sm" | "md";
}

const sizeConfig = {
  sm: { track: "w-8 h-4", thumb: "w-3 h-3", on: 14, off: 2 },
  md: { track: "w-10 h-5", thumb: "w-3.5 h-3.5", on: 18, off: 2 },
};

export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled,
  id,
  size = "md",
}: SwitchProps) {
  const switchId = id ?? `switch-${Math.random().toString(36).slice(2, 9)}`;
  const cfg = sizeConfig[size];

  return (
    <div className={cn("flex items-start gap-3", disabled && "opacity-40")}>
      <button
        id={switchId}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative flex-shrink-0 rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-[#faff69]/50",
          cfg.track,
          checked ? "bg-[#faff69]" : "bg-[#2a2a2a]"
        )}
      >
        <motion.div
          animate={{ x: checked ? cfg.on : cfg.off }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 rounded-full",
            cfg.thumb,
            checked ? "bg-black" : "bg-white/40"
          )}
        />
      </button>
      {(label || description) && (
        <label
          htmlFor={switchId}
          className={cn("flex flex-col gap-0.5", !disabled && "cursor-pointer")}
        >
          {label && (
            <span className="text-xs font-medium text-white/80">{label}</span>
          )}
          {description && (
            <span className="text-xs text-white/40">{description}</span>
          )}
        </label>
      )}
    </div>
  );
}
