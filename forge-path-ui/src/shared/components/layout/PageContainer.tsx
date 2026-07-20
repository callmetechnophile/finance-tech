"use client";
import React from "react";
import { cn } from "@/shared/utils/cn";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padded?: boolean;
  scrollable?: boolean;
  "aria-label"?: string;
}

const maxWidthMap: Record<string, string> = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-full",
};

export function PageContainer({
  children,
  className,
  maxWidth = "full",
  padded = true,
  scrollable = true,
  "aria-label": ariaLabel,
}: PageContainerProps) {
  return (
    <main
      aria-label={ariaLabel}
      className={cn(
        "flex flex-col w-full h-full",
        scrollable && "overflow-y-auto overflow-x-hidden",
        padded && "p-6",
        maxWidthMap[maxWidth],
        className
      )}
    >
      {children}
    </main>
  );
}
