"use client";
import React from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  className,
  size = "md",
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col items-center justify-center text-center gap-3",
        size === "sm" && "py-8",
        size === "md" && "py-16",
        size === "lg" && "py-24",
        className
      )}
      role="alert"
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-red-500/10 text-red-400">
        <AlertCircle className="w-5 h-5" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-white/80">{title}</p>
        <p className="text-xs text-white/40 max-w-xs">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-3 py-1.5 text-xs font-medium rounded-md bg-[#2a2a2a] text-white/70 hover:bg-[#333] hover:text-white transition-colors"
        >
          Try again
        </button>
      )}
    </motion.div>
  );
}
