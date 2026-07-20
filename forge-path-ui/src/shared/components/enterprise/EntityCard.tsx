"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/utils/cn";

interface EntityCardProps {
  name: string;
  subtitle?: string;
  meta?: string;
  avatar?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

export function EntityCard({
  name,
  subtitle,
  meta,
  avatar,
  badge,
  actions,
  onClick,
  selected,
  className,
}: EntityCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.005 }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl border transition-colors bg-[#1a1a1a]",
        selected ? "border-[#faff69]/30 bg-[#faff69]/5" : "border-[#2a2a2a]",
        onClick && "cursor-pointer hover:border-[#3a3a3a]",
        className
      )}
    >
      {avatar && <div className="flex-shrink-0">{avatar}</div>}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-white/90 truncate">{name}</span>
          {badge}
        </div>
        {subtitle && <p className="text-xs text-white/40 truncate">{subtitle}</p>}
        {meta && <p className="text-[10px] text-white/25 truncate">{meta}</p>}
      </div>
      {actions && <div className="flex-shrink-0">{actions}</div>}
    </motion.div>
  );
}
