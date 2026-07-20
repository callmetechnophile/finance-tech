"use client";

/**
 * DropZone
 *
 * Drag-and-drop + file picker input.
 * Accepts the supported document types only.
 */

import React, { useRef, useState, useCallback, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FolderOpen,
  FileText,
  Image,
  Sheet,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import {
  ACCEPTED_EXTENSIONS,
  MIME_LABELS,
  ACCEPTED_MIME_TYPES,
} from "../types/upload.types";

interface DropZoneProps {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}

const FORMAT_ICONS: Record<string, React.ReactNode> = {
  PDF: <FileText className="w-3 h-3" />,
  PNG: <Image className="w-3 h-3" />,
  JPG: <Image className="w-3 h-3" />,
  TIFF: <Image className="w-3 h-3" />,
  CSV: <Sheet className="w-3 h-3" />,
  XLSX: <FileSpreadsheet className="w-3 h-3" />,
};

export function DropZone({ onFiles, disabled = false }: DropZoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isDragReject, setIsDragReject] = useState(false);
  const dragCounter = useRef(0);

  const extractFiles = (dt: DataTransfer): File[] =>
    Array.from(dt.files);

  const checkDragTypes = (dt: DataTransfer): boolean => {
    // If types not available (Firefox), optimistically allow
    if (!dt.types.includes("Files")) return false;
    return true;
  };

  const onDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current += 1;
      if (dragCounter.current === 1) {
        const valid = checkDragTypes(e.dataTransfer);
        setIsDragActive(valid);
        setIsDragReject(!valid);
      }
    },
    []
  );

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragActive(false);
      setIsDragReject(false);
    }
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current = 0;
      setIsDragActive(false);
      setIsDragReject(false);
      if (disabled) return;
      const dropped = extractFiles(e.dataTransfer);
      if (dropped.length > 0) onFiles(dropped);
    },
    [disabled, onFiles]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = Array.from(e.target.files ?? []);
      if (selected.length > 0) onFiles(selected);
      // Reset so same file can be re-selected
      e.target.value = "";
    },
    [onFiles]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        inputRef.current?.click();
      }
    },
    []
  );

  const labels = Object.values(MIME_LABELS);

  return (
    <div className="space-y-3">
      {/* Hidden native file input */}
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        multiple
        accept={ACCEPTED_EXTENSIONS}
        aria-label="File picker for document upload"
        className="sr-only"
        onChange={onInputChange}
        disabled={disabled}
      />

      {/* Drop surface */}
      <motion.div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-label="Drop files here or press Enter to browse"
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onKeyDown={onKeyDown}
        onClick={() => !disabled && inputRef.current?.click()}
        animate={{
          borderColor: isDragReject
            ? "rgba(239,68,68,0.6)"
            : isDragActive
            ? "rgba(250,255,105,0.7)"
            : "rgba(42,42,42,1)",
          backgroundColor: isDragReject
            ? "rgba(239,68,68,0.04)"
            : isDragActive
            ? "rgba(250,255,105,0.04)"
            : "rgba(17,17,17,1)",
        }}
        transition={{ duration: 0.15 }}
        className={cn(
          "relative w-full rounded-xl border-2 border-dashed",
          "flex flex-col items-center justify-center gap-4 py-12 px-6",
          "cursor-pointer select-none outline-none",
          "focus-visible:ring-2 focus-visible:ring-[#faff69] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]",
          "transition-opacity duration-150",
          disabled && "opacity-40 pointer-events-none"
        )}
      >
        {/* Icon cloud */}
        <AnimatePresence mode="wait">
          {isDragActive ? (
            <motion.div
              key="active"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-14 h-14 rounded-2xl bg-[#faff69]/10 border border-[#faff69]/30 flex items-center justify-center"
            >
              <UploadCloud className="w-7 h-7 text-[#faff69]" aria-hidden="true" />
            </motion.div>
          ) : isDragReject ? (
            <motion.div
              key="reject"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center"
            >
              <UploadCloud className="w-7 h-7 text-red-400" aria-hidden="true" />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-14 h-14 rounded-2xl bg-[#2a2a2a] border border-[#333] flex items-center justify-center group-hover:bg-[#333] transition-colors"
            >
              <UploadCloud className="w-7 h-7 text-white/40" aria-hidden="true" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <p className="text-sm font-semibold text-white/80">
            {isDragActive
              ? "Release to add files"
              : isDragReject
              ? "Unsupported file type"
              : "Drop files here"}
          </p>
          <p className="text-xs text-white/40">
            or{" "}
            <span className="text-[#faff69] font-medium underline underline-offset-2">
              browse your computer
            </span>
          </p>
        </div>

        {/* Format chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5" aria-label="Accepted file formats">
          {labels.map((label) => (
            <span
              key={label}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#222] border border-[#333] text-[10px] font-bold text-white/50 uppercase tracking-wider"
            >
              {FORMAT_ICONS[label] ?? null}
              {label}
            </span>
          ))}
          <span className="text-[10px] text-white/30 ml-1">· Max 50 MB each</span>
        </div>

        {/* Browse button — secondary CTA */}
        <button
          type="button"
          tabIndex={-1} // parent div already focusable
          aria-hidden="true"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#222] border border-[#333] text-xs font-semibold text-white/70 hover:bg-[#2a2a2a] hover:text-white transition-colors duration-150"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          <FolderOpen className="w-3.5 h-3.5" aria-hidden="true" />
          Browse Files
        </button>
      </motion.div>
    </div>
  );
}
