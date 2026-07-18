"use client";

import { useNotificationStore, NotificationItem } from "@/shared/stores/notification.store";
import { useBackgroundStore } from "@/shared/stores/background.store";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function NotificationCenterDrawer() {
  const { notifications, isCenterOpen, setCenterOpen, markRead, togglePin, archiveNotification, actOnApproval, markAllRead } = useNotificationStore();
  const { jobs } = useBackgroundStore();
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "approvals" | "jobs">("all");

  const filtered = notifications.filter((n) => {
    if (n.isArchived) return false;
    if (activeFilter === "unread") return !n.isRead;
    if (activeFilter === "approvals") return n.category === "Approvals";
    return true;
  });

  return (
    <AnimatePresence>
      {isCenterOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCenterOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 cursor-pointer backdrop-blur-[1px]"
          />

          {/* Center Drawer Body */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#1a1a1a] border-l border-[#2a2a2a] shadow-2xl z-40 flex flex-col select-none"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#2a2a2a] space-y-4 shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Communication Center</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={markAllRead}
                    className="text-[9px] text-[#faff69] hover:text-[#e6eb52] uppercase font-bold cursor-pointer"
                  >
                    Mark All Read
                  </button>
                  <button
                    onClick={() => setCenterOpen(false)}
                    className="text-xs text-[#888888] hover:text-white font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* Filter bar */}
            <div className="px-6 border-b border-[#2a2a2a]/60 bg-[#1a1a1a]/40 flex gap-2 py-2 shrink-0 overflow-x-auto scrollbar-none">
              {(["all", "unread", "approvals", "jobs"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1 text-[9px] font-bold rounded-md uppercase tracking-wider transition-all cursor-pointer ${
                    activeFilter === filter
                      ? "bg-[#faff69] text-[#0a0a0a]"
                      : "text-[#888888] hover:text-white hover:bg-[#2a2a2a]/30"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Content view */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              
              {/* Render background jobs if filter matches */}
              {(activeFilter === "all" || activeFilter === "jobs") && jobs.length > 0 && (
                <div className="space-y-2 border-b border-[#2a2a2a] pb-4">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-[#888888] mb-2">
                    Running Background Telemetry
                  </div>
                  {jobs.map((job) => (
                    <div key={job.id} className="p-3 bg-[#0a0a0a] rounded border border-[#2a2a2a] space-y-2">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-white uppercase">{job.name}</span>
                        <span className={`text-[9px] uppercase font-semibold ${
                          job.status === "completed" ? "text-green-400" :
                          job.status === "failed" ? "text-red-400" :
                          "text-[#faff69]"
                        }`}>{job.status}</span>
                      </div>
                      
                      {job.status === "running" && (
                        <div className="space-y-1">
                          <div className="h-1 bg-[#2a2a2a] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#faff69] transition-all duration-300"
                              style={{ width: `${job.progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[8px] text-[#888888]">
                            <span>Progress: {job.progress}%</span>
                            <span>ETA: {job.eta}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Alerts List */}
              {activeFilter !== "jobs" && (
                <div className="space-y-3">
                  {filtered.length === 0 ? (
                    <div className="p-8 text-center text-xs text-[#888888]">
                      No active alerts in this category.
                    </div>
                  ) : (
                    filtered.map((item) => {
                      const isUnread = !item.isRead;
                      return (
                        <div
                          key={item.id}
                          className={`p-3 rounded-md bg-[#0a0a0a] border border-[#2a2a2a] flex flex-col gap-2 relative transition-all ${
                            isUnread ? "ring-1 ring-[#faff69]/10" : ""
                          }`}
                        >
                          {/* Alert Header */}
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {isUnread && <span className="w-1.5 h-1.5 rounded-full bg-[#faff69]" />}
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                  item.severity === "Critical" ? "text-red-400" :
                                  item.severity === "High" ? "text-amber-400" :
                                  "text-white"
                                }`}>{item.title}</span>
                              </div>
                              <span className="text-[8px] text-[#888888]">
                                {item.category} • {new Date(item.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => togglePin(item.id)}
                                className={`text-[9px] hover:text-white cursor-pointer ${
                                  item.isPinned ? "text-[#faff69]" : "text-[#888888]"
                                }`}
                              >
                                📌
                              </button>
                              <button
                                onClick={() => archiveNotification(item.id)}
                                className="text-[9px] text-[#888888] hover:text-white cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          </div>

                          {/* Message Body */}
                          <p className="text-[10px] text-[#cccccc] leading-relaxed pl-3">
                            {item.message}
                          </p>

                          {/* Render approval action triggers if type matches */}
                          {item.approvalData && item.approvalData.status === "pending" && (
                            <div className="flex gap-2 pt-2 pl-3 border-t border-[#2a2a2a]/30">
                              <button
                                onClick={() => actOnApproval(item.id, "approved")}
                                className="px-2 py-1 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] text-[9px] font-bold rounded uppercase cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => actOnApproval(item.id, "rejected")}
                                className="px-2 py-1 bg-[#2a2a2a] hover:bg-[#343434] text-white text-[9px] font-bold rounded uppercase border border-[#3a3a3a] cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          )}

                          {item.approvalData && item.approvalData.status !== "pending" && (
                            <div className="text-[9px] text-[#888888] pl-3 italic">
                              Status: Action {item.approvalData.status}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
