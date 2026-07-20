"use client";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface StreamingIndicatorProps {
  label?: string;
  className?: string;
  variant?: "dots" | "pulse" | "bar";
}

export function StreamingIndicator({
  label = "Thinking…",
  className,
  variant = "dots",
}: StreamingIndicatorProps) {
  return (
    <div
      className={cn("flex items-center gap-2 py-2", className)}
      aria-live="polite"
      aria-label={label}
    >
      <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#faff69]/10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <Sparkles className="w-3 h-3 text-[#faff69]" />
        </motion.div>
      </div>

      {variant === "dots" && (
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, delay: i * 0.2, duration: 0.8 }}
              className="w-1 h-1 rounded-full bg-[#faff69]/60"
            />
          ))}
        </div>
      )}

      {variant === "pulse" && (
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-xs text-[#faff69]/70"
        >
          {label}
        </motion.div>
      )}

      {variant === "bar" && (
        <div className="flex items-end gap-0.5 h-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={{ height: ["4px", "14px", "4px"] }}
              transition={{ repeat: Infinity, delay: i * 0.1, duration: 0.7 }}
              className="w-1 rounded-full bg-[#faff69]/60"
            />
          ))}
        </div>
      )}
    </div>
  );
}
