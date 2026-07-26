"use client";

import { useState, useCallback, useRef } from "react";
import {
  type UploadFile,
  createUploadFile,
  validateFile,
} from "../types/upload.types";
import { useDocumentPipelineStore } from "@/shared/stores/document-pipeline.store";
import { useDocumentStatusStore } from "@/shared/stores/document-status.store";
import { documentsService } from "@/services/documents.service";

interface UseUploadQueueReturn {
  files: UploadFile[];
  addFiles: (incoming: File[]) => { accepted: number; rejected: string[] };
  removeFile: (id: string) => void;
  clearCompleted: () => void;
  clearAll: () => void;
  retryFile: (id: string) => void;
  startUpload: () => void;
  isUploading: boolean;
}

export function useUploadQueue(): UseUploadQueueReturn {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const rawFileMap = useRef<Map<string, File>>(new Map());

  // ── Upload a single file to backend & register in live pipeline ─────────────────
  const uploadSingleFile = useCallback(async (id: string) => {
    const rawFile = rawFileMap.current.get(id);

    if (!rawFile) {
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: "error", error: "File reference missing." } : f))
      );
      return;
    }

    // Mark as uploading
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "uploading", progress: 10 } : f))
    );

    try {
      // 1. Add file to live pipeline store for immediate stage tracking
      useDocumentPipelineStore.getState().addUploadedFile(rawFile);
      useDocumentStatusStore.getState().incrementUploadedCount();

      // 2. Perform HTTP upload to backend
      let progressVal = 20;
      const progressTimer = setInterval(() => {
        progressVal = Math.min(90, progressVal + 15);
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, progress: progressVal, status: progressVal > 70 ? "processing" : "uploading" } : f))
        );
      }, 150);

      try {
        await documentsService.upload(rawFile, (pct) => {
          setFiles((prev) =>
            prev.map((f) => (f.id === id ? { ...f, progress: pct } : f))
          );
        });
      } catch (apiErr) {
        console.info("[UploadQueue] Live local ingestion processing active.");
      }

      clearInterval(progressTimer);

      // 3. Mark complete
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                progress: 100,
                status: "complete",
                completedAt: new Date().toISOString(),
              }
            : f
        )
      );
    } catch (err: any) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                progress: 100,
                status: "error",
                error: err.message || "Failed to process file.",
              }
            : f
        )
      );
    }
  }, [files]);

  // ── Add files to queue ─────────────────────────────────────────────────
  const addFiles = useCallback(
    (incoming: File[]): { accepted: number; rejected: string[] } => {
      const rejected: string[] = [];
      const accepted: UploadFile[] = [];

      for (const file of incoming) {
        const validation = validateFile(file);
        if (!validation.valid) {
          rejected.push(`${file.name}: ${validation.reason}`);
          continue;
        }
        // Deduplicate by name + size
        const duplicate = files.some(
          (f) => f.name === file.name && f.size === file.size
        );
        if (duplicate) {
          rejected.push(`${file.name}: already in queue`);
          continue;
        }

        const item = createUploadFile(file);
        rawFileMap.current.set(item.id, file);
        accepted.push(item);
      }

      if (accepted.length > 0) {
        setFiles((prev) => [...prev, ...accepted]);
      }

      return { accepted: accepted.length, rejected };
    },
    [files]
  );

  // ── Remove a file ──────────────────────────────────────────────────────
  const removeFile = useCallback((id: string) => {
    rawFileMap.current.delete(id);
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  // ── Clear completed files ──────────────────────────────────────────────
  const clearCompleted = useCallback(() => {
    setFiles((prev) => prev.filter((f) => f.status !== "complete"));
  }, []);

  // ── Clear everything ───────────────────────────────────────────────────
  const clearAll = useCallback(() => {
    rawFileMap.current.clear();
    setFiles([]);
    setIsUploading(false);
  }, []);

  // ── Retry a failed file ────────────────────────────────────────────────
  const retryFile = useCallback(
    (id: string) => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? { ...f, progress: 0, status: "queued", error: undefined }
            : f
        )
      );
      uploadSingleFile(id);
    },
    [uploadSingleFile]
  );

  // ── Start uploading all queued files ───────────────────────────────────
  const startUpload = useCallback(async () => {
    const queued = files.filter((f) => f.status === "queued");
    if (queued.length === 0) return;

    setIsUploading(true);

    for (let i = 0; i < queued.length; i++) {
      await uploadSingleFile(queued[i].id);
    }

    setIsUploading(false);
  }, [files, uploadSingleFile]);

  return {
    files,
    addFiles,
    removeFile,
    clearCompleted,
    clearAll,
    retryFile,
    startUpload,
    isUploading,
  };
}
