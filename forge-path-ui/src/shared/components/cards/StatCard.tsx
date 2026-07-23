"use client";
import React from "react";
import { cn } from "@/shared/utils/cn";

import { useDocumentStatusStore } from "@/shared/stores/document-status.store";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  accentColor?: string;
  className?: string;
  description?: string;
}

export function StatCard({
  label,
  value: rawValue,
  icon,
  accentColor,
  className,
  description: rawDescription,
}: StatCardProps) {
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;
  const value = hasData ? rawValue : "---";
  const description = hasData ? rawDescription : undefined;
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]",
        className
      )}
    >
      {icon && (
        <div
          className="w-8 h-8 flex items-center justify-center rounded-md flex-shrink-0"
          style={
            accentColor
              ? { backgroundColor: `${accentColor}20`, color: accentColor }
              : undefined
          }
        >
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <div className="text-base font-semibold text-white truncate">{value}</div>
        <div className="text-xs text-white/40 truncate">{label}</div>
        {description && (
          <div className="text-xs text-white/30 truncate">{description}</div>
        )}
      </div>
    </div>
  );
}
