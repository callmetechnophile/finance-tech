"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/utils/cn";

export interface Tab {
  key: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
  variant?: "underline" | "pill" | "card";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "text-xs px-2.5 py-1.5",
  md: "text-xs px-3 py-2",
  lg: "text-sm px-4 py-2.5",
};

export function Tabs({
  tabs,
  active,
  onChange,
  variant = "underline",
  size = "md",
  className,
}: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex items-center",
        variant === "underline" && "border-b border-[#2a2a2a] gap-0",
        variant === "pill" && "bg-[#111] rounded-lg p-1 gap-1",
        variant === "card" && "gap-1",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            aria-disabled={tab.disabled}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onChange(tab.key)}
            className={cn(
              "relative flex items-center gap-1.5 font-medium transition-all",
              "focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed",
              sizeMap[size],
              variant === "underline" && [
                "text-white/40 hover:text-white/70",
                isActive && "text-white",
              ],
              variant === "pill" && [
                "rounded-md text-white/40 hover:text-white/70",
                isActive && "bg-[#1a1a1a] text-white shadow-sm",
              ],
              variant === "card" && [
                "rounded-md border border-transparent text-white/40 hover:text-white/70",
                isActive && "bg-[#1a1a1a] border-[#2a2a2a] text-white",
              ]
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.badge !== undefined && (
              <span className="ml-0.5 px-1.5 py-0.5 text-[10px] rounded-full bg-[#2a2a2a] text-white/50 font-normal">
                {tab.badge}
              </span>
            )}
            {variant === "underline" && isActive && (
              <motion.div
                layoutId="active-tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#faff69] rounded-t-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
