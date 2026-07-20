"use client";
import React from "react";
import { cn } from "@/shared/utils/cn";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: "sm" | "md" | "lg" | "full";
  lines?: number;
  animated?: boolean;
}

const roundedMap = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

export function Skeleton({
  className,
  width,
  height,
  rounded = "md",
  lines = 1,
  animated = true,
}: SkeletonProps) {
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  if (lines > 1) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "bg-[#2a2a2a]",
              animated && "animate-pulse",
              roundedMap[rounded],
              i === lines - 1 ? "w-3/4" : "w-full",
              className
            )}
            style={{
              height: height
                ? typeof height === "number"
                  ? `${height}px`
                  : height
                : "16px",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-[#2a2a2a]",
        animated && "animate-pulse",
        roundedMap[rounded],
        !height && "h-4",
        !width && "w-full",
        className
      )}
      style={style}
      aria-hidden="true"
    />
  );
}
