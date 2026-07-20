"use client";

import React from "react";
import { MessageSquare, Clock, Plus, Search } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";

export function ConversationHistoryRegion() {
  const history = [
    { id: "c1", title: "Q3 Solvency Runway Analysis", time: "10 min ago", active: true },
    { id: "c2", title: "Apex Steel Delinquency Strategy", time: "2 hours ago", active: false },
    { id: "c3", title: "Yield Sweep & Cash Reserve Opt", time: "Yesterday", active: false },
    { id: "c4", title: "CNC Machine Purchase ROI", time: "July 16", active: false },
  ];

  return (
    <Panel className="bg-[#111] border-[#222] space-y-3" padded>
      <div className="flex justify-between items-center border-b border-[#222] pb-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-[#faff69]" /> Threads History
        </h3>
        <button
          onClick={() => alert("Started new Copilot chat thread.")}
          className="p-1 rounded bg-[#2a2a2a] hover:bg-[#333] text-white/70 hover:text-white transition-colors"
          title="New Thread"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-1">
        {history.map((h) => (
          <button
            key={h.id}
            onClick={() => alert(`Switched to thread: "${h.title}"`)}
            className={[
              "w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between group cursor-pointer",
              h.active
                ? "bg-[#1a1a1a] text-[#faff69] font-semibold border border-[#faff69]/30"
                : "text-white/60 hover:text-white hover:bg-[#1a1a1a]"
            ].join(" ")}
          >
            <span className="truncate pr-2">{h.title}</span>
            <span className="text-[9px] text-white/30 shrink-0 font-mono">{h.time}</span>
          </button>
        ))}
      </div>
    </Panel>
  );
}
