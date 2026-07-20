"use client";
import React from "react";
import { cn } from "@/shared/utils/cn";

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  divider?: boolean;
  className?: string;
  actions?: React.ReactNode;
  compact?: boolean;
}

export function Section({
  children,
  title,
  description,
  divider = false,
  className,
  actions,
  compact = false,
}: SectionProps) {
  return (
    <section
      className={cn(
        "flex flex-col",
        compact ? "gap-3" : "gap-4",
        divider && "border-t border-[#2a2a2a] pt-4",
        className
      )}
    >
      {(title || description || actions) && (
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            {title && (
              <h2 className="text-sm font-semibold text-white/90 tracking-wide uppercase">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xs text-white/50">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}
