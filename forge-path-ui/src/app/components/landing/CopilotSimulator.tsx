"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "./useInView";
import { Bot, User, Send, ChevronRight } from "lucide-react";

export default function CopilotSimulator() {
  const [chatState, setChatState] = useState<"idle" | "userTyping" | "botThinking" | "botTyping" | "finished">("idle");
  const [userText, setUserText] = useState("");
  const [botText, setBotText] = useState("");

  const userPrompt = "Which customers should I follow up today?";
  const botResponse = "Analyzing outstanding invoices and payment trends. Here are the top collections priorities for today based on payment risk:";

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const runChatSimulation = () => {
    if (chatState !== "idle") return;
    setChatState("userTyping");
    setUserText("");
    setBotText("");

    // Simulate user typing (1s)
    let charIdx = 0;
    const userInterval = setInterval(() => {
      if (charIdx < userPrompt.length) {
        setUserText((prev) => prev + userPrompt[charIdx]);
        charIdx++;
      } else {
        clearInterval(userInterval);
        setChatState("botThinking");
        // Simulate bot thinking (1.5s)
        setTimeout(() => {
          setChatState("botTyping");
        }, 1500);
      }
    }, 30);
  };

  useEffect(() => {
    if (inView && chatState === "idle") {
      runChatSimulation();
    }
  }, [inView, chatState]);

  // Simulate bot response typing
  useEffect(() => {
    if (chatState !== "botTyping") return;

    let charIdx = 0;
    const botInterval = setInterval(() => {
      if (charIdx < botResponse.length) {
        setBotText((prev) => prev + botResponse[charIdx]);
        charIdx++;
      } else {
        clearInterval(botInterval);
        setChatState("finished");
      }
    }, 20);

    return () => clearInterval(botInterval);
  }, [chatState]);

  const followUpList = [
    { name: "Apex Steel & Wire", risk: "CRITICAL", amount: "$47,500", trend: "+18 days delay" },
    { name: "Delta Fabrication", risk: "HIGH", amount: "$28,000", trend: "+10 days delay" },
    { name: "Sigma Electronics", risk: "MEDIUM", amount: "$12,400", trend: "+4 days delay" },
  ];

  return (
    <section ref={ref} className="relative min-h-screen bg-[#0b0e11] flex flex-col justify-center items-center overflow-hidden px-6 py-20 select-none border-t border-[#2b3139]">
      {/* Title */}
      <div className="relative z-10 text-center max-w-2xl mx-auto space-y-4 mb-16">
        <h2 className="text-[#fcd535] uppercase text-xs tracking-widest font-bold">
          Chapter 7: Virtual CFO Copilot
        </h2>
        <h3 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight">
          Conversational Intelligence
        </h3>
        <p className="text-[#eaecef] text-sm md:text-base max-w-lg mx-auto">
          Query the AI Copilot to run cash simulations, list risky invoices, and generate collections notifications.
        </p>
      </div>

      {/* Chat Simulator Console */}
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#1e2329] border border-[#2b3139] p-6 shadow-2xl flex flex-col gap-6 z-10 min-h-[460px] justify-between text-left">
        {/* Chat Messages */}
        <div className="flex-1 space-y-5 overflow-y-auto max-h-[300px]">
          {/* User Message */}
          {(chatState === "userTyping" || chatState !== "idle") && (
            <div className="flex gap-4 items-start max-w-xl">
              <div className="w-8 h-8 rounded-lg bg-[#0b0e11] flex items-center justify-center text-[#707a8a]">
                <User className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0b0e11] text-xs font-semibold text-white">
                {userText}
              </div>
            </div>
          )}

          {/* Bot Message */}
          {chatState === "botThinking" && (
            <div className="flex gap-4 items-start max-w-xl">
              <div className="w-8 h-8 rounded-lg bg-[#fcd535]/10 border border-[#fcd535]/20 flex items-center justify-center text-[#fcd535]">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-[#2b3139] text-xs text-[#707a8a] italic flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#707a8a] animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#707a8a] animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#707a8a] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          {botText && (
            <div className="flex gap-4 items-start max-w-2xl">
              <div className="w-8 h-8 rounded-lg bg-[#fcd535]/10 border border-[#fcd535]/20 flex items-center justify-center text-[#fcd535]">
                <Bot className="w-4 h-4" />
              </div>
              <div className="space-y-4 flex-1">
                <div className="p-3.5 rounded-2xl bg-[#0b0e11] border border-[#2b3139] text-xs leading-relaxed text-white font-medium">
                  {botText}
                </div>

                {/* Follow Up List */}
                {chatState === "finished" && (
                  <div className="space-y-2">
                    {followUpList.map((customer, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-[#2b3139] bg-[#0b0e11] flex items-center justify-between hover:border-[#fcd535]/30 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                            customer.risk === "CRITICAL" ? "bg-red-500/10 text-red-400" :
                            customer.risk === "HIGH" ? "bg-orange-500/10 text-orange-400" : "bg-yellow-500/10 text-yellow-400"
                          }`}>
                            {customer.risk}
                          </span>
                          <span className="text-xs font-bold text-white group-hover:text-[#fcd535] transition-colors">{customer.name}</span>
                        </div>
                        <div className="flex items-center gap-4 text-right">
                          <div className="text-right">
                            <span className="block text-xs font-bold text-white font-mono">{customer.amount}</span>
                            <span className="block text-[9px] text-[#707a8a] font-semibold">{customer.trend}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#707a8a] group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="border-t border-[#2b3139] pt-4 flex gap-3 items-center">
          <input
            disabled
            type="text"
            placeholder={chatState === "finished" ? "Ask another question..." : "AI Copilot is processing..."}
            className="flex-1 bg-[#0b0e11] border border-[#2b3139] rounded-xl px-4 py-3 text-xs text-white placeholder-[#707a8a] focus:outline-none"
          />
          <button
            onClick={() => { setChatState("idle"); runChatSimulation(); }}
            className="p-3 rounded-xl bg-[#fcd535] hover:bg-[#f0b90b] text-[#181a20] font-bold transition-all cursor-pointer shadow-lg shadow-[#fcd535]/5"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
