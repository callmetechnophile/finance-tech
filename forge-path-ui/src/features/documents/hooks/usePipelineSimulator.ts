"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  type PipelineDocument,
  type PipelineStageState,
  type PipelineSummaryStats,
  PIPELINE_STAGES,
} from "../types/pipeline.types";
import { MOCK_PIPELINE_DOCUMENTS } from "../data/pipeline.mock";

const TICK_MS = 150;
const ADVANCE_PER_TICK = 1.2;

export function usePipelineSimulator() {
  const [documents, setDocuments] = useState<PipelineDocument[]>(MOCK_PIPELINE_DOCUMENTS);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(MOCK_PIPELINE_DOCUMENTS[0]?.id || null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Advance a single processing document's active stage
  const tick = useCallback(() => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.status !== "processing") return doc;

        const activeIdx = doc.activeStageIndex;
        if (activeIdx >= PIPELINE_STAGES.length) return doc;

        const stages = [...doc.stages];
        const active = { ...stages[activeIdx] };

        if (active.status !== "running") return doc;

        const nextProgress = Math.min(100, active.progress + ADVANCE_PER_TICK);

        if (nextProgress >= 100) {
          // Complete current stage
          const completedStage: PipelineStageState = {
            ...active,
            progress: 100,
            status: "completed",
            completedAt: new Date().toISOString(),
            logs: [
              ...active.logs,
              {
                timestamp: new Date().toISOString(),
                level: "info",
                message: `Stage '${active.id}' completed successfully.`,
              },
            ],
          };
          stages[activeIdx] = completedStage;

          // Find next non-skipped stage
          const nextIdx = activeIdx + 1;

          if (nextIdx >= PIPELINE_STAGES.length) {
            // All stages done
            return {
              ...doc,
              stages,
              activeStageIndex: nextIdx,
              overallProgress: 100,
              status: "completed" as const,
              completedAt: new Date().toISOString(),
            };
          }

          // Activate next stage
          const nextDef = PIPELINE_STAGES[nextIdx];

          // Manual review & approval auto-skipped in simulator
          if (nextDef.id === "manual_review" || nextDef.id === "approval") {
            const skipped: PipelineStageState = {
              ...stages[nextIdx],
              status: "skipped",
              progress: 100,
              completedAt: new Date().toISOString(),
              logs: [{ timestamp: new Date().toISOString(), level: "info", message: "Stage auto-skipped: confidence threshold met (>= 75%)." }],
            };
            stages[nextIdx] = skipped;

            const afterIdx = nextIdx + 1;
            if (afterIdx < PIPELINE_STAGES.length) {
              stages[afterIdx] = {
                ...stages[afterIdx],
                status: "running",
                startedAt: new Date().toISOString(),
                logs: [{ timestamp: new Date().toISOString(), level: "info", message: `Stage '${stages[afterIdx].id}' started.` }],
              };
              return rebuildDocStats({ ...doc, stages, activeStageIndex: afterIdx });
            }
          }

          stages[nextIdx] = {
            ...stages[nextIdx],
            status: "running",
            startedAt: new Date().toISOString(),
            logs: [{ timestamp: new Date().toISOString(), level: "info", message: `Stage '${stages[nextIdx].id}' started.` }],
          };

          return rebuildDocStats({ ...doc, stages, activeStageIndex: nextIdx });
        }

        // Just advance progress
        stages[activeIdx] = { ...active, progress: nextProgress, elapsedMs: active.elapsedMs + TICK_MS };
        return rebuildDocStats({ ...doc, stages });
      })
    );
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(tick, TICK_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [tick]);

  const selectedDocument = useMemo(() => {
    if (!selectedDocId) return documents[0] || null;
    return documents.find((d) => d.id === selectedDocId) || documents[0] || null;
  }, [selectedDocId, documents]);

  const summaryStats: PipelineSummaryStats = useMemo(() => {
    const totalDocuments = documents.length;
    const processing = documents.filter((d) => d.status === "processing").length;
    const completed = documents.filter((d) => d.status === "completed").length;
    const failed = documents.filter((d) => d.status === "failed").length;
    const queueLength = documents.filter((d) => d.status === "queued" || d.status === "processing").length;

    const completedDocs = documents.filter((d) => d.status === "completed");
    const avgConfidence = completedDocs.length > 0
      ? Math.round(completedDocs.reduce((acc, d) => acc + d.overallConfidence, 0) / completedDocs.length)
      : 96;

    return {
      totalDocuments,
      processing,
      completed,
      failed,
      avgProcessingMs: 4200,
      avgConfidence,
      queueLength,
    };
  }, [documents]);

  return {
    documents,
    selectedDocument,
    selectedDocId,
    setSelectedDocId,
    summaryStats,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function rebuildDocStats(doc: PipelineDocument): PipelineDocument {
  const total = PIPELINE_STAGES.length;
  const completedCount = doc.stages.filter(
    (s) => s.status === "completed" || s.status === "skipped"
  ).length;
  const running = doc.stages.find((s) => s.status === "running");
  const runningProgress = running ? running.progress / 100 : 0;

  const overallProgress = Math.min(
    100,
    Math.round(((completedCount + runningProgress) / total) * 100)
  );

  const conStages = doc.stages.filter(
    (s) => s.status === "completed" && s.confidence !== undefined
  );
  const overallConfidence =
    conStages.length > 0
      ? Math.round(conStages.reduce((a, s) => a + (s.confidence ?? 0), 0) / conStages.length)
      : doc.overallConfidence;

  return { ...doc, overallProgress, overallConfidence };
}
