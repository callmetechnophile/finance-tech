"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/shared/utils/cn";

type BannerVariant = "info" | "success" | "warning" | "error";

interface BannerProps {
  variant?: BannerVariant;
  title?: string;
  message: string;
  dismissable?: boolean;
  action?: { label: string; onClick: () => void };
  className?: string;
  icon?: React.ReactNode;
}

const variantStyles: Record<
  BannerVariant,
  { container: string; icon: React.ReactNode; text: string }
> = {
  info: {
    container: "bg-blue-500/10 border-blue-500/20",
    icon: <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />,
    text: "text-blue-300",
  },
  success: {
    container: "bg-green-500/10 border-green-500/20",
    icon: <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />,
    text: "text-green-300",
  },
  warning: {
    container: "bg-amber-500/10 border-amber-500/20",
    icon: <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />,
    text: "text-amber-300",
  },
  error: {
    container: "bg-red-500/10 border-red-500/20",
    icon: <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />,
    text: "text-red-300",
  },
};

export function Banner({
  variant = "info",
  title,
  message,
  dismissable = true,
  action,
  className,
  icon,
}: BannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const styles = variantStyles[variant];

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          role="alert"
          className={cn(
            "flex items-start gap-3 rounded-lg border px-4 py-3",
            styles.container,
            className
          )}
        >
          {icon ?? styles.icon}
          <div className="flex-1 min-w-0">
            {title && (
              <p className={cn("text-xs font-semibold mb-0.5", styles.text)}>{title}</p>
            )}
            <p className="text-xs text-white/60">{message}</p>
            {action && (
              <button
                onClick={action.onClick}
                className={cn(
                  "text-xs font-medium underline underline-offset-2 mt-1",
                  styles.text
                )}
              >
                {action.label}
              </button>
            )}
          </div>
          {dismissable && (
            <button
              onClick={() => setDismissed(true)}
              aria-label="Dismiss banner"
              className="flex-shrink-0 text-white/30 hover:text-white/70 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
