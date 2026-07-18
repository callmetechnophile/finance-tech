"use client";

import { useState, useRef, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Bot, Send, User } from "lucide-react";
import { useCopilotStore } from "@/store/copilot.store";

export default function CopilotPage() {
  const { messages, addMessage, isThinking, setThinking } = useCopilotStore();
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    addMessage({ role: "user", content: input });
    setInput("");
    setThinking(true);

    setTimeout(() => {
      addMessage({
        role: "assistant",
        content: "I have reviewed your cash reserves and forecasted inflows. Based on current receivables, your daily burn rate of **$5,000** gives you **68 days** of runway. Escalate outstanding payments from **Apex Steel** immediately to lock in projected values.",
      });
      setThinking(false);
    }, 1200);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-72px)] bg-[#0a0a0a]">
        
        {/* Messages viewport */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 max-w-4xl mx-auto w-full">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-6 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "assistant" && (
                <div className="w-8 h-8 rounded-md bg-[#faff69] flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4.5 h-4.5 text-[#0a0a0a]" />
                </div>
              )}
              
              <div className={`p-4 rounded-lg max-w-xl text-sm ${
                m.role === "user" ? "bg-[#faff69] text-[#0a0a0a] font-semibold" : "bg-[#1a1a1a] border border-[#2a2a2a] text-white"
              }`}>
                {m.content}
              </div>

              {m.role === "user" && (
                <div className="w-8 h-8 rounded-md bg-[#2a2a2a] flex items-center justify-center flex-shrink-0 border border-[#3a3a3a]">
                  <User className="w-4.5 h-4.5 text-white" />
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-6">
              <div className="w-8 h-8 rounded-md bg-[#faff69] flex items-center justify-center">
                <Bot className="w-4.5 h-4.5 text-[#0a0a0a]" />
              </div>
              <div className="p-4 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#faff69] rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-[#faff69] rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-[#faff69] rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input box */}
        <div className="p-6 border-t border-[#2a2a2a] bg-[#1a1a1a]/50">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-7">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Copilot about receivables speed, runway dip warnings, or early pay discounts..."
              className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md px-4 text-xs text-white focus:outline-none focus:border-[#faff69]"
            />
            <button type="submit" className="btn-primary h-10 px-5">
              <Send className="w-4 h-4 mr-1.5" /> Ask
            </button>
          </form>
        </div>

      </div>
    </AppShell>
  );
}
