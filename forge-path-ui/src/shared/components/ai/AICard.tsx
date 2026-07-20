"use client";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface AICardProps {
  title: string;
  content: string;
  confidence?: number;
  reasoning?: string;
  category?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function AICard({
  title,
  content,
  confidence,
  reasoning,
  category,
  icon,
  actions,
  className,
}: AICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-4 rounded-xl bg-[#0f1a1a] border border-[#faff69]/15 flex flex-col gap-3",
        className
      )}
    >
      <div className="flex items-start gap-2">
        <div className="w-6 h-6 flex items-center justify-center rounded-md bg-[#faff69]/10 text-[#faff69] flex-shrink-0">
          {icon ?? <Sparkles className="w-3.5 h-3.5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-white/90">{title}</span>
            {confidence !== undefined && (
              <span className="text-[10px] text-[#faff69]/60 flex-shrink-0">
                {confidence}% confidence
              </span>
            )}
          </div>
          {category && (
            <span className="text-[10px] text-white/30">{category}</span>
          )}
        </div>
      </div>
      <p className="text-xs text-white/65 leading-relaxed">{content}</p>
      {reasoning && (
        <div className="pt-2 border-t border-[#faff69]/10">
          <p className="text-[10px] text-white/35 leading-relaxed">
            <span className="text-[#faff69]/40 font-semibold">Reasoning: </span>
            {reasoning}
          </p>
        </div>
      )}
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </motion.div>
  );
}
