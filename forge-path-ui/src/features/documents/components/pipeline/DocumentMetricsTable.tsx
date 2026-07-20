"use client";

/**
 * DocumentMetricsTable
 *
 * Horizontal scrollable table of all pipeline documents showing
 * per-document processing stage, progress, confidence, and ETA.
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Image,
  FileSpreadsheet,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import {
  type PipelineDocument,
  type DocumentStatus,
  PIPELINE_STAGES,
} from "../../types/pipeline.types";
import { formatEta, formatDuration } from "../../data/pipeline.mock";

// ─── Helpers ───────────────────────────────────────────────────────────────

const FILE_ICON: Record<string, React.ReactNode> = {
  PDF:  <FileText className="w-3.5 h-3.5 text-[#faff69]" />,
  PNG:  <Image className="w-3.5 h-3.5 text-blue-400" />,
  JPG:  <Image className="w-3.5 h-3.5 text-blue-400" />,
  TIFF: <Image className="w-3.5 h-3.5 text-blue-400" />,
  CSV:  <FileSpreadsheet className="w-3.5 h-3.5 text-green-400" />,
  XLSX: <FileSpreadsheet className="w-3.5 h-3.5 text-green-400" />,
};

const DOC_STATUS_CONFIG: Record<DocumentStatus, { label: string; icon: React.ReactNode; className: string }> = {
  queued:     { label: "Queued",     icon: <Clock className="w-3 h-3" />,            className: "text-white/40 bg-white/5 border-white/10" },
  processing: { label: "Processing", icon: <Loader2 className="w-3 h-3 animate-spin" />, className: "text-[#faff69] bg-[#faff69]/10 border-[#faff69]/20" },
  completed:  { label: "Completed",  icon: <CheckCircle2 className="w-3 h-3" />,    className: "text-green-400 bg-green-500/10 border-green-500/20" },
  failed:     { label: "Failed",     icon: <XCircle className="w-3 h-3" />,         className: "text-red-400 bg-red-500/10 border-red-500/20" },
};

function DocStatusBadge({ status }: { status: DocumentStatus }) {
  const cfg = DOC_STATUS_CONFIG[status];
  return (
    <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border shrink-0", cfg.className)}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function MiniProgressBar({ value, status }: { value: number; status: DocumentStatus }) {
  const bar = status === "failed" ? "bg-red-500" : status === "completed" ? "bg-green-500" : "bg-[#faff69]";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-[#222] rounded-full overflow-hidden" aria-hidden="true">
        <motion.div
          className={cn("h-full rounded-full", bar)}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
      <span className="text-[10px] font-mono text-white/50 w-7 text-right">{value}%</span>
    </div>
  );
}

function ConfidenceDisplay({ value }: { value: number }) {
  if (value === 0) return <span className="text-white/25 text-[10px]">—</span>;
  const color = value >= 90 ? "text-green-400" : value >= 75 ? "text-[#faff69]" : "text-amber-400";
  return <span className={cn("text-[10px] font-bold font-mono", color)}>{value}%</span>;
}

// ─── Component ─────────────────────────────────────────────────────────────

interface DocumentMetricsTableProps {
  documents: PipelineDocument[];
  selectedDocId: string;
  onSelectDoc: (id: string) => void;
}

export function DocumentMetricsTable({
  documents,
  selectedDocId,
  onSelectDoc,
}: DocumentMetricsTableProps) {
  return (
    <div
      className="overflow-x-auto rounded-xl border border-[#222] bg-[#111]"
      role="region"
      aria-label="Document processing metrics table"
    >
      <table
        className="w-full text-left min-w-[700px]"
        aria-label="Documents in pipeline"
      >
        <thead>
          <tr className="border-b border-[#1e1e1e]">
            {["Document", "Status", "Current Stage", "Overall Progress", "Confidence", "ETA"].map((h) => (
              <th
                key={h}
                scope="col"
                className="px-4 py-2.5 text-[9px] font-bold text-white/30 uppercase tracking-widest whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {documents.map((doc, idx) => {
              const isSelected = doc.id === selectedDocId;
              const currentStage = PIPELINE_STAGES[doc.activeStageIndex];
              return (
                <motion.tr
                  key={doc.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => onSelectDoc(doc.id)}
                  className={cn(
                    "border-b border-[#1a1a1a] cursor-pointer transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-1 focus-visible:ring-[#faff69]",
                    isSelected
                      ? "bg-[#faff69]/[0.03] border-l-2 border-l-[#faff69]"
                      : "hover:bg-white/[0.02]",
                    idx === documents.length - 1 && "border-b-0"
                  )}
                  tabIndex={0}
                  role="row"
                  aria-selected={isSelected}
                  aria-label={`${doc.fileName} — ${doc.status}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectDoc(doc.id);
                    }
                  }}
                >
                  {/* Document name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span aria-hidden="true">{FILE_ICON[doc.fileType] ?? <FileText className="w-3.5 h-3.5" />}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white/80 truncate max-w-[160px]" title={doc.fileName}>
                          {doc.fileName}
                        </p>
                        <p className="text-[9px] text-white/30">{doc.fileSizeMB} MB · {doc.fileType}</p>
                      </div>
                      {doc.stages.some((s) => s.warningCount > 0) && (
                        <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" aria-label="Has warnings" />
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <DocStatusBadge status={doc.status} />
                  </td>

                  {/* Current stage */}
                  <td className="px-4 py-3">
                    <span className="text-[10px] text-white/60 font-medium whitespace-nowrap">
                      {doc.status === "completed"
                        ? "All stages complete"
                        : doc.status === "failed"
                        ? "Pipeline halted"
                        : doc.status === "queued"
                        ? "Waiting in queue"
                        : currentStage?.name ?? "—"}
                    </span>
                  </td>

                  {/* Overall progress */}
                  <td className="px-4 py-3 min-w-[140px]">
                    <MiniProgressBar value={doc.overallProgress} status={doc.status} />
                  </td>

                  {/* Confidence */}
                  <td className="px-4 py-3 text-center">
                    <ConfidenceDisplay value={doc.overallConfidence} />
                  </td>

                  {/* ETA */}
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-mono text-white/40">
                      {doc.status === "completed" || doc.status === "failed" || doc.status === "queued"
                        ? "—"
                        : formatEta(doc.estimatedRemainingMs)}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
