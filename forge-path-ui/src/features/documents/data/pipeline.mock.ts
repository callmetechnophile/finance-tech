import {
  type PipelineDocument,
  type PipelineStageState,
  type PipelineSummaryStats,
  type StageStatus,
  type LogEntry,
  PIPELINE_STAGES,
} from "../types/pipeline.types";


// ─── Helpers ──────────────────────────────────────────────────────────────

function ts(offsetMinutes = 0): string {
  return new Date(Date.now() - offsetMinutes * 60_000).toISOString();
}

function randomBetween(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min));
}

// Build an initial set of stage states for a document based on how far along it is
function buildStages(completedUpTo: number, runningAt: number): PipelineStageState[] {
  return PIPELINE_STAGES.map((def, idx): PipelineStageState => {
    if (idx < completedUpTo) {
      // Completed
      const hasCon = def.hasConfidence;
      return {
        id: def.id,
        status: "completed",
        progress: 100,
        elapsedMs: def.nominalDurationMs + randomBetween(-100, 400),
        confidence: hasCon ? randomBetween(79, 99) : undefined,
        retryCount: idx === 5 ? 1 : 0, // OCR retried once for realism
        warningCount: idx === 7 ? 1 : 0, // schema mapping had a field-mapping warning
        startedAt: ts(40 - idx * 2),
        completedAt: ts(39 - idx * 2),
        logs: buildCompletedLogs(def.id, hasCon),
      };
    }

    if (idx === runningAt) {
      const progress = randomBetween(20, 78);
      return {
        id: def.id,
        status: "running",
        progress,
        elapsedMs: Math.round((def.nominalDurationMs * progress) / 100),
        confidence: def.hasConfidence ? randomBetween(70, 94) : undefined,
        retryCount: 0,
        warningCount: 0,
        startedAt: ts(1),
        logs: buildRunningLogs(def.id),
      };
    }

    // Pending / queued
    const status: StageStatus = idx <= runningAt + 3 ? "queued" : "pending";
    return {
      id: def.id,
      status,
      progress: 0,
      elapsedMs: 0,
      retryCount: 0,
      warningCount: 0,
      logs: [],
    };
  });
}


function buildCompletedLogs(stageId: string, hasConfidence: boolean): LogEntry[] {
  const base: LogEntry[] = [
    { timestamp: ts(38), level: "info", message: `Stage '${stageId}' initialised — worker thread assigned.` },
    { timestamp: ts(37), level: "info", message: `Processing started. Nominal timeout: 30s.` },
    { timestamp: ts(36), level: "info", message: `Stage completed successfully.` },
  ];
  if (hasConfidence) {
    base.splice(2, 0, {
      timestamp: ts(37),
      level: "debug",
      message: `Confidence model v2.1 inference complete — score within acceptance threshold.`,
    });
  }
  return base;
}


function buildRunningLogs(stageId: string): LogEntry[] {
  return [
    { timestamp: ts(1), level: "info", message: `Stage '${stageId}' picked up from Kafka topic forge.pipeline.tasks.` },
    { timestamp: ts(0), level: "info", message: `Worker pod forge-worker-3a9f actively processing...` },
  ];
}


// ─── Mock documents ───────────────────────────────────────────────────────

function makeDoc(
  overrides: Partial<PipelineDocument> & { completedUpTo: number; runningAt: number }
): PipelineDocument {
  const { completedUpTo, runningAt, ...rest } = overrides;
  const stages = buildStages(completedUpTo, runningAt);
  const totalStages = PIPELINE_STAGES.length;
  const overallProgress = Math.round(
    ((completedUpTo + (stages[runningAt]?.progress ?? 0) / 100) / totalStages) * 100
  );
  const completedConStages = stages.filter((s) => s.status === "completed" && s.confidence !== undefined);
  const overallConfidence =
    completedConStages.length > 0
      ? Math.round(completedConStages.reduce((s, st) => s + (st.confidence ?? 0), 0) / completedConStages.length)
      : 0;

  return {
    id: rest.id ?? `doc-${Math.random().toString(36).slice(2, 7)}`,
    fileName: "document.pdf",
    fileType: "PDF",
    fileSizeMB: 1.2,
    activeStageIndex: runningAt,
    overallProgress,
    overallConfidence,
    estimatedRemainingMs: randomBetween(8000, 45000),
    status: "processing",
    startedAt: ts(40),
    stages,
    ...rest,
  };
}

// ─── Exported mock data ───────────────────────────────────────────────────

export const MOCK_PIPELINE_DOCUMENTS: PipelineDocument[] = [
  makeDoc({
    id: "doc-001",
    fileName: "apex-steel-inv-2024-089.pdf",
    fileType: "PDF",
    fileSizeMB: 2.4,
    completedUpTo: 10,
    runningAt: 10,
    status: "processing",
    startedAt: ts(42),
    estimatedRemainingMs: 18500,
  }),
  makeDoc({
    id: "doc-002",
    fileName: "delta-fabrication-po-july.pdf",
    fileType: "PDF",
    fileSizeMB: 1.8,
    completedUpTo: 6,
    runningAt: 6,
    status: "processing",
    startedAt: ts(35),
    estimatedRemainingMs: 34200,
  }),
  makeDoc({
    id: "doc-003",
    fileName: "bank-statement-july-2024.xlsx",
    fileType: "XLSX",
    fileSizeMB: 0.6,
    completedUpTo: 15,
    runningAt: 15,
    status: "completed",
    startedAt: ts(90),
    completedAt: ts(5),
    estimatedRemainingMs: 0,
    overallProgress: 100,
    overallConfidence: 96,
  }),
  makeDoc({
    id: "doc-004",
    fileName: "cnc-maintenance-contract.pdf",
    fileType: "PDF",
    fileSizeMB: 3.1,
    completedUpTo: 3,
    runningAt: 3,
    status: "processing",
    startedAt: ts(15),
    estimatedRemainingMs: 52000,
  }),
  makeDoc({
    id: "doc-005",
    fileName: "supplier-bill-acme-q3.pdf",
    fileType: "PDF",
    fileSizeMB: 1.1,
    completedUpTo: 0,
    runningAt: 0,
    status: "processing",
    startedAt: ts(2),
    estimatedRemainingMs: 78000,
  }),
  {
    id: "doc-006",
    fileName: "payroll-summary-jul.csv",
    fileType: "CSV",
    fileSizeMB: 0.2,
    activeStageIndex: 0,
    overallProgress: 0,
    overallConfidence: 0,
    estimatedRemainingMs: 90000,
    status: "queued",
    startedAt: ts(0),
    stages: PIPELINE_STAGES.map((def) => ({
      id: def.id,
      status: "pending" as StageStatus,
      progress: 0,
      elapsedMs: 0,
      retryCount: 0,
      warningCount: 0,
      logs: [],
    })),
  },
  {
    id: "doc-007",
    fileName: "vendor-credit-note-112.tiff",
    fileType: "TIFF",
    fileSizeMB: 5.7,
    activeStageIndex: 0,
    overallProgress: 0,
    overallConfidence: 0,
    estimatedRemainingMs: 100000,
    status: "queued",
    startedAt: ts(0),
    stages: PIPELINE_STAGES.map((def) => ({
      id: def.id,
      status: "pending" as StageStatus,
      progress: 0,
      elapsedMs: 0,
      retryCount: 0,
      warningCount: 0,
      logs: [],
    })),
  },
  // A failed document for error state demo
  {
    id: "doc-008",
    fileName: "corrupted-scan-2024-07.png",
    fileType: "PNG",
    fileSizeMB: 8.4,
    activeStageIndex: 4,
    overallProgress: 29,
    overallConfidence: 0,
    estimatedRemainingMs: 0,
    status: "failed",
    startedAt: ts(60),
    completedAt: ts(45),
    stages: PIPELINE_STAGES.map((def, idx): PipelineStageState => {
      if (idx < 4) {
        return { id: def.id, status: "completed", progress: 100, elapsedMs: def.nominalDurationMs, retryCount: 0, warningCount: 0, startedAt: ts(60 - idx * 3), completedAt: ts(59 - idx * 3), logs: buildCompletedLogs(def.id, def.hasConfidence) };
      }
      if (idx === 4) {
        return { id: def.id, status: "failed", progress: 62, elapsedMs: 1400, retryCount: 3, warningCount: 0, errorMessage: "Image resolution too low (72 DPI). Minimum required: 200 DPI. Max retries exceeded.", startedAt: ts(50), logs: [{ timestamp: ts(50), level: "info", message: "Image enhancement started." }, { timestamp: ts(49), level: "warn", message: "Source DPI detected at 72. Upscaling with Lanczos4..." }, { timestamp: ts(49), level: "warn", message: "Retry 1/3: Upscaling artefacts detected — re-running." }, { timestamp: ts(48), level: "warn", message: "Retry 2/3: OCR pre-validation score 0.34 — below threshold." }, { timestamp: ts(47), level: "error", message: "Retry 3/3: Fatal — image cannot be enhanced to minimum quality. Stage aborted." }] };
      }
      return { id: def.id, status: "skipped", progress: 0, elapsedMs: 0, retryCount: 0, warningCount: 0, logs: [] };
    }),
  },
];

export const MOCK_SUMMARY_STATS: PipelineSummaryStats = {
  totalDocuments: 8,
  processing: 4,
  completed: 1,
  failed: 1,
  avgProcessingMs: 187400,
  avgConfidence: 91,
  queueLength: 2,
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
