"use client";

/**
 * usePipelineSimulator
 *
 * Drives mock progress animation across the selected document's pipeline stages.
 * No real network requests. Advances the active stage progress every tick,
 * then transitions to the next stage automatically.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { type PipelineDocument, type PipelineStageState, PIPELINE_STAGES } from "../types/pipeline.types";

const TICK_MS = 120;
const ADVANCE_PER_TICK = 0.9; // progress points per tick

export function usePipelineSimulator() {
  const [documents, setDocuments] = useState<PipelineDocument[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
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

          // Manual review & approval are instant-skipped in the simulator (no human present)
          if (nextDef.id === "manual_review" || nextDef.id === "approval") {
            const skipped: PipelineStageState = {
              ...stages[nextIdx],
              status: "skipped",
              progress: 100,
              completedAt: new Date().toISOString(),
              logs: [{ timestamp: new Date().toISOString(), level: "info", message: "Stage auto-skipped: confidence above manual review threshold (>= 75%)." }],
            };
            stages[nextIdx] = skipped;

            // Try activating the stage after that
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

  const selectedDocument = selectedDocId
    ? (documents.find((d) => d.id === selectedDocId) ?? documents[0])
    : documents[0];

  return {
    documents,
    selectedDocument,
    selectedDocId,
    setSelectedDocId,
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
    (s) => (s.status === "completed") && s.confidence !== undefined
  );
  const overallConfidence =
    conStages.length > 0
      ? Math.round(conStages.reduce((a, s) => a + (s.confidence ?? 0), 0) / conStages.length)
      : doc.overallConfidence;

  return { ...doc, overallProgress, overallConfidence };
}
