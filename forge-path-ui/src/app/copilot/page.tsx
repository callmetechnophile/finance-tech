"use client";

import React, { useState } from "react";
import { Bot, Sparkles, Download, Plus, Layers, Database } from "lucide-react";
import { PageContainer } from "@/shared/components/layout/PageContainer";
import { WorkspaceHeader } from "@/shared/components/layout/WorkspaceHeader";
import { SplitView } from "@/shared/components/layout/SplitView";
import { ConversationHistoryRegion } from "@/features/copilot/components/ConversationHistoryRegion";
import { AttachmentsPanelRegion } from "@/features/copilot/components/AttachmentsPanelRegion";
import { SuggestedPromptsRegion } from "@/features/copilot/components/SuggestedPromptsRegion";
import { ChatWorkspaceRegion } from "@/features/copilot/components/ChatWorkspaceRegion";
import { ContextPanelRegion } from "@/features/copilot/components/ContextPanelRegion";
import { AIInsightsPanelRegion } from "@/features/copilot/components/AIInsightsPanelRegion";

export default function CopilotPage() {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  const HeaderActions = (
    <div className="flex items-center gap-2">
      <button
        onClick={() => alert("Started new Virtual CFO chat thread.")}
        className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] text-xs font-semibold text-white transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5 text-[#faff69]" />
        <span>New Conversation</span>
      </button>

      <button
        onClick={() => alert("Exporting Virtual CFO Conversation transcript & recommendations (PDF)...")}
        className="px-3 py-1.5 rounded-lg bg-[#faff69] hover:bg-[#e6eb52] text-black text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 fill-black" />
        <span>Export Thread</span>
      </button>
    </div>
  );

  const HeaderBadge = (
    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#faff69]/10 text-[#faff69] border border-[#faff69]/20 uppercase tracking-wider flex items-center gap-1">
      <Bot className="w-3 h-3 animate-pulse" /> Gemma 4 • NIM Active • 145ms
    </span>
  );

  const LeftSidebar = (
    <div className="h-full overflow-y-auto pr-2 space-y-4">
      {/* 1. Conversation History Region */}
      <ConversationHistoryRegion />

      {/* 2. Attachments Panel Region */}
      <AttachmentsPanelRegion />
    </div>
  );

  const MainCenterColumn = (
    <div className="h-full flex flex-col min-h-0 px-2 space-y-4 overflow-hidden">
      {/* 3. Suggested Prompts */}
      <SuggestedPromptsRegion onSelectPrompt={(p) => setSelectedPrompt(p)} />

      {/* 4. Chat Workspace */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ChatWorkspaceRegion key={selectedPrompt || "default"} />
      </div>
    </div>
  );

  const RightSidebar = (
    <div className="h-full overflow-y-auto pl-2 space-y-4">
      {/* 5. Context Panel Region */}
      <ContextPanelRegion />

      {/* 6. AI Insights Panel Region */}
      <AIInsightsPanelRegion />
    </div>
  );

  const RightSideContent = (
    <SplitView
      left={MainCenterColumn}
      right={RightSidebar}
      defaultLeftWidth={70}
      minLeft={50}
      maxLeft={85}
      resizable={true}
      className="w-full h-full"
    />
  );

  return (
    <div className="h-full flex flex-col min-h-0 bg-[#0a0a0a]" aria-label="AI Financial Copilot Workspace">
      {/* Sticky Workspace Header */}
      <WorkspaceHeader
        title="AI Financial Copilot (Virtual CFO)"
        subtitle="Conversational Virtual CFO powered by Gemma 4 & NVIDIA NIM with real-time financial context."
        icon={<Bot className="w-5 h-5 text-[#faff69]" aria-hidden="true" />}
        badge={HeaderBadge}
        actions={HeaderActions}
        bordered={true}
        className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#2a2a2a]"
      />

      {/* Workspace Body: Resizable 3-Column Layout */}
      <PageContainer
        scrollable={false}
        padded={true}
        className="flex-1 min-h-0 pb-6 overflow-hidden"
        aria-label="AI Financial Copilot content"
      >
        <div className="flex-1 min-h-0 w-full overflow-hidden">
          <SplitView
            left={LeftSidebar}
            right={RightSideContent}
            defaultLeftWidth={22}
            minLeft={15}
            maxLeft={35}
            resizable={true}
            className="w-full h-full"
          />
        </div>
      </PageContainer>
    </div>
  );
}
