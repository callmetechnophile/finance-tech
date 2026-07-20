"use client";

/**
 * UploadCenter
 *
 * Top-level composition component for the document upload flow.
 * Composes: DropZone → Upload Queue list → Bulk action toolbar.
 */

import React, { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  Trash2,
  CheckCheck,
  Play,
  FileStack,
  CircleDot,
} from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { cn } from "@/shared/utils/cn";
import { DropZone } from "./DropZone";
import { UploadQueueItem } from "./UploadQueueItem";
import { useUploadQueue } from "../hooks/useUploadQueue";
import { type UploadFile } from "../types/upload.types";

// ── Stats row helpers ──────────────────────────────────────────────────────
function StatChip({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  if (value === 0) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[10px] font-semibold",
        accent ?? "text-white/40"
      )}
      aria-label={`${value} ${label}`}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          accent === "text-[#faff69]"
            ? "bg-[#faff69]"
            : accent === "text-green-400"
            ? "bg-green-400"
            : accent === "text-red-400"
            ? "bg-red-400"
            : accent === "text-blue-400"
            ? "bg-blue-400"
            : "bg-white/30"
        )}
        aria-hidden="true"
      />
      {value} {label}
    </span>
  );
}

// ── Bulk progress bar ─────────────────────────────────────────────────────
function BulkProgressBar({ files }: { files: UploadFile[] }) {
  const active = files.filter(
    (f) => f.status === "uploading" || f.status === "processing"
  );
  if (active.length === 0) return null;

  const avgProgress =
    active.reduce((sum, f) => sum + f.progress, 0) / active.length;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-1.5"
      role="status"
      aria-label={`Bulk upload in progress: ${Math.round(avgProgress)}% average`}
    >
      <div className="flex items-center justify-between text-[10px] text-white/40">
        <span className="flex items-center gap-1.5">
          <CircleDot className="w-2.5 h-2.5 text-[#faff69] animate-pulse" aria-hidden="true" />
          {active.length} file{active.length !== 1 ? "s" : ""} uploading
        </span>
        <span className="font-mono text-[#faff69]">{Math.round(avgProgress)}%</span>
      </div>
      <div
        className="w-full h-1 bg-[#222] rounded-full overflow-hidden"
        aria-hidden="true"
      >
        <motion.div
          className="h-full bg-[#faff69] rounded-full"
          animate={{ width: `${avgProgress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

// ── Main UploadCenter ─────────────────────────────────────────────────────
export function UploadCenter() {
  const {
    files,
    addFiles,
    removeFile,
    clearCompleted,
    clearAll,
    retryFile,
    startUpload,
    isUploading,
  } = useUploadQueue();

  const handleFiles = useCallback(
    (incoming: File[]) => {
      const { rejected } = addFiles(incoming);
      // Log rejections to console (no toast dependency)
      if (rejected.length > 0) {
        console.warn("[UploadCenter] Rejected files:", rejected);
      }
    },
    [addFiles]
  );

  // Queue stats
  const queued = files.filter((f) => f.status === "queued").length;
  const uploading = files.filter(
    (f) => f.status === "uploading" || f.status === "processing"
  ).length;
  const complete = files.filter((f) => f.status === "complete").length;
  const failed = files.filter((f) => f.status === "error").length;
  const total = files.length;
  const hasQueued = queued > 0;
  const hasFiles = total > 0;
  const hasCompleted = complete > 0;

  return (
    <div className="space-y-5" aria-label="Upload Center">
      {/* Drop Zone */}
      <DropZone onFiles={handleFiles} disabled={isUploading} />

      {/* Queue panel — visible only when files exist */}
      <AnimatePresence>
        {hasFiles && (
          <motion.div
            key="queue-panel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <Panel
              className="bg-[#111] border-[#222]"
              padded={true}
              role="region"
              aria-label="Upload queue"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileStack className="w-4 h-4 text-white/40" aria-hidden="true" />
                  <h2 className="text-xs font-bold text-white/80 uppercase tracking-wider">
                    Upload Queue
                  </h2>
                  <span className="px-1.5 py-0.5 rounded bg-[#222] border border-[#333] text-[10px] font-bold text-white/50">
                    {total}
                  </span>
                </div>

                {/* Stats chips */}
                <div className="flex items-center gap-3 flex-wrap justify-end">
                  <StatChip label="queued" value={queued} />
                  <StatChip
                    label="uploading"
                    value={uploading}
                    accent="text-[#faff69]"
                  />
                  <StatChip
                    label="processing"
                    value={0}
                    accent="text-blue-400"
                  />
                  <StatChip
                    label="complete"
                    value={complete}
                    accent="text-green-400"
                  />
                  <StatChip
                    label="failed"
                    value={failed}
                    accent="text-red-400"
                  />
                </div>
              </div>

              {/* Bulk progress bar */}
              <AnimatePresence>
                {uploading > 0 && (
                  <div className="mb-4">
                    <BulkProgressBar files={files} />
                  </div>
                )}
              </AnimatePresence>

              {/* File list */}
              <div
                className="space-y-2 max-h-[420px] overflow-y-auto pr-1 -mr-1"
                role="list"
                aria-label={`${total} file${total !== 1 ? "s" : ""} in queue`}
                style={{ scrollbarWidth: "thin", scrollbarColor: "#333 transparent" }}
              >
                <AnimatePresence initial={false}>
                  {files.map((file) => (
                    <UploadQueueItem
                      key={file.id}
                      file={file}
                      onRemove={removeFile}
                      onRetry={retryFile}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Action toolbar */}
              <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-[#222]">
                {/* Left: destructive actions */}
                <div className="flex items-center gap-2">
                  {hasCompleted && (
                    <button
                      onClick={clearCompleted}
                      disabled={isUploading}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white/50 bg-[#1a1a1a] border border-[#2a2a2a] hover:text-white hover:border-[#333] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#faff69] disabled:opacity-40 disabled:pointer-events-none"
                      aria-label="Clear completed files from queue"
                    >
                      <CheckCheck className="w-3 h-3" aria-hidden="true" />
                      Clear Completed
                    </button>
                  )}
                  <button
                    onClick={clearAll}
                    disabled={isUploading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white/40 hover:text-red-400 hover:bg-red-500/5 hover:border-red-500/20 border border-transparent transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400 disabled:opacity-40 disabled:pointer-events-none"
                    aria-label="Remove all files from queue"
                  >
                    <Trash2 className="w-3 h-3" aria-hidden="true" />
                    Clear All
                  </button>
                </div>

                {/* Right: primary action */}
                <motion.button
                  onClick={startUpload}
                  disabled={!hasQueued || isUploading}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#faff69] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]",
                    hasQueued && !isUploading
                      ? "bg-[#faff69] text-black hover:bg-[#f0f060] shadow-sm shadow-[#faff69]/20"
                      : "bg-[#222] text-white/30 border border-[#333] cursor-not-allowed"
                  )}
                  aria-label={
                    isUploading
                      ? "Upload in progress"
                      : `Upload ${queued} queued file${queued !== 1 ? "s" : ""}`
                  }
                  aria-disabled={!hasQueued || isUploading}
                >
                  {isUploading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        aria-hidden="true"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                      </motion.div>
                      Uploading…
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" aria-hidden="true" />
                      Upload {queued > 0 ? queued : ""} File{queued !== 1 ? "s" : ""}
                    </>
                  )}
                </motion.button>
              </div>
            </Panel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
