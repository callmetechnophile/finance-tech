"use client";
import React from "react";
import { X, ChevronLeft } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface DrawerHeaderProps {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  onBack?: () => void;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export function DrawerHeader({
  title,
  subtitle,
  onClose,
  onBack,
  actions,
  badge,
  className,
}: DrawerHeaderProps) {
  return (
    <header
      className={cn(
        "flex items-center gap-3 px-4 py-3 border-b border-[#2a2a2a] bg-[#0f0f0f] flex-shrink-0",
        className
      )}
    >
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Go back"
          className="w-6 h-6 flex items-center justify-center rounded-md text-white/30 hover:bg-[#2a2a2a] hover:text-white/70 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-semibold text-white/90 truncate">{title}</h2>
          {badge}
        </div>
        {subtitle && (
          <p className="text-[10px] text-white/35 truncate">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-1 flex-shrink-0">{actions}</div>
      )}
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close drawer"
          className="w-6 h-6 flex items-center justify-center rounded-md text-white/30 hover:bg-[#2a2a2a] hover:text-white/70 transition-colors flex-shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </header>
  );
}
