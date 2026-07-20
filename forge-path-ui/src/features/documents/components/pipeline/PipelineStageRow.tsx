"use client";

/**
 * PipelineStageRow
 *
 * Expandable row for a single pipeline stage.
 * Shows: icon, name, status badge, progress bar, metrics, collapsible log panel.
 */

import React, { memo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Shield,
  FileCheck2,
  Tag,
  Wand2,
  ScanText,
  Layers,
  Database,
  ShieldCheck,
  Copy,
  Bot,
  UserCheck,
  ThumbsUp,
  HardDrive,
  RefreshCw,
  PackageCheck,
  ChevronDown,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Clock,
  Loader2,
  Minus,
  SkipForward,
  RotateCcw,
  FileText,
  Zap,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import {
  type PipelineStageState,
  type StageDefinition,
  type StageStatus,
} from "../../types/pipeline.types";
import { formatDuration } from "../../data/pipeline.mock";

// ─── Stage icon map ────────────────────────────────────────────────────────

const STAGE_ICONS: Record<string, React.ReactNode> = {
  upload:            <Upload className="w-4 h-4" />,
  virus_scan:        <Shield className="w-4 h-4" />,
  file_validation:   <FileCheck2 className="w-4 h-4" />,
  doc_classification:<Tag className="w-4 h-4" />,
  image_enhancement: <Wand2 className="w-4 h-4" />,
  ocr_processing:    <ScanText className="w-4 h-4" />,
  field_extraction:  <Layers className="w-4 h-4" />,
  schema_mapping:    <Database className="w-4 h-4" />,
  business_validation:<ShieldCheck className="w-4 h-4" />,
  duplicate_detection:<Copy className="w-4 h-4" />,
  ai_verification:   <Bot className="w-4 h-4" />,
  manual_review:     <UserCheck className="w-4 h-4" />,
  approval:          <ThumbsUp className="w-4 h-4" />,
  db_import:         <HardDrive className="w-4 h-4" />,
  erp_sync:          <RefreshCw className="w-4 h-4" />,
  completed:         <PackageCheck className="w-4 h-4" />,
};

// ─── Status helpers ────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<StageStatus, {
  label: string;
  icon: React.ReactNode;
  badgeClass: string;
  iconContainerClass: string;
}> = {
  pending:   { label: "Pending",   icon: <Minus className="w-3 h-3" />,       badgeClass: "text-white/30 bg-white/5 border-white/10",       iconContainerClass: "bg-[#222] border-[#333] text-white/25" },
  queued:    { label: "Queued",    icon: <Clock className="w-3 h-3" />,        badgeClass: "text-white/50 bg-white/5 border-white/15",       iconContainerClass: "bg-[#222] border-[#333] text-white/40" },
  running:   { label: "Running",   icon: <Loader2 className="w-3 h-3 animate-spin" />, badgeClass: "text-[#faff69] bg-[#faff69]/10 border-[#faff69]/25", iconContainerClass: "bg-[#faff69]/10 border-[#faff69]/30 text-[#faff69]" },
  completed: { label: "Completed", icon: <CheckCircle2 className="w-3 h-3" />, badgeClass: "text-green-400 bg-green-500/10 border-green-500/20", iconContainerClass: "bg-green-500/10 border-green-500/25 text-green-400" },
  warning:   { label: "Warning",   icon: <AlertTriangle className="w-3 h-3" />, badgeClass: "text-amber-400 bg-amber-500/10 border-amber-500/20", iconContainerClass: "bg-amber-500/10 border-amber-500/25 text-amber-400" },
  failed:    { label: "Failed",    icon: <XCircle className="w-3 h-3" />,      badgeClass: "text-red-400 bg-red-500/10 border-red-500/20",   iconContainerClass: "bg-red-500/10 border-red-500/25 text-red-400" },
  skipped:   { label: "Skipped",   icon: <SkipForward className="w-3 h-3" />, badgeClass: "text-white/30 bg-white/5 border-white/10",       iconContainerClass: "bg-[#222] border-[#333] text-white/25" },
};

const LOG_LEVEL_CLASS: Record<string, string> = {
  info:  "text-white/50",
  debug: "text-blue-400/70",
  warn:  "text-amber-400/80",
  error: "text-red-400",
};

// ─── Sub-components ────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: StageStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border shrink-0",
        cfg.badgeClass
      )}
      aria-label={`Status: ${cfg.label}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function StageProgressBar({ progress, status }: { progress: number; status: StageStatus }) {
  const trackClass = "w-full h-1 bg-[#222] rounded-full overflow-hidden";
  const barClass =
    status === "failed"   ? "bg-red-500" :
    status === "warning"  ? "bg-amber-400" :
    status === "completed"? "bg-green-500" :
    status === "running"  ? "bg-[#faff69]" : "bg-[#333]";

  return (
    <div
      className={trackClass}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Stage progress: ${Math.round(progress)}%`}
    >
      <motion.div
        className={cn("h-full rounded-full", barClass)}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />
    </div>
  );
}

function ConfidencePill({ value }: { value: number }) {
  const color = value >= 90 ? "text-green-400" : value >= 75 ? "text-[#faff69]" : "text-amber-400";
  return (
    <span className={cn("flex items-center gap-0.5 text-[10px] font-bold font-mono", color)}>
      <Zap className="w-2.5 h-2.5" aria-hidden="true" />
      {value}%
    </span>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

interface PipelineStageRowProps {
  definition: StageDefinition;
  state: PipelineStageState;
  index: number;
  isLast: boolean;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  onRetry: (id: string) => void;
  onViewLogs: (id: string) => void;
  isActive: boolean;
}

export const PipelineStageRow = memo(function PipelineStageRow({
  definition,
  state,
  index,
  isLast,
  isExpanded,
  onToggle,
  onRetry,
  onViewLogs,
  isActive,
}: PipelineStageRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const cfg = STATUS_CONFIG[state.status];
  const isDimmed = state.status === "pending";
  const isInteractive = state.status !== "pending";

  // Auto-scroll active stage into view (disabled on mount to preserve page scroll)
  useEffect(() => {
    // Intentionally no-op on initial mount to keep header and upload center visible at top
  }, [isActive]);

  return (
    <div ref={rowRef}>
      {/* Connector line */}
      <div className="flex gap-3">
        {/* Left column: icon + vertical line */}
        <div className="flex flex-col items-center shrink-0">
          <motion.div
            animate={{
              boxShadow: isActive
                ? "0 0 0 3px rgba(250,255,105,0.15), 0 0 12px rgba(250,255,105,0.12)"
                : "none",
            }}
            transition={{ duration: 0.4 }}
            className={cn(
              "w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 transition-colors duration-300",
              cfg.iconContainerClass
            )}
            aria-hidden="true"
          >
            {STAGE_ICONS[definition.id] ?? <FileText className="w-4 h-4" />}
          </motion.div>
          {!isLast && (
            <div
              className={cn(
                "w-px flex-1 mt-1 min-h-[16px] transition-colors duration-500",
                state.status === "completed" ? "bg-green-500/30" : "bg-[#2a2a2a]"
              )}
              aria-hidden="true"
            />
          )}
        </div>

        {/* Right column: content */}
        <div
          className={cn(
            "flex-1 min-w-0 pb-4 transition-opacity duration-300",
            isDimmed && "opacity-35"
          )}
        >
          {/* Header row */}
          <button
            onClick={() => isInteractive && onToggle(definition.id)}
            disabled={!isInteractive}
            className={cn(
              "w-full flex items-start gap-3 text-left rounded-lg px-3 py-2.5",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#faff69]",
              isInteractive
                ? "hover:bg-white/[0.03] cursor-pointer"
                : "cursor-default",
              isExpanded && "bg-white/[0.025]"
            )}
            aria-expanded={isExpanded}
            aria-label={`${definition.name} — ${cfg.label}. ${isExpanded ? "Collapse" : "Expand"} stage details.`}
          >
            {/* Stage number */}
            <span className="text-[10px] font-mono text-white/20 mt-0.5 w-4 shrink-0">
              {String(index + 1).padStart(2, "0")}
            </span>

            {/* Name + description */}
            <div className="flex-1 min-w-0 space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-white/85">{definition.name}</span>
                <StatusBadge status={state.status} />
                {state.warningCount > 0 && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-400">
                    <AlertTriangle className="w-2.5 h-2.5" aria-hidden="true" />
                    {state.warningCount} warning{state.warningCount !== 1 ? "s" : ""}
                  </span>
                )}
                {state.retryCount > 0 && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] text-white/35">
                    <RotateCcw className="w-2.5 h-2.5" aria-hidden="true" />
                    {state.retryCount} retr{state.retryCount !== 1 ? "ies" : "y"}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-white/35 leading-snug pr-2">
                {definition.description}
              </p>
            </div>

            {/* Metrics cluster */}
            <div className="flex items-center gap-3 shrink-0 text-[10px] text-white/40">
              {state.status === "running" && (
                <span className="font-mono text-[#faff69]">{Math.round(state.progress)}%</span>
              )}
              {state.elapsedMs > 0 && (
                <span className="font-mono hidden sm:block">{formatDuration(state.elapsedMs)}</span>
              )}
              {state.confidence !== undefined && state.status === "completed" && (
                <ConfidencePill value={state.confidence} />
              )}
              {isInteractive && (
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 text-white/25 transition-transform duration-200",
                    isExpanded && "rotate-180"
                  )}
                  aria-hidden="true"
                />
              )}
            </div>
          </button>

          {/* Progress bar — only for running/failed */}
          {(state.status === "running" || state.status === "failed") && (
            <div className="px-3 pb-1">
              <StageProgressBar progress={state.progress} status={state.status} />
            </div>
          )}

          {/* Error message */}
          {state.errorMessage && (
            <div className="mx-3 mb-2 flex items-start gap-2 p-2 rounded bg-red-500/[0.04] border border-red-500/15">
              <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-[10px] text-red-400/90 leading-snug">{state.errorMessage}</p>
            </div>
          )}

          {/* Expandable detail panel */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                key="detail"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="mx-3 mb-2 space-y-3">
                  {/* Metrics grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: "Progress",    value: `${Math.round(state.progress)}%` },
                      { label: "Duration",    value: formatDuration(state.elapsedMs) },
                      { label: "Confidence",  value: state.confidence !== undefined ? `${state.confidence}%` : "N/A" },
                      { label: "Retries",     value: String(state.retryCount) },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex flex-col gap-0.5 p-2 rounded bg-[#1a1a1a] border border-[#252525]">
                        <span className="text-[9px] text-white/30 uppercase tracking-wider">{label}</span>
                        <span className="text-xs font-semibold text-white/75 font-mono">{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Timestamps */}
                  {(state.startedAt || state.completedAt) && (
                    <div className="flex flex-wrap gap-3 text-[10px] text-white/30">
                      {state.startedAt && (
                        <span>
                          Started:{" "}
                          <span className="text-white/50 font-mono">
                            {new Date(state.startedAt).toLocaleTimeString()}
                          </span>
                        </span>
                      )}
                      {state.completedAt && (
                        <span>
                          Completed:{" "}
                          <span className="text-white/50 font-mono">
                            {new Date(state.completedAt).toLocaleTimeString()}
                          </span>
                        </span>
                      )}
                    </div>
                  )}

                  {/* Processing logs */}
                  <div className="rounded-lg bg-[#0d0d0d] border border-[#222] overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-[#1a1a1a]">
                      <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
                        Processing Logs
                      </span>
                      <button
                        onClick={() => onViewLogs(definition.id)}
                        className="text-[9px] text-[#faff69]/70 hover:text-[#faff69] transition-colors focus-visible:outline-none focus-visible:underline"
                        aria-label={`View full logs for ${definition.name}`}
                      >
                        View Full Logs →
                      </button>
                    </div>
                    <div className="p-2 space-y-1 max-h-[120px] overflow-y-auto font-mono">
                      {state.logs.length === 0 ? (
                        <p className="text-[10px] text-white/20 py-1 text-center">No log entries.</p>
                      ) : (
                        state.logs.map((log, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-[9px] text-white/20 shrink-0">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                            <span
                              className={cn(
                                "text-[9px] uppercase w-8 shrink-0 font-bold",
                                LOG_LEVEL_CLASS[log.level] ?? "text-white/40"
                              )}
                            >
                              {log.level}
                            </span>
                            <span className="text-[10px] text-white/50 leading-snug">{log.message}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {state.status === "failed" && (
                      <button
                        onClick={() => onRetry(definition.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#faff69]/10 border border-[#faff69]/20 text-[10px] font-bold text-[#faff69] hover:bg-[#faff69]/15 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#faff69]"
                        aria-label={`Retry ${definition.name} stage`}
                      >
                        <RotateCcw className="w-3 h-3" aria-hidden="true" />
                        Retry Stage
                      </button>
                    )}
                    <button
                      onClick={() => onViewLogs(definition.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1a1a1a] border border-[#2a2a2a] text-[10px] font-semibold text-white/50 hover:text-white/80 hover:border-[#333] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#faff69]"
                      aria-label={`View full logs for ${definition.name}`}
                    >
                      <FileText className="w-3 h-3" aria-hidden="true" />
                      View Logs
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
});
