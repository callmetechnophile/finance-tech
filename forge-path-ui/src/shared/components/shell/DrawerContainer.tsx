"use client";

import { useLayoutStore } from "@/shared/stores/layout.store";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

interface DrawerContainerProps {
  children?: ReactNode;
}

export default function DrawerContainer({ children }: DrawerContainerProps) {
  const { isDrawerOpen, drawerTab, closeDrawer } = useLayoutStore();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/60 z-40 cursor-pointer"
          />

          {/* Drawer content frame */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-[#1a1a1a] border-l border-[#2a2a2a] shadow-2xl z-50 p-6 flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4 mb-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Drawer Context</h3>
              <button 
                onClick={closeDrawer}
                className="text-[10px] text-[#888888] hover:text-white uppercase font-bold"
              >
                Close ✕
              </button>
            </div>
            
            {/* Nav Tabs inside drawer */}
            <div className="flex gap-2 mb-4 border-b border-[#2a2a2a] pb-2 text-[10px]">
              <span className={`px-2 py-1 font-bold ${drawerTab === "overview" ? "text-[#faff69]" : "text-[#888888]"}`}>Overview</span>
              <span className={`px-2 py-1 font-bold ${drawerTab === "details" ? "text-[#faff69]" : "text-[#888888]"}`}>Details</span>
              <span className={`px-2 py-1 font-bold ${drawerTab === "audit" ? "text-[#faff69]" : "text-[#888888]"}`}>Audit Trail</span>
            </div>

            <div className="flex-1 overflow-y-auto text-xs text-[#cccccc]">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
