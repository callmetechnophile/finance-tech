import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useDocumentPipelineStore } from "./document-pipeline.store";

interface DocumentStatusState {
  uploadedCount: number;
  incrementUploadedCount: () => void;
  setUploadedCount: (count: number) => void;
  reset: () => void;
}

export const useDocumentStatusStore = create<DocumentStatusState>()(
  persist(
    (set) => ({
      uploadedCount: 0,
      incrementUploadedCount: () => set((s) => ({ uploadedCount: s.uploadedCount + 1 })),
      setUploadedCount: (count) => set({ uploadedCount: count }),
      reset: () => set({ uploadedCount: 0 }),
    }),
    { name: "forge-document-status" }
  )
);

// Subscribe to document pipeline store to keep uploadedCount 100% in sync
if (typeof window !== "undefined") {
  useDocumentPipelineStore.subscribe((state) => {
    const count = state.documents.length;
    if (useDocumentStatusStore.getState().uploadedCount !== count) {
      useDocumentStatusStore.getState().setUploadedCount(count);
    }
  });
}
