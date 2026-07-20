"use client";

/**
 * DocumentProcessingPipeline
 *
 * Top-level composition component for the Enterprise Document Processing Pipeline.
 * Composes: PipelineSummary → DocumentMetricsTable → stage-by-stage PipelineStageRow list.
 */

import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  ChevronDown,
  ChevronUp,
  LayoutList,
  PanelTopClose,
  Info,
} from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { Section } from "@/shared/components/layout/Section";
import { usePipelineSimulator } from "../../hooks/usePipelineSimulator";
import { MOCK_SUMMARY_STATS } from "../../data/pipeline.mock";
import { PIPELINE_STAGES } from "../../types/pipeline.types";
import { PipelineSummary } from "./PipelineSummary";
import { DocumentMetricsTable } from "./DocumentMetricsTable";
import { PipelineStageRow } from "./PipelineStageRow";

export function DocumentProcessingPipeline() {
  const { documents, selectedDocument, selectedDocId, setSelectedDocId } =
    usePipelineSimulator();

  // Track which stage rows are expanded
  const [expandedStages, setExpandedStages] = useState<Set<string>>(
    () => new Set(["ocr_processing"]) // pre-expand OCR for demo
  );

  // Collapse/expand all toggle
  const [allExpanded, setAllExpanded] = useState(false);

  const toggleStage = useCallback((id: string) => {
    setExpandedStages((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleRetry = useCallback((stageId: string) => {
    // Placeholder — no backend
    console.info("[Pipeline] Retry requested for stage:", stageId);
  }, []);

  const handleViewLogs = useCallback((stageId: string) => {
    // Placeholder — would open a drawer
    console.info("[Pipeline] View logs requested for stage:", stageId);
  }, []);

  const handleExpandAll = useCallback(() => {
    if (allExpanded) {
      setExpandedStages(new Set());
    } else {
      setExpandedStages(new Set(PIPELINE_STAGES.map((s) => s.id)));
    }
    setAllExpanded((v) => !v);
  }, [allExpanded]);

  // Active stage index for the currently-selected document
  const activeStageIndex = selectedDocument?.activeStageIndex ?? 0;

  // Stage list header badge
  const runningStage = useMemo(
    () => selectedDocument?.stages.find((s) => s.status === "running"),
    [selectedDocument]
  );

  return (
    <div
      className="space-y-6"
      aria-label="Enterprise Document Processing Pipeline"
    >
      {/* ── Pipeline Summary Stats ─────────────────────────────────────── */}
      <Section title="Pipeline Overview" compact>
        <PipelineSummary stats={MOCK_SUMMARY_STATS} />
      </Section>

      {/* ── Document Metrics Table ─────────────────────────────────────── */}
      <Section title="Document Queue" compact>
        <DocumentMetricsTable
          documents={documents}
          selectedDocId={selectedDocId}
          onSelectDoc={setSelectedDocId}
        />
      </Section>

      {/* ── Stage-by-Stage Pipeline ────────────────────────────────────── */}
      <Section
        title="Processing Pipeline"
        compact
        actions={
          <div className="flex items-center gap-2">
            {/* Active stage indicator */}
            {runningStage && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden sm:flex items-center gap-1.5 text-[10px] text-[#faff69]/80"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#faff69] animate-pulse" aria-hidden="true" />
                Active: {PIPELINE_STAGES.find((s) => s.id === runningStage.id)?.name}
              </motion.div>
            )}
            {/* Expand all toggle */}
            <button
              onClick={handleExpandAll}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-[10px] font-semibold text-white/50 hover:text-white/80 hover:border-[#333] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#faff69]"
              aria-label={allExpanded ? "Collapse all stages" : "Expand all stages"}
            >
              {allExpanded ? (
                <PanelTopClose className="w-3 h-3" aria-hidden="true" />
              ) : (
                <LayoutList className="w-3 h-3" aria-hidden="true" />
              )}
              {allExpanded ? "Collapse All" : "Expand All"}
            </button>
          </div>
        }
      >
        {/* Document identity bar */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDocId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#faff69]/[0.03] border border-[#faff69]/10"
            aria-live="polite"
            aria-label={`Viewing pipeline for: ${selectedDocument?.fileName}`}
          >
            <Cpu className="w-3.5 h-3.5 text-[#faff69] shrink-0" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white/80 truncate">
                {selectedDocument?.fileName ?? "—"}
              </p>
              <p className="text-[10px] text-white/40">
                {selectedDocument?.fileType} · {selectedDocument?.fileSizeMB} MB ·
                Overall confidence:{" "}
                <span className="text-white/60 font-mono">
                  {selectedDocument?.overallConfidence
                    ? `${selectedDocument.overallConfidence}%`
                    : "—"}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[10px] text-white/30">
                Stage {Math.min(activeStageIndex + 1, PIPELINE_STAGES.length)}/{PIPELINE_STAGES.length}
              </span>
              <div
                className="ml-2 h-1 w-20 bg-[#222] rounded-full overflow-hidden"
                aria-hidden="true"
              >
                <motion.div
                  className="h-full bg-[#faff69] rounded-full"
                  animate={{ width: `${selectedDocument?.overallProgress ?? 0}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
              <span className="font-mono text-[10px] text-[#faff69] w-8 text-right">
                {selectedDocument?.overallProgress ?? 0}%
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Stage list */}
        <Panel
          className="bg-[#0d0d0d] border-[#1e1e1e] pt-4 pl-4 pr-2 pb-2"
          padded={false}
          role="list"
          aria-label={`Processing stages for ${selectedDocument?.fileName}`}
        >
          <div
            className="max-h-[640px] overflow-y-auto pr-2"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#2a2a2a transparent" }}
          >
            <AnimatePresence initial={false}>
              {selectedDocument &&
                PIPELINE_STAGES.map((def, idx) => {
                  const stageState = selectedDocument.stages[idx];
                  if (!stageState) return null;
                  return (
                    <PipelineStageRow
                      key={def.id}
                      definition={def}
                      state={stageState}
                      index={idx}
                      isLast={idx === PIPELINE_STAGES.length - 1}
                      isExpanded={expandedStages.has(def.id)}
                      onToggle={toggleStage}
                      onRetry={handleRetry}
                      onViewLogs={handleViewLogs}
                      isActive={idx === activeStageIndex && selectedDocument.status === "processing"}
                    />
                  );
                })}
            </AnimatePresence>
          </div>
        </Panel>

        {/* Legend */}
        <div
          className="flex flex-wrap gap-4 text-[10px] text-white/30 px-1"
          aria-label="Status legend"
        >
          {[
            { dot: "bg-[#faff69]", label: "Running" },
            { dot: "bg-green-500", label: "Completed" },
            { dot: "bg-red-500",   label: "Failed" },
            { dot: "bg-amber-400", label: "Warning" },
            { dot: "bg-blue-400",  label: "Processing" },
            { dot: "bg-[#333]",    label: "Pending / Queued" },
          ].map(({ dot, label }) => (
            <span key={label} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${dot}`} aria-hidden="true" />
              {label}
            </span>
          ))}
          <span className="flex items-center gap-1 ml-auto">
            <Info className="w-3 h-3" aria-hidden="true" />
            Click a stage row to expand details
          </span>
        </div>
      </Section>
    </div>
  );
}
