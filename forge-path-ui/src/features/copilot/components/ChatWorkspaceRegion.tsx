"use client";

import React, { useState, useMemo } from "react";
import { Bot, User, Send, Paperclip, Sparkles, Copy, ThumbsUp, RefreshCw } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { useSessionStore } from "@/shared/stores/session.store";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatWorkspaceRegionProps {
  initialMessages?: ChatMessage[];
  onSendMessage?: (msg: string) => void;
}

export function ChatWorkspaceRegion({
  initialMessages,
  onSendMessage,
}: ChatWorkspaceRegionProps) {
  const [input, setInput] = useState("");
  const { user, isAuthenticated } = useSessionStore();

  // Build session-aware default greeting — never hardcoded
  const defaultMessages = useMemo<ChatMessage[]>(() => {
    const name = isAuthenticated && user?.name ? user.name.split(" ")[0] : null;
    const greeting = name
      ? `Hello ${name}! I'm FORGE-PATH **AI Financial Copilot**.\n\nI'm ready to assist you with cash flow analysis, forecasting, and financial strategy. What would you like to explore today?`
      : `Hello! I'm FORGE-PATH **AI Financial Copilot**.\n\nPlease sign in to access your personalized financial insights and workspace data.`;
    return [
      {
        id: "m1",
        role: "assistant" as const,
        content: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];
  }, [isAuthenticated, user?.name]); // eslint-disable-line react-hooks/exhaustive-deps

  const [messages, setMessages] = useState<ChatMessage[]>(
    initialMessages || defaultMessages
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    onSendMessage?.(input);
    setInput("");

    // Simulate assistant reply
    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: `m-resp-${Date.now()}`,
        role: "assistant",
        content: `I've analyzed your query regarding: "${input}".\n\n**Financial Assessment**: NeonDB transaction tables show healthy liquidity margin. All parameters remain within approved CFO risk bounds.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }, 600);
  };

  return (
    <Panel className="bg-[#111] border-[#222] flex flex-col h-full overflow-hidden" padded={false}>
      {/* Header Bar */}
      <div className="p-3 border-b border-[#222] flex items-center justify-between bg-[#141414] shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#faff69] animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Gemma 4 Virtual CFO Workspace
          </span>
        </div>
        <span className="px-2 py-0.5 text-[8px] font-bold rounded bg-[#faff69]/10 text-[#faff69] border border-[#faff69]/20 uppercase tracking-widest font-mono">
          NVIDIA NIM • 145ms
        </span>
      </div>

      {/* Message Stream */}
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

            <div className={`space-y-1 max-w-[80%] ${m.role === "user" ? "text-right" : "text-left"}`}>
              <div
                className={`p-3 rounded-2xl border text-xs leading-relaxed whitespace-pre-wrap ${
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
                  <div className="flex items-center gap-1.5 ml-auto">
                    <button
                      onClick={() => alert("Copied response to clipboard.")}
                      className="hover:text-white transition-colors"
                      title="Copy"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => alert("Marked response as helpful.")}
                      className="hover:text-white transition-colors"
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
      </div>

      {/* Input Control Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-[#222] bg-[#141414] shrink-0 flex items-center gap-2">
        <button
          type="button"
          onClick={() => alert("Attached file: Apex_Steel_Invoice_89.pdf to conversation context.")}
          className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222] text-white/50 hover:text-white border border-[#2a2a2a] transition-colors cursor-pointer"
          title="Attach File"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Gemma about cash flow forecasts, runway, invoice delays, yield sweeps..."
          className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#faff69] focus:ring-1 focus:ring-[#faff69]/20"
        />

        <button
          type="submit"
          disabled={!input.trim()}
          className="p-2 rounded-lg bg-[#faff69] hover:bg-[#e6eb52] text-black font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4 fill-black" />
        </button>
      </form>
    </Panel>
  );
}
