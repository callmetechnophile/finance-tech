// ─── Pipeline Types ────────────────────────────────────────────────────────

export type StageStatus =
  | "pending"
  | "queued"
  | "running"
  | "completed"
  | "warning"
  | "failed"
  | "skipped";

export type LogLevel = "info" | "warn" | "error" | "debug";

export type DocumentStatus = "queued" | "processing" | "completed" | "failed";

// ─── Stage definition (static config, no state) ───────────────────────────

export interface StageDefinition {
  id: string;
  name: string;
  description: string;
  /** expected duration in ms for the mock simulator */
  nominalDurationMs: number;
  /** whether AI confidence score is relevant for this stage */
  hasConfidence: boolean;
}

// ─── Live stage state ─────────────────────────────────────────────────────

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
}

export interface PipelineStageState {
  id: string;
  status: StageStatus;
  /** 0–100 */
  progress: number;
  /** elapsed ms */
  elapsedMs: number;
  /** 0–100, undefined when not applicable */
  confidence?: number;
  retryCount: number;
  warningCount: number;
  errorMessage?: string;
  startedAt?: string;
  completedAt?: string;
  logs: LogEntry[];
}

// ─── Per-document record ──────────────────────────────────────────────────

export interface PipelineDocument {
  id: string;
  fileName: string;
  fileType: "PDF" | "PNG" | "JPG" | "TIFF" | "CSV" | "XLSX";
  fileSizeMB: number;
  /** index into PIPELINE_STAGES[] of the currently active stage */
  activeStageIndex: number;
  /** 0–100 overall */
  overallProgress: number;
  /** weighted average confidence across completed stages */
  overallConfidence: number;
  /** ms remaining (mock estimate) */
  estimatedRemainingMs: number;
  status: DocumentStatus;
  startedAt: string;
  completedAt?: string;
  stages: PipelineStageState[];
}

// ─── Pipeline summary stats ───────────────────────────────────────────────

export interface PipelineSummaryStats {
  totalDocuments: number;
  processing: number;
  completed: number;
  failed: number;
  /** average ms across completed docs */
  avgProcessingMs: number;
  /** 0–100 */
  avgConfidence: number;
  queueLength: number;
}

// ─── Stage ordering (single source of truth) ──────────────────────────────

export const PIPELINE_STAGES: StageDefinition[] = [
  {
    id: "upload",
    name: "Upload",
    description: "Receive raw file bytes via secure ingestion endpoint.",
    nominalDurationMs: 800,
    hasConfidence: false,
  },
  {
    id: "virus_scan",
    name: "Virus Scan",
    description: "ClamAV signature scan + behavioural sandbox analysis.",
    nominalDurationMs: 1200,
    hasConfidence: false,
  },
  {
    id: "file_validation",
    name: "File Validation",
    description: "Validate MIME type, checksum integrity, and file structure.",
    nominalDurationMs: 600,
    hasConfidence: false,
  },
  {
    id: "doc_classification",
    name: "Document Classification",
    description: "ML classifier identifies document type (invoice, PO, bank statement…).",
    nominalDurationMs: 1500,
    hasConfidence: true,
  },
  {
    id: "image_enhancement",
    name: "Image Enhancement",
    description: "Deskew, denoise, contrast-normalise, and upscale to 300 DPI.",
    nominalDurationMs: 2000,
    hasConfidence: false,
  },
  {
    id: "ocr_processing",
    name: "OCR Processing",
    description: "Tesseract 5 + proprietary post-correction layer extracts raw text.",
    nominalDurationMs: 3500,
    hasConfidence: true,
  },
  {
    id: "field_extraction",
    name: "Field Extraction",
    description: "NER + regex rules identify vendor, amount, dates, line items, tax codes.",
    nominalDurationMs: 2200,
    hasConfidence: true,
  },
  {
    id: "schema_mapping",
    name: "Schema Mapping",
    description: "Map extracted fields to canonical FinancialDocument schema v2.4.",
    nominalDurationMs: 800,
    hasConfidence: true,
  },
  {
    id: "business_validation",
    name: "Business Validation",
    description: "Check PO reference, vendor whitelist, amount limits, and GL code rules.",
    nominalDurationMs: 1000,
    hasConfidence: false,
  },
  {
    id: "duplicate_detection",
    name: "Duplicate Detection",
    description: "Fuzzy hash + semantic similarity search against NeonDB invoice ledger.",
    nominalDurationMs: 900,
    hasConfidence: true,
  },
  {
    id: "ai_verification",
    name: "AI Verification",
    description: "Gemma 2B verifies field accuracy, flags anomalies, and calculates trust score.",
    nominalDurationMs: 2800,
    hasConfidence: true,
  },
  {
    id: "manual_review",
    name: "Manual Review",
    description: "Routed to human operator queue when confidence < 75% or anomaly detected.",
    nominalDurationMs: 0, // human step, variable
    hasConfidence: false,
  },
  {
    id: "approval",
    name: "Approval",
    description: "CFO / AP Manager approval workflow with digital signature capture.",
    nominalDurationMs: 0, // human step
    hasConfidence: false,
  },
  {
    id: "db_import",
    name: "Database Import",
    description: "Atomic upsert into NeonDB transactions table with full audit trail.",
    nominalDurationMs: 400,
    hasConfidence: false,
  },
  {
    id: "erp_sync",
    name: "ERP Synchronization",
    description: "Push validated record to SAP via REST adapter with idempotency key.",
    nominalDurationMs: 1100,
    hasConfidence: false,
  },
  {
    id: "completed",
    name: "Completed",
    description: "Document fully processed, archived, and available in the ledger.",
    nominalDurationMs: 100,
    hasConfidence: false,
  },
];
