import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type PipelineDocument,
  type PipelineStageState,
  type PipelineSummaryStats,
  PIPELINE_STAGES,
} from "@/features/documents/types/pipeline.types";

interface DocumentPipelineStore {
  documents: PipelineDocument[];
  selectedDocId: string | null;
  addUploadedFile: (file: File) => PipelineDocument;
  setSelectedDocId: (id: string | null) => void;
  updateDocumentStage: (docId: string, stageIndex: number, progress: number, status?: string) => void;
  removeDocument: (id: string) => void;
  clearAll: () => void;
}

export function createPipelineStagesForFile(fileName: string): PipelineStageState[] {
  return PIPELINE_STAGES.map((s, idx) => ({
    id: s.id,
    status: idx === 0 ? "running" : "pending",
    progress: idx === 0 ? 10 : 0,
    elapsedMs: 0,
    confidence: s.hasConfidence ? 95 + Math.floor(Math.random() * 5) : undefined,
    retryCount: 0,
    warningCount: 0,
    startedAt: idx === 0 ? new Date().toISOString() : undefined,
    logs: idx === 0 ? [
      { timestamp: new Date().toISOString(), level: "info", message: `File '${fileName}' ingested into pipeline.` },
      { timestamp: new Date().toISOString(), level: "info", message: `Stage '${s.name}' active.` },
    ] : [],
  }));
}

export const useDocumentPipelineStore = create<DocumentPipelineStore>()(
  persist(
    (set, get) => ({
      documents: [],
      selectedDocId: null,

      addUploadedFile: (file: File) => {
        const ext = (file.name.split(".").pop() || "PDF").toUpperCase() as any;
        const sizeMB = Number((file.size / (1024 * 1024)).toFixed(2));
        const docId = `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const newDoc: PipelineDocument = {
          id: docId,
          fileName: file.name,
          fileType: ext,
          fileSizeMB: sizeMB || 0.1,
          activeStageIndex: 0,
          overallProgress: 5,
          overallConfidence: 96,
          estimatedRemainingMs: 12000,
          status: "processing",
          startedAt: new Date().toISOString(),
          stages: createPipelineStagesForFile(file.name),
        };

        set((state) => ({
          documents: [newDoc, ...state.documents],
          selectedDocId: docId,
        }));

        return newDoc;
      },

      setSelectedDocId: (id) => set({ selectedDocId: id }),

      updateDocumentStage: (docId, stageIndex, progress, newStatus) => {
        set((state) => ({
          documents: state.documents.map((doc) => {
            if (doc.id !== docId) return doc;

            const stages = [...doc.stages];
            if (!stages[stageIndex]) return doc;

            const currentStage = { ...stages[stageIndex] };
            currentStage.progress = progress;

            if (progress >= 100) {
              currentStage.status = "completed";
              currentStage.completedAt = new Date().toISOString();

              // Activate next stage if available
              const nextIdx = stageIndex + 1;
              if (nextIdx < stages.length) {
                stages[nextIdx] = {
                  ...stages[nextIdx],
                  status: "running",
                  startedAt: new Date().toISOString(),
                  logs: [
                    { timestamp: new Date().toISOString(), level: "info", message: `Stage '${PIPELINE_STAGES[nextIdx].name}' started.` },
                  ],
                };
              }
            }

            stages[stageIndex] = currentStage;
            const completedCount = stages.filter((s) => s.status === "completed" || s.status === "skipped").length;
            const overallProgress = Math.min(100, Math.round((completedCount / PIPELINE_STAGES.length) * 100));
            const isFinished = completedCount >= PIPELINE_STAGES.length - 1;

            return {
              ...doc,
              stages,
              activeStageIndex: isFinished ? PIPELINE_STAGES.length - 1 : Math.min(stageIndex + (progress >= 100 ? 1 : 0), PIPELINE_STAGES.length - 1),
              overallProgress,
              status: isFinished ? "completed" : "processing",
              completedAt: isFinished ? new Date().toISOString() : undefined,
            };
          }),
        }));
      },

      removeDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((d) => d.id !== id),
          selectedDocId: state.selectedDocId === id ? (state.documents[0]?.id || null) : state.selectedDocId,
        })),

      clearAll: () => set({ documents: [], selectedDocId: null }),
    }),
    { name: "forge-document-pipeline-live" }
  )
);
