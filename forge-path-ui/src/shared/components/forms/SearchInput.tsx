"use client";
import React, { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  onClear?: () => void;
  size?: "sm" | "md" | "lg";
  id?: string;
}

const sizeMap = { sm: "h-7 text-xs", md: "h-9 text-xs", lg: "h-11 text-sm" };

export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  className,
  autoFocus,
  onClear,
  size = "md",
  id,
}: SearchInputProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  return (
    <div className={cn("relative flex items-center", className)}>
      <Search className="absolute left-3 w-3.5 h-3.5 text-white/30 pointer-events-none" />
      <input
        ref={ref}
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full pl-9 pr-8 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] text-white/80",
          "placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[#faff69]/50 focus:border-[#faff69]/50",
          "transition-colors",
          sizeMap[size]
        )}
        role="searchbox"
        aria-label={placeholder}
      />
      {value && (
        <button
          onClick={() => {
            onChange("");
            onClear?.();
          }}
          className="absolute right-2.5 text-white/30 hover:text-white/60 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
