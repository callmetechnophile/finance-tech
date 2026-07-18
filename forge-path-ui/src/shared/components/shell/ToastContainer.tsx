"use client";

import { useLayoutStore } from "@/shared/stores/layout.store";
import { AnimatePresence, motion } from "framer-motion";

export default function ToastContainer() {
  const { toasts, dismissToast } = useLayoutStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 w-80">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className={`p-4 rounded-md border flex flex-col gap-1 shadow-lg bg-[#1a1a1a] ${
              t.type === "success" ? "border-[#22c55e]/30" :
              t.type === "error" ? "border-[#ef4444]/30" :
              t.type === "warning" ? "border-[#f59e0b]/30" :
              "border-[#2a2a2a]"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                t.type === "success" ? "text-[#22c55e]" :
                t.type === "error" ? "text-[#ef4444]" :
                t.type === "warning" ? "text-[#f59e0b]" :
                "text-[#faff69]"
              }`}>{t.title}</span>
              <button 
                onClick={() => dismissToast(t.id)}
                className="text-[9px] text-[#888888] hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-[10px] text-[#cccccc] leading-relaxed">{t.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
