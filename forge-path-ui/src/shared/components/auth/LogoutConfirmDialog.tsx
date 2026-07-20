"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, AlertTriangle } from "lucide-react";
import { useLogout } from "@/shared/hooks/useLogout";

interface LogoutConfirmDialogProps {
  onCancel: () => void;
}

export function LogoutConfirmDialog({ onCancel }: LogoutConfirmDialogProps) {
  const logout = useLogout();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirm = async () => {
    setIsLoggingOut(true);
    await logout();
    // Navigation happens inside logout(); no need to handle here
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="logout-backdrop"
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
      />

      {/* Dialog */}
      <motion.div
        key="logout-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="logout-title"
        aria-describedby="logout-message"
        className="fixed z-[101] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] bg-[#111111] border border-[#2a2a2a] rounded-2xl shadow-2xl shadow-black/80 overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/20 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-[#ef4444]" />
            </div>
            <h2 id="logout-title" className="text-sm font-bold text-white">
              Confirm Logout
            </h2>
          </div>
          <p id="logout-message" className="text-[12px] text-[#888888] leading-relaxed">
            Are you sure you want to end your current session? All unsaved progress and active workflows will be terminated.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#2a2a2a] mx-6" />

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 px-6 py-4">
          <button
            id="logout-cancel-btn"
            onClick={onCancel}
            disabled={isLoggingOut}
            className="px-4 py-2 rounded-lg text-[11px] font-semibold text-[#888888] hover:text-white hover:bg-[#1a1a1a] border border-transparent hover:border-[#2a2a2a] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            id="logout-confirm-btn"
            onClick={handleConfirm}
            disabled={isLoggingOut}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-bold bg-[#ef4444] hover:bg-[#dc2626] text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? (
              <>
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing out…
              </>
            ) : (
              <>
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </>
            )}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
