"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/utils/cn";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  size = "md",
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col items-center justify-center text-center gap-3",
        size === "sm" && "py-8",
        size === "md" && "py-16",
        size === "lg" && "py-24",
        className
      )}
      role="status"
      aria-label={title}
    >
      {icon && (
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#2a2a2a] text-white/40">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-white/70">{title}</p>
        {description && (
          <p className="text-xs text-white/40 max-w-xs">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </motion.div>
  );
}
