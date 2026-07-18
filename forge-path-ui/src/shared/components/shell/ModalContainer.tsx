"use client";

import { useLayoutStore } from "@/shared/stores/layout.store";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

interface ModalContainerProps {
  children?: ReactNode;
}

export default function ModalContainer({ children }: ModalContainerProps) {
  const { activeModal, closeModal } = useLayoutStore();

  return (
    <AnimatePresence>
      {activeModal && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black/70 z-50 cursor-pointer"
          />

          {/* Modal layout box */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">System Dialog</h3>
                <button onClick={closeModal} className="text-[#888888] hover:text-white">✕</button>
              </div>
              <div className="text-xs text-[#cccccc]">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
