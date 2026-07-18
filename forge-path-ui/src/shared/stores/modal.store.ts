import { create } from "zustand";

interface ModalState {
  openModals: string[];
  modalQueue: string[];
  modalHistory: string[];
  isFullscreen: boolean;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  setFullscreen: (f: boolean) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  openModals: [],
  modalQueue: [],
  modalHistory: [],
  isFullscreen: false,
  openModal: (modalId) => set((s) => ({ 
    openModals: [...s.openModals, modalId],
    modalHistory: [...s.modalHistory, modalId],
  })),
  closeModal: () => set((s) => ({ 
    openModals: s.openModals.slice(0, -1),
  })),
  setFullscreen: (isFullscreen) => set({ isFullscreen }),
}));
