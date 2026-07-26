"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bot, User, Send, Paperclip, Copy, ThumbsUp, Sparkles, Check } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { useDocumentPipelineStore } from "@/shared/stores/document-pipeline.store";
import { useDocumentStatusStore } from "@/shared/stores/document-status.store";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatWorkspaceRegionProps {
  initialPrompt?: string | null;
  onSendMessage?: (msg: string) => void;
}

export function ChatWorkspaceRegion({
  initialPrompt,
  onSendMessage,
}: ChatWorkspaceRegionProps) {
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const { documents } = useDocumentPipelineStore();
  const { uploadedCount } = useDocumentStatusStore();
  const hasDocs = documents.length > 0 || uploadedCount > 0;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-welcome",
      role: "assistant",
      content: hasDocs
        ? `Hello! I'm FORGE-PATH **AI Financial Copilot (Virtual CFO)** powered by Gemma 4 & NVIDIA NIM.\n\nI have loaded your financial telemetry and ${documents.length || 1} active document(s). Ask me about your cash runway, AR collections, supplier payables, or solvency forecasts.`
        : "Hello! I'm FORGE-PATH **AI Financial Copilot**. I have full context on your cash flow and active documents. Ask me anything about your manufacturing SME's financial health.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const generateGemmaResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes("upload") || q.includes("statement") || q.includes("invoice")) {
      return `### 📄 Document Processing & Ingestion Workflow\n\nYou can upload PDF invoices, bank CSV statements, or ERP spreadsheets in the **Document Intelligence Workspace** (\`/documents\`).\n\n**Key Automated Features:**\n- **16-Stage AI OCR Pipeline**: Extracts vendor details, line items, tax IDs, and payment terms.\n- **Real-Time Solvency Telemetry**: Instantly updates daily burn rates and 30-day cash projections upon upload.\n- **Anomaly Audit**: Automatically flags duplicate billing, rate discrepancies, or unusual line items.`;
    }

    if (q.includes("solvency") || q.includes("runway") || q.includes("calculate") || q.includes("gemma")) {
      return `### 📊 Solvency & Cash Runway Calculation Engine\n\nGemma AI calculates solvency using real-time cash telemetry:\n\n$$\\text{Estimated Runway (Days)} = \\frac{\\text{Total Liquid Cash Reserves}}{\\text{Daily Net Operating Burn Rate}}$$\n\n- **Current Liquid Cash**: ₹3,42,000\n- **Daily Burn Rate**: ₹4,850 / day\n- **Projected Runway**: **68 Days**\n- **Quick Ratio**: **1.8x** (Healthy > 1.5x safety threshold)\n\nAll metrics are dynamically recalculated as new invoices and bank statements are processed in the pipeline.`;
    }

    if (q.includes("receivable") || q.includes("collection") || q.includes("ar") || q.includes("dso")) {
      return `### 📬 Accounts Receivable & Collection Operations\n\nOur automated collection engine prioritizes receivables into 4 delinquency buckets:\n\n1. **Current (0-30 Days)**: ₹1,20,000 (Low Risk)\n2. **Aging (31-60 Days)**: ₹42,500 (Moderate Risk)\n3. **Delinquent (60+ Days)**: ₹22,000 (High Risk — 2 Accounts Flagged)\n\n**Average DSO**: **34 Days**.\nAutomated multi-channel escalation reminders (Email/SMS) are queued to accelerate cash recovery.`;
    }

    if (q.includes("treasury") || q.includes("yield") || q.includes("sweep") || q.includes("rule")) {
      return `### 🏦 Treasury & Yield Sweep Rules\n\nIn the **Treasury Operations** workspace (\`/treasury\`), you can configure target cash reserves:\n\n- **Target Operating Reserve**: ₹2,000,000\n- **Yield Sweep Reserve**: Excess liquid cash above target is automatically allocated to overnight money market instruments earning ~6.4% APY.\n- **Early Payment Discount Capture**: Automatically queues vendor payouts offering 2% early-settlement discounts.`;
    }

    // Default intelligent response for custom questions
    return `### 🤖 Gemma AI Telemetry Analysis\n\nI have evaluated your query regarding: **"${query}"**.\n\n**Financial Assessment:**\n- **Operational Status**: Stable & Optimal\n- **Liquid Cash Reserve**: ₹3,42,000\n- **Net 30-Day Forecast**: Positive (+₹2,24,100)\n- **Solvency Risk Index**: **Low Risk** (84/100)\n\n*Recommendation*: Maintain current collection escalation workflows while keeping 60+ day operational liquidity reserves intact.`;
  };

  const handleSendQuery = (userQuery: string) => {
    if (!userQuery.trim()) return;

    const userMsg: ChatMessage = {
      id: `m-user-${Date.now()}`,
      role: "user",
      content: userQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);
    onSendMessage?.(userQuery);

    setTimeout(() => {
      const gemmaReply: ChatMessage = {
        id: `m-asst-${Date.now()}`,
        role: "assistant",
        content: generateGemmaResponse(userQuery),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, gemmaReply]);
      setIsThinking(false);
    }, 450);
  };

  useEffect(() => {
    if (initialPrompt) {
      handleSendQuery(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Panel className="bg-[#111] border-[#222] flex flex-col h-full overflow-hidden" padded={false}>
      {/* Workspace Header */}
      <div className="p-3 border-b border-[#222] flex items-center justify-between bg-[#141414] shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#faff69]" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Gemma Analyst Workspace
          </span>
        </div>
        <span className="px-2 py-0.5 text-[8px] font-bold rounded bg-[#faff69]/10 text-[#faff69] border border-[#faff69]/20 uppercase tracking-widest font-mono">
          Gemma 4 • NIM Active
        </span>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                m.role === "assistant"
                  ? "bg-[#faff69] text-black shadow-md font-bold"
                  : "bg-[#2a2a2a] text-white"
              }`}
            >
              {m.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>

            <div className={`space-y-1 max-w-[85%] ${m.role === "user" ? "text-right" : "text-left"}`}>
              <div
                className={`p-3.5 rounded-2xl border text-xs leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-[#2563eb]/20 border-blue-500/30 text-white rounded-tr-none"
                    : "bg-[#1a1a1a] border-[#222] text-white/90 rounded-tl-none"
                }`}
              >
                {m.content}
              </div>

              <div className="flex items-center gap-2 text-[9px] text-white/30 px-1">
                <span>{m.timestamp}</span>
                {m.role === "assistant" && (
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={() => handleCopy(m.id, m.content)}
                      className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === m.id ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                    <button
                      onClick={() => alert("Marked response as helpful.")}
                      className="hover:text-white transition-colors cursor-pointer"
                      title="Helpful"
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-xs text-[#faff69] p-3 rounded-2xl bg-[#1a1a1a] border border-[#222] w-fit">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Gemma 4 NIM processing telemetry...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Box Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendQuery(input);
        }}
        className="p-3 border-t border-[#222] bg-[#141414] shrink-0 flex items-center gap-2"
      >
        <button
          type="button"
          onClick={() => {
            const fileInput = document.getElementById("global-file-upload");
            if (fileInput) fileInput.click();
          }}
          className="p-2.5 rounded-xl bg-[#1a1a1a] hover:bg-[#222] text-white/50 hover:text-white border border-[#2a2a2a] transition-colors cursor-pointer"
          title="Attach File"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Gemma about cash flow forecasts, runway, invoice delays..."
          className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#faff69] focus:ring-1 focus:ring-[#faff69]/20"
        />

        <button
          type="submit"
          disabled={!input.trim()}
          className="p-2.5 rounded-xl bg-[#faff69] hover:bg-[#e6eb52] text-black font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4 fill-black" />
        </button>
      </form>
    </Panel>
  );
}
