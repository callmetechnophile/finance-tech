"use client";
import React from "react";
import { cn } from "@/shared/utils/cn";

interface AuditCardProps {
  actor: string;
  action: string;
  target?: string;
  timestamp: string;
  detail?: string;
  icon?: React.ReactNode;
  category?: string;
  className?: string;
}

export function AuditCard({
  actor,
  action,
  target,
  timestamp,
  detail,
  icon,
  category,
  className,
}: AuditCardProps) {
  return (
    <div
      className={cn(
        "flex gap-3 py-3 border-b border-[#1e1e1e] last:border-0",
        className
      )}
    >
      <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full bg-[#2a2a2a] text-white/40 mt-0.5">
        {icon ?? (
          <span className="text-[10px] font-semibold">
            {actor.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-white/70">
            <span className="font-medium text-white/90">{actor}</span>{" "}
            {action}
            {target && (
              <span className="text-[#faff69]/70 ml-1">{target}</span>
            )}
          </p>
          <span className="text-[10px] text-white/25 flex-shrink-0">
            {timestamp}
          </span>
        </div>
        {detail && (
          <p className="text-[10px] text-white/35 mt-0.5">{detail}</p>
        )}
        {category && (
          <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] rounded bg-[#2a2a2a] text-white/30">
            {category}
          </span>
        )}
      </div>
    </div>
  );
}
