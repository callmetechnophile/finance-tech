"use client";

/**
 * UploadQueueItem
 *
 * Single row in the upload queue.
 * Shows: file icon, name, size, status badge, animated progress bar, actions.
 */

import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Image,
  FileSpreadsheet,
  Sheet,
  X,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import {
  type UploadFile,
  formatBytes,
  MIME_LABELS,
  getFileExtension,
} from "../types/upload.types";

// ── File type icon map ────────────────────────────────────────────────────
function FileIcon({ type, name }: { type: string; name: string }) {
  const ext = getFileExtension(name);
  const isImage =
    type === "image/png" || type === "image/jpeg" || type === "image/tiff";
  const isSpreadsheet =
    type === "text/csv" ||
    type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  const colorClass = isImage
    ? "text-blue-400 bg-blue-500/10 border-blue-500/20"
    : isSpreadsheet
    ? "text-green-400 bg-green-500/10 border-green-500/20"
    : "text-[#faff69] bg-[#faff69]/10 border-[#faff69]/20";

  const Icon = isImage ? Image : isSpreadsheet ? FileSpreadsheet : FileText;

  return (
    <div
      className={cn(
        "w-9 h-9 rounded-lg border flex flex-col items-center justify-center gap-0.5 shrink-0",
        colorClass
      )}
      aria-hidden="true"
    >
      <Icon className="w-4 h-4" />
      <span className="text-[7px] font-black tracking-wider leading-none">
        {MIME_LABELS[type] ?? ext}
      </span>
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────
function StatusBadge({ status, progress }: { status: UploadFile["status"]; progress: number }) {
  const map = {
    queued: {
      label: "Queued",
      className: "text-white/40 bg-white/5 border-white/10",
      icon: <Clock className="w-2.5 h-2.5" />,
    },
    uploading: {
      label: `${Math.round(progress)}%`,
      className: "text-[#faff69] bg-[#faff69]/10 border-[#faff69]/20",
      icon: <Loader2 className="w-2.5 h-2.5 animate-spin" />,
    },
    processing: {
      label: "Processing",
      className: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      icon: <Loader2 className="w-2.5 h-2.5 animate-spin" />,
    },
    complete: {
      label: "Complete",
      className: "text-green-400 bg-green-500/10 border-green-500/20",
      icon: <CheckCircle2 className="w-2.5 h-2.5" />,
    },
    error: {
      label: "Failed",
      className: "text-red-400 bg-red-500/10 border-red-500/20",
      icon: <AlertCircle className="w-2.5 h-2.5" />,
    },
  } satisfies Record<UploadFile["status"], { label: string; className: string; icon: React.ReactNode }>;

  const { label, className, icon } = map[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border shrink-0",
        className
      )}
      aria-label={`Status: ${label}`}
    >
      {icon}
      {label}
    </span>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────
function ProgressBar({
  progress,
  status,
}: {
  progress: number;
  status: UploadFile["status"];
}) {
  const barClass =
    status === "error"
      ? "bg-red-500"
      : status === "complete"
      ? "bg-green-500"
      : status === "processing"
      ? "bg-blue-400"
      : "bg-[#faff69]";

  return (
    <div
      className="w-full h-1 bg-[#222] rounded-full overflow-hidden"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Upload progress: ${Math.round(progress)}%`}
    >
      <motion.div
        className={cn("h-full rounded-full", barClass)}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
interface UploadQueueItemProps {
  file: UploadFile;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
}

export const UploadQueueItem = memo(function UploadQueueItem({
  file,
  onRemove,
  onRetry,
}: UploadQueueItemProps) {
  const inProgress =
    file.status === "uploading" || file.status === "processing";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 16, scale: 0.97 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg border transition-colors duration-150",
        file.status === "error"
          ? "bg-red-500/[0.03] border-red-500/15 hover:border-red-500/25"
          : file.status === "complete"
          ? "bg-green-500/[0.03] border-green-500/15"
          : "bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#333]"
      )}
      role="listitem"
      aria-label={`${file.name} — ${file.status}`}
    >
      {/* Icon */}
      <FileIcon type={file.type} name={file.name} />

      {/* Main content */}
      <div className="flex-1 min-w-0 space-y-1.5">
        {/* Row 1: name + badge + actions */}
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-white/80 truncate flex-1" title={file.name}>
            {file.name}
          </p>
          <StatusBadge status={file.status} progress={file.progress} />
          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {file.status === "error" && (
              <button
                onClick={() => onRetry(file.id)}
                className="w-6 h-6 flex items-center justify-center rounded text-white/40 hover:text-[#faff69] hover:bg-[#faff69]/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#faff69]"
                aria-label={`Retry upload of ${file.name}`}
              >
                <RefreshCw className="w-3 h-3" aria-hidden="true" />
              </button>
            )}
            <button
              onClick={() => onRemove(file.id)}
              disabled={inProgress}
              className="w-6 h-6 flex items-center justify-center rounded text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400 disabled:opacity-30 disabled:pointer-events-none"
              aria-label={`Remove ${file.name} from queue`}
            >
              <X className="w-3 h-3" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Row 2: progress bar */}
        <ProgressBar progress={file.progress} status={file.status} />

        {/* Row 3: meta */}
        <div className="flex items-center gap-3 text-[10px] text-white/35">
          <span>{formatBytes(file.size)}</span>
          {file.error && (
            <span className="text-red-400 truncate">{file.error}</span>
          )}
          {file.status === "complete" && file.completedAt && (
            <span className="text-green-400">
              Ingested at{" "}
              {new Date(file.completedAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
});
