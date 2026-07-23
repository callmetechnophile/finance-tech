import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DocumentStatusState {
  uploadedCount: number;
  incrementUploadedCount: () => void;
  reset: () => void;
}

export const useDocumentStatusStore = create<DocumentStatusState>()(
  persist(
    (set) => ({
      uploadedCount: 0,
      incrementUploadedCount: () => set((s) => ({ uploadedCount: s.uploadedCount + 1 })),
      reset: () => set({ uploadedCount: 0 }),
    }),
    { name: "forge-document-status" }
  )
);
