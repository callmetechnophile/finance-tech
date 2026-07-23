"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/shared/utils/cn";

import { useDocumentStatusStore } from "@/shared/stores/document-status.store";

interface InsightCardProps {
  title: string;
  summary: string;
  detail?: string;
  confidence?: number;
  icon?: React.ReactNode;
  className?: string;
  tags?: string[];
}

export function InsightCard({
  title: rawTitle,
  summary: rawSummary,
  detail: rawDetail,
  confidence: rawConfidence,
  icon,
  className,
  tags: rawTags,
}: InsightCardProps) {
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;
  const title = hasData ? rawTitle : "AI Financial Insight";
  const summary = hasData ? rawSummary : "No financial documents have been processed yet.";
  const detail = hasData ? rawDetail : undefined;
  const confidence = hasData ? rawConfidence : undefined;
  const tags = hasData ? rawTags : undefined;
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "rounded-xl bg-[#1a1a1a] border border-[#faff69]/10 overflow-hidden",
        className
      )}
    >
      <button
        onClick={() => detail && setExpanded((e) => !e)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-white/5 transition-colors"
        aria-expanded={expanded}
      >
        <div className="w-7 h-7 flex items-center justify-center rounded-md bg-[#faff69]/10 text-[#faff69] flex-shrink-0 mt-0.5">
          {icon ?? <Sparkles className="w-3.5 h-3.5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-semibold text-white/90">{title}</p>
            {confidence !== undefined && (
              <span className="text-xs text-[#faff69]/70 flex-shrink-0">
                {confidence}%
              </span>
            )}
          </div>
          <p className="text-xs text-white/50 mt-0.5">{summary}</p>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 text-[10px] rounded bg-[#2a2a2a] text-white/40"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        {detail && (
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 text-white/30 flex-shrink-0 transition-transform mt-0.5",
              expanded && "rotate-180"
            )}
          />
        )}
      </button>

      <AnimatePresence>
        {expanded && detail && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 border-t border-[#2a2a2a] pt-3">
              <p className="text-xs text-white/50 leading-relaxed">{detail}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
