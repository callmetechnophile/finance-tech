"use client";

import { useDrawerStore, DrawerInstance } from "@/shared/stores/drawer.store";
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";

export default function DrawerManager() {
  const { stack, popDrawer, updateActiveWidth, updateActiveTab, closeAll } = useDrawerStore();
  const activeResizerRef = useRef(false);

  // Retrieve the top-most active drawer from the stack
  const activeDrawer: DrawerInstance | null = stack[stack.length - 1] || null;
  const hasHistory = stack.length > 1;

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    activeResizerRef.current = true;
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResizing);
  };

  const resize = (e: MouseEvent) => {
    if (!activeResizerRef.current) return;
    const newWidth = Math.max(300, Math.min(window.innerWidth - 60, window.innerWidth - e.clientX));
    updateActiveWidth(newWidth);
  };

  const stopResizing = () => {
    activeResizerRef.current = false;
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResizing);
  };

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "details", label: "Details" },
    { key: "timeline", label: "Timeline" },
    { key: "history", label: "History" },
    { key: "related", label: "Related Records" },
    { key: "audit", label: "Audit" },
    { key: "comments", label: "Comments" },
    { key: "ai", label: "AI Insights" },
  ];

  return (
    <AnimatePresence>
      {activeDrawer && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAll}
            className="fixed inset-0 bg-black/60 z-40 cursor-pointer backdrop-blur-[1px]"
          />

          {/* Drawer container body */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            style={{ width: activeDrawer.width }}
            className="fixed right-0 top-0 h-full bg-[#1a1a1a] border-l border-[#2a2a2a] shadow-2xl z-40 flex flex-col select-none"
          >
            {/* Draggable border resizer */}
            <div
              onMouseDown={startResizing}
              className="absolute top-0 left-0 w-1 h-full cursor-col-resize hover:bg-[#faff69] transition-colors"
            />

            {/* Header section */}
            <div className="p-6 border-b border-[#2a2a2a] space-y-4 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {hasHistory && (
                    <button
                      onClick={popDrawer}
                      className="px-2 py-1 rounded bg-[#2a2a2a] text-[#888888] hover:text-white text-[10px] font-bold uppercase transition-all cursor-pointer"
                    >
                      ← Back to: {stack[stack.length - 2].title}
                    </button>
                  )}
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {activeDrawer.title}
                  </h3>
                </div>
                <button
                  onClick={closeAll}
                  className="text-xs text-[#888888] hover:text-white uppercase font-bold cursor-pointer"
                >
                  Close ✕
                </button>
              </div>

              {activeDrawer.subtitle && (
                <p className="text-[10px] text-[#cccccc] font-medium leading-relaxed">
                  {activeDrawer.subtitle}
                </p>
              )}
            </div>

            {/* Tab navigation headers */}
            <div className="px-6 border-b border-[#2a2a2a]/60 bg-[#1a1a1a]/40 flex gap-2 overflow-x-auto scrollbar-none py-2 shrink-0">
              {tabs.map((t) => {
                const isActive = activeDrawer.activeTab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => updateActiveTab(t.key)}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider transition-all cursor-pointer ${
                      isActive 
                        ? "bg-[#2a2a2a] text-white border border-white/5" 
                        : "text-[#888888] hover:text-white hover:bg-[#2a2a2a]/40"
                    }`}

                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* Content view tab target */}
            <div className="flex-1 overflow-y-auto p-6 text-xs text-[#cccccc] leading-relaxed">
              <div className="space-y-4">
                <div className="p-4 rounded bg-[#0a0a0a] border border-[#2a2a2a] space-y-1">
                  <div className="text-[10px] font-bold uppercase text-[#faff69]">Active Tab Context</div>
                  <div className="capitalize font-semibold text-white text-xs">{activeDrawer.activeTab}</div>
                </div>
                
                {activeDrawer.activeTab === "overview" && (
                  <div className="space-y-3">
                    <p>This is the primary information overview layout for the selected target object.</p>
                    <p>Details mapping ledger metadata, ingestion queues status, and transaction dates are cached and mapped in client state.</p>
                    <div className="pt-4 border-t border-[#2a2a2a]/60">
                      <button
                        onClick={() => updateActiveTab("details")}
                        className="px-3 py-1.5 bg-[#2a2a2a] text-[#cccccc] hover:text-white rounded border border-[#3a3a3a] text-[10px] uppercase font-bold"
                      >
                        Inspect Details
                      </button>
                    </div>
                  </div>
                )}
                
                {activeDrawer.activeTab !== "overview" && (
                  <p>Placeholder layout frame for tab option: {activeDrawer.activeTab}. Content will plug-in during later milestones.</p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
