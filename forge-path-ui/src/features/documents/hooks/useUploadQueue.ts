"use client";

/**
 * useUploadQueue
 *
 * Manages the upload file queue with mock progress simulation.
 * All uploads are simulated — no real network requests are made.
 */

import { useState, useCallback, useRef } from "react";
import {
  type UploadFile,
  type UploadStatus,
  createUploadFile,
  validateFile,
} from "../types/upload.types";

// Milliseconds between progress ticks
const TICK_INTERVAL = 80;
// How many % points to advance per tick (randomised per file)
const MIN_TICK_INCREMENT = 1.5;
const MAX_TICK_INCREMENT = 4.5;

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

  // Track active timers so we can cancel on unmount / clear
  const timers = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

  const clearTimer = (id: string) => {
    const t = timers.current.get(id);
    if (t) {
      clearInterval(t);
      timers.current.delete(id);
    }
  };

  // ── Simulate a single file upload ──────────────────────────────────────
  const simulateUpload = useCallback((id: string) => {
    const increment =
      MIN_TICK_INCREMENT +
      Math.random() * (MAX_TICK_INCREMENT - MIN_TICK_INCREMENT);

    // Mark as uploading immediately
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "uploading" as UploadStatus } : f))
    );

    const timer = setInterval(() => {
      setFiles((prev) => {
        const idx = prev.findIndex((f) => f.id === id);
        if (idx === -1) {
          clearTimer(id);
          return prev;
        }

        const current = prev[idx];

        // Already done / cancelled
        if (current.status === "complete" || current.status === "error") {
          clearTimer(id);
          return prev;
        }

        const nextProgress = Math.min(100, current.progress + increment);

        if (nextProgress >= 100) {
          clearTimer(id);

          // 5% random chance of mock error
          const hasError = Math.random() < 0.05;

          const updated: UploadFile = hasError
            ? {
                ...current,
                progress: 100,
                status: "error",
                error: "Simulated pipeline ingestion fault. Please retry.",
              }
            : {
                ...current,
                progress: 100,
                status: "complete",
                completedAt: new Date().toISOString(),
              };

          if (!hasError) {
            import("@/shared/stores/document-status.store").then(({ useDocumentStatusStore }) => {
              useDocumentStatusStore.getState().incrementUploadedCount();
            });
          }

          return prev.map((f) => (f.id === id ? updated : f));
        }

        // Between 70–90% briefly switch to "processing"
        const status: UploadStatus =
          nextProgress > 70 && nextProgress < 90 ? "processing" : "uploading";

        return prev.map((f) =>
          f.id === id ? { ...f, progress: nextProgress, status } : f
        );
      });
    }, TICK_INTERVAL);

    timers.current.set(id, timer);
  }, []);

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
        accepted.push(createUploadFile(file));
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
    clearTimer(id);
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  // ── Clear completed files ──────────────────────────────────────────────
  const clearCompleted = useCallback(() => {
    setFiles((prev) => prev.filter((f) => f.status !== "complete"));
  }, []);

  // ── Clear everything ───────────────────────────────────────────────────
  const clearAll = useCallback(() => {
    timers.current.forEach((_, id) => clearTimer(id));
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
      simulateUpload(id);
    },
    [simulateUpload]
  );

  // ── Start uploading all queued files ───────────────────────────────────
  const startUpload = useCallback(() => {
    const queued = files.filter((f) => f.status === "queued");
    if (queued.length === 0) return;

    setIsUploading(true);

    // Stagger starts slightly so progress bars don't move in perfect lockstep
    queued.forEach((f, idx) => {
      setTimeout(() => simulateUpload(f.id), idx * 120);
    });

    // Mark uploading as false once all are done — polled via effect in component
    const checkDone = setInterval(() => {
      setFiles((prev) => {
        const active = prev.filter(
          (f) => f.status === "uploading" || f.status === "processing"
        );
        if (active.length === 0) {
          clearInterval(checkDone);
          setIsUploading(false);
        }
        return prev;
      });
    }, 500);
  }, [files, simulateUpload]);

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
