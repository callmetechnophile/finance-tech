"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Bot, User, Send, Trash2, Download, Terminal, Sparkles } from "lucide-react";
import { useCopilotStore } from "@/store/copilot.store";
import { toast } from "sonner";

export default function CopilotPage() {
  const { messages, addMessage, clearMessages } = useCopilotStore();
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const suggestions = [
    "Can I buy another CNC Machine?",
    "Why is my liquidity dropping?",
    "Which customer impacts cash flow the most?",
    "Optimize this month's payments."
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    addMessage({ role: "user", content: text });
    setInput("");
    setIsThinking(true);
    
    // Simulate AI thinking and streaming response
    setTimeout(() => {
      let aiResponse = "";
      if (text.includes("CNC")) {
        aiResponse = "Based on your projected 90-day cash buffer of **$342,000**, you can afford the CNC lease down payment of **$45,000**. However, doing so will reduce your cash runway from **68 to 59 days**, which is still above your safe limit of **45 days**.";
      } else if (text.includes("liquidity")) {
        aiResponse = "Your liquidity score dropped from **88 to 84** due to a **$12,000** raw material price increase and an extended collection period from **Apex Steel Works**.";
      } else {
        aiResponse = "I have scanned the active receivables and payables accounts. I recommend prioritizing collection on invoice **INV-2024-089** ($47,500) and delaying the **Precision Tooling Corp** payable to maximize runway.";
      }
      
      addMessage({ role: "assistant", content: aiResponse });
      setIsThinking(false);
      toast.success("AI advisor response received.");
    }, 1500);
  };

  const handleExport = () => {
    toast.success("Conversation history exported as PDF.");
  };

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-4rem)] max-w-7xl mx-auto">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0B1220]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#1f2d44] flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-500" />
              <h3 className="text-sm font-semibold text-white">FORGE-PATH AI Advisory</h3>
            </div>
            <div className="flex gap-2">
              <button onClick={handleExport} className="p-2 hover:bg-[#1a2235] text-[#6B7280] hover:text-white rounded-xl transition-all" title="Export Chat">
                <Download className="w-4 h-4" />
              </button>
              <button onClick={clearMessages} className="p-2 hover:bg-[#1a2235] text-[#6B7280] hover:text-white rounded-xl transition-all" title="Clear Chat">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-4 ${m.role === "user" ? "justify-end" : ""}`}>
                {m.role === "assistant" && (
                  <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-blue-400" />
                  </div>
                )}
                
                <div className={`p-4 rounded-2xl max-w-xl text-xs leading-relaxed ${
                  m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-[#111827] border border-[#1f2d44] text-[#9CA3AF]"
                }`}>
                  <p className="font-medium whitespace-pre-wrap">{m.content}</p>
                </div>

                {m.role === "user" && (
                  <div className="w-8 h-8 rounded-lg bg-[#111827] border border-[#1f2d44] flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 animate-pulse">
                  <Bot className="w-4 h-4 text-blue-400" />
                </div>
                <div className="p-4 rounded-2xl bg-[#111827] border border-[#1f2d44] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>

          {/* Suggestions Bar */}
          <div className="px-6 py-2 flex flex-wrap gap-2 flex-shrink-0">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                className="px-3 py-1.5 rounded-full bg-[#111827] border border-[#1f2d44] hover:border-blue-500/50 hover:bg-[#1a2235] text-[10px] text-[#9CA3AF] hover:text-white transition-all cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input Panel */}
          <div className="p-6 border-t border-[#1f2d44] flex-shrink-0">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSend(input); }}
                placeholder="Ask FORGE-PATH about your cash flow or run scenario models..."
                className="w-full pl-4 pr-12 py-3 bg-[#111827] border border-[#1f2d44] rounded-xl text-xs text-white focus:outline-none focus:border-blue-600 transition-colors"
              />
              <button
                onClick={() => handleSend(input)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
