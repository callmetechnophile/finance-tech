// Upload Center types — shared across all upload sub-components

export type UploadStatus =
  | "queued"
  | "uploading"
  | "processing"
  | "complete"
  | "error";

export type AllowedMimeType =
  | "application/pdf"
  | "image/png"
  | "image/jpeg"
  | "image/tiff"
  | "text/csv"
  | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export interface UploadFile {
  /** Browser-assigned unique id */
  id: string;
  /** Original File reference */
  file: File;
  /** Display name (file.name) */
  name: string;
  /** Bytes */
  size: number;
  /** MIME type */
  type: AllowedMimeType | string;
  /** 0–100 */
  progress: number;
  status: UploadStatus;
  /** Error message when status === "error" */
  error?: string;
  /** ISO timestamp — when queued */
  queuedAt: string;
  /** ISO timestamp — when completed */
  completedAt?: string;
}

export const ACCEPTED_MIME_TYPES: AllowedMimeType[] = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/tiff",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export const ACCEPTED_EXTENSIONS = ".pdf,.png,.jpg,.jpeg,.tiff,.tif,.csv,.xlsx";

export const MAX_FILE_SIZE_MB = 50;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const MIME_LABELS: Record<string, string> = {
  "application/pdf": "PDF",
  "image/png": "PNG",
  "image/jpeg": "JPG",
  "image/tiff": "TIFF",
  "text/csv": "CSV",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
};

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileExtension(name: string): string {
  return name.split(".").pop()?.toUpperCase() ?? "FILE";
}

/** Validate a file before adding to queue */
export function validateFile(
  file: File
): { valid: true } | { valid: false; reason: string } {
  if (!ACCEPTED_MIME_TYPES.includes(file.type as AllowedMimeType)) {
    return {
      valid: false,
      reason: `Unsupported file type: ${file.type || getFileExtension(file.name)}`,
    };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      reason: `File exceeds ${MAX_FILE_SIZE_MB} MB limit (${formatBytes(file.size)})`,
    };
  }
  return { valid: true };
}

/** Create an UploadFile entry from a browser File */
export function createUploadFile(file: File): UploadFile {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    file,
    name: file.name,
    size: file.size,
    type: file.type,
    progress: 0,
    status: "queued",
    queuedAt: new Date().toISOString(),
  };
}
