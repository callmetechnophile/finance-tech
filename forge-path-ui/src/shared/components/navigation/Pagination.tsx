"use client";
import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  className?: string;
  size?: "sm" | "md";
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  showFirstLast = false,
  className,
  size = "md",
}: PaginationProps) {
  const btnClass = cn(
    "flex items-center justify-center rounded-md border border-[#2a2a2a] text-white/50",
    "hover:border-[#3a3a3a] hover:text-white/80 transition-colors",
    "disabled:opacity-30 disabled:cursor-not-allowed",
    size === "sm" ? "w-6 h-6 text-xs" : "w-8 h-8 text-xs"
  );

  const clamp = Math.min(Math.max(page, 3), Math.max(totalPages - 2, 3));
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => clamp - 2 + i).filter(
    (p) => p >= 1 && p <= totalPages
  );

  return (
    <nav aria-label="Pagination" className={cn("flex items-center gap-1", className)}>
      {showFirstLast && (
        <button
          className={btnClass}
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          aria-label="First page"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>
      )}
      <button
        className={btnClass}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={cn(
            btnClass,
            "font-medium",
            p === page && "bg-[#faff69] text-black border-[#faff69] hover:bg-[#faff69]/90"
          )}
        >
          {p}
        </button>
      ))}
      <button
        className={btnClass}
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
      {showFirstLast && (
        <button
          className={btnClass}
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          aria-label="Last page"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      )}
    </nav>
  );
}
