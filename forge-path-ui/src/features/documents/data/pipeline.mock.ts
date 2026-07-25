import {
  type PipelineDocument,
  type PipelineSummaryStats,
} from "../types/pipeline.types";

/**
 * Enterprise Empty State Pipeline Defaults (Zero Operational Values)
 */

export const MOCK_PIPELINE_DOCUMENTS: PipelineDocument[] = [];

export const MOCK_SUMMARY_STATS: PipelineSummaryStats = {
  totalDocuments: 0,
  processing: 0,
  completed: 0,
  failed: 0,
  avgProcessingMs: 0,
  avgConfidence: 0,
  queueLength: 0,
};

// Helper to format ms → human readable
export function formatDuration(ms: number): string {
  if (ms <= 0) return "—";
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  const m = Math.floor(ms / 60_000);
  const s = Math.round((ms % 60_000) / 1000);
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

export function formatEta(ms: number): string {
  if (ms <= 0) return "—";
  if (ms < 60_000) return `~${Math.ceil(ms / 1000)}s`;
  return `~${Math.ceil(ms / 60_000)}m`;
}
