"use client";
import React from "react";
import { cn } from "@/shared/utils/cn";

export interface PropertyItem {
  key: string;
  label: string;
  value: React.ReactNode;
  span?: 1 | 2;
}

interface PropertyGridProps {
  properties: PropertyItem[];
  columns?: 1 | 2 | 3;
  className?: string;
  compact?: boolean;
}

export function PropertyGrid({
  properties,
  columns = 2,
  className,
  compact = false,
}: PropertyGridProps) {
  const colClass = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3" }[columns];

  return (
    <dl
      className={cn(
        "grid gap-x-6",
        compact ? "gap-y-2" : "gap-y-3",
        colClass,
        className
      )}
    >
      {properties.map((prop) => (
        <div
          key={prop.key}
          className={cn("flex flex-col gap-0.5", prop.span === 2 && "col-span-2")}
        >
          <dt className="text-[10px] font-medium uppercase tracking-wider text-white/30">
            {prop.label}
          </dt>
          <dd className="text-xs text-white/80 break-words">{prop.value}</dd>
        </div>
      ))}
    </dl>
  );
}
