"use client";
import React from "react";
import { cn } from "@/shared/utils/cn";

interface WorkspaceHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  bordered?: boolean;
}

export function WorkspaceHeader({
  title,
  subtitle,
  actions,
  badge,
  icon,
  className,
  bordered = true,
}: WorkspaceHeaderProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between gap-4 px-6 py-4",
        bordered && "border-b border-[#2a2a2a]",
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-[#2a2a2a]">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-white truncate">{title}</h1>
            {badge}
          </div>
          {subtitle && <p className="text-xs text-white/50 truncate">{subtitle}</p>}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>
      )}
    </header>
  );
}
