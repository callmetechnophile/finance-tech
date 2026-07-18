import { useModalStore } from "@/shared/stores/modal.store";
export default function useModal() {
  const store = useModalStore();
  return {
    openModals: store.openModals,
    modalHistory: store.modalHistory,
    isFullscreen: store.isFullscreen,
    openModal: store.openModal,
    closeModal: store.closeModal,
    setFullscreen: store.setFullscreen,
  };
}
