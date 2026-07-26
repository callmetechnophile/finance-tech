import {
  type PipelineDocument,
  type PipelineStageState,
  type PipelineSummaryStats,
  PIPELINE_STAGES,
} from "../types/pipeline.types";

function buildCompletedStages(overallConfidence: number): PipelineStageState[] {
  return PIPELINE_STAGES.map((s) => ({
    id: s.id,
    status: s.id === "manual_review" || s.id === "approval" ? "skipped" : "completed",
    progress: 100,
    elapsedMs: s.nominalDurationMs,
    confidence: s.hasConfidence ? overallConfidence + Math.floor(Math.random() * 3 - 1) : undefined,
    retryCount: 0,
    warningCount: 0,
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: new Date(Date.now() - 3500000).toISOString(),
    logs: [
      { timestamp: new Date(Date.now() - 3600000).toISOString(), level: "info", message: `Stage '${s.id}' initialized.` },
      { timestamp: new Date(Date.now() - 3500000).toISOString(), level: "info", message: `Stage '${s.id}' completed successfully.` },
    ],
  }));
}

function buildProcessingStages(): PipelineStageState[] {
  return PIPELINE_STAGES.map((s, idx) => {
    if (idx < 10) {
      return {
        id: s.id,
        status: "completed",
        progress: 100,
        elapsedMs: s.nominalDurationMs,
        confidence: s.hasConfidence ? 96 : undefined,
        retryCount: 0,
        warningCount: 0,
        startedAt: new Date(Date.now() - 60000).toISOString(),
        completedAt: new Date(Date.now() - 30000).toISOString(),
        logs: [{ timestamp: new Date().toISOString(), level: "info", message: `Stage '${s.id}' completed.` }],
      };
    } else if (idx === 10) {
      return {
        id: s.id,
        status: "running",
        progress: 65,
        elapsedMs: 1800,
        confidence: 94,
        retryCount: 0,
        warningCount: 0,
        startedAt: new Date().toISOString(),
        logs: [{ timestamp: new Date().toISOString(), level: "info", message: "Gemma 4 verifying field accuracy and calculating anomaly confidence score..." }],
      };
    } else {
      return {
        id: s.id,
        status: "pending",
        progress: 0,
        elapsedMs: 0,
        retryCount: 0,
        warningCount: 0,
        logs: [],
      };
    }
  });
}

function buildFailedStages(): PipelineStageState[] {
  return PIPELINE_STAGES.map((s, idx) => {
    if (idx < 9) {
      return {
        id: s.id,
        status: "completed",
        progress: 100,
        elapsedMs: s.nominalDurationMs,
        confidence: 92,
        retryCount: 0,
        warningCount: 0,
        startedAt: new Date(Date.now() - 7200000).toISOString(),
        completedAt: new Date(Date.now() - 7100000).toISOString(),
        logs: [{ timestamp: new Date().toISOString(), level: "info", message: `Stage '${s.id}' completed.` }],
      };
    } else if (idx === 9) {
      return {
        id: s.id,
        status: "failed",
        progress: 100,
        elapsedMs: 900,
        confidence: 45,
        retryCount: 2,
        warningCount: 1,
        errorMessage: "Duplicate invoice hash detected: INV-2024-089 already ingested in NeonDB.",
        startedAt: new Date(Date.now() - 7100000).toISOString(),
        completedAt: new Date(Date.now() - 7000000).toISOString(),
        logs: [
          { timestamp: new Date().toISOString(), level: "error", message: "Duplicate invoice hash detected: INV-2024-089 matching transaction #8921." },
        ],
      };
    } else {
      return {
        id: s.id,
        status: "pending",
        progress: 0,
        elapsedMs: 0,
        retryCount: 0,
        warningCount: 0,
        logs: [],
      };
    }
  });
}

export const MOCK_PIPELINE_DOCUMENTS: PipelineDocument[] = [
  {
    id: "doc-101",
    fileName: "INV-2024-089_ApexSteel.pdf",
    fileType: "PDF",
    fileSizeMB: 2.4,
    activeStageIndex: 15,
    overallProgress: 100,
    overallConfidence: 98,
    estimatedRemainingMs: 0,
    status: "completed",
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: new Date(Date.now() - 3500000).toISOString(),
    stages: buildCompletedStages(98),
  },
  {
    id: "doc-102",
    fileName: "PO-99214_PrecisionParts.pdf",
    fileType: "PDF",
    fileSizeMB: 1.8,
    activeStageIndex: 15,
    overallProgress: 100,
    overallConfidence: 96,
    estimatedRemainingMs: 0,
    status: "completed",
    startedAt: new Date(Date.now() - 5400000).toISOString(),
    completedAt: new Date(Date.now() - 5300000).toISOString(),
    stages: buildCompletedStages(96),
  },
  {
    id: "doc-103",
    fileName: "TaxInvoice_2024_11A.pdf",
    fileType: "PDF",
    fileSizeMB: 3.1,
    activeStageIndex: 10,
    overallProgress: 68,
    overallConfidence: 94,
    estimatedRemainingMs: 4200,
    status: "processing",
    startedAt: new Date(Date.now() - 60000).toISOString(),
    stages: buildProcessingStages(),
  },
  {
    id: "doc-104",
    fileName: "BankStatement_Q3_HDFC.pdf",
    fileType: "PDF",
    fileSizeMB: 4.5,
    activeStageIndex: 15,
    overallProgress: 100,
    overallConfidence: 97,
    estimatedRemainingMs: 0,
    status: "completed",
    startedAt: new Date(Date.now() - 10800000).toISOString(),
    completedAt: new Date(Date.now() - 10700000).toISOString(),
    stages: buildCompletedStages(97),
  },
  {
    id: "doc-105",
    fileName: "VendorAgreement_DeltaFab.pdf",
    fileType: "PDF",
    fileSizeMB: 1.2,
    activeStageIndex: 15,
    overallProgress: 100,
    overallConfidence: 95,
    estimatedRemainingMs: 0,
    status: "completed",
    startedAt: new Date(Date.now() - 14400000).toISOString(),
    completedAt: new Date(Date.now() - 14300000).toISOString(),
    stages: buildCompletedStages(95),
  },
  {
    id: "doc-106",
    fileName: "Duplicate_CreditNote_ERR.pdf",
    fileType: "PDF",
    fileSizeMB: 0.9,
    activeStageIndex: 9,
    overallProgress: 56,
    overallConfidence: 45,
    estimatedRemainingMs: 0,
    status: "failed",
    startedAt: new Date(Date.now() - 7200000).toISOString(),
    stages: buildFailedStages(),
  },
];

export const MOCK_SUMMARY_STATS: PipelineSummaryStats = {
  totalDocuments: 6,
  processing: 1,
  completed: 4,
  failed: 1,
  avgProcessingMs: 4200,
  avgConfidence: 96,
  queueLength: 1,
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
