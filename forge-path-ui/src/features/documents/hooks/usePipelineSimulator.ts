"use client";

import { useEffect, useCallback, useRef, useMemo } from "react";
import {
  type PipelineDocument,
  type PipelineSummaryStats,
  PIPELINE_STAGES,
} from "../types/pipeline.types";
import { useDocumentPipelineStore } from "@/shared/stores/document-pipeline.store";

const TICK_MS = 250;
const ADVANCE_PER_TICK = 15;

export function usePipelineSimulator() {
  const { documents, selectedDocId, setSelectedDocId, updateDocumentStage } =
    useDocumentPipelineStore();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Drive active stage progress for any processing documents
  const tick = useCallback(() => {
    documents.forEach((doc) => {
      if (doc.status !== "processing") return;

      const activeIdx = doc.activeStageIndex;
      if (activeIdx >= PIPELINE_STAGES.length) return;

      const activeStage = doc.stages[activeIdx];
      if (!activeStage || activeStage.status !== "running") return;

      const nextProgress = Math.min(100, activeStage.progress + ADVANCE_PER_TICK);
      updateDocumentStage(doc.id, activeIdx, nextProgress);
    });
  }, [documents, updateDocumentStage]);

  useEffect(() => {
    timerRef.current = setInterval(tick, TICK_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [tick]);

  const selectedDocument = useMemo(() => {
    if (documents.length === 0) return null;
    if (!selectedDocId) return documents[0];
    return documents.find((d) => d.id === selectedDocId) || documents[0];
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
      : (totalDocuments > 0 ? 96 : 0);

    return {
      totalDocuments,
      processing,
      completed,
      failed,
      avgProcessingMs: completed > 0 ? 3200 : 0,
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
