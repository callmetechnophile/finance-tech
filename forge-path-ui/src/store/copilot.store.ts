import { create } from "zustand";
import type { CopilotMessage } from "@/types";
import { generateId } from "@/lib/utils";

interface CopilotStore {
  messages: CopilotMessage[];
  isStreaming: boolean;
  isThinking: boolean;
  addMessage: (msg: Omit<CopilotMessage, "id" | "timestamp">) => void;
  setStreaming: (v: boolean) => void;
  setThinking: (v: boolean) => void;
  clearMessages: () => void;
  updateLastMessage: (content: string) => void;
}

export const useCopilotStore = create<CopilotStore>((set, get) => ({
  messages: [
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm **FORGE-PATH**, your AI Financial Copilot.\n\nI have full context on your cash flow, liquidity, outstanding invoices, and payment obligations. Ask me anything about your manufacturing SME's financial health.",
      timestamp: new Date().toISOString(),
    },
  ],
  isStreaming: false,
  isThinking: false,
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, { ...msg, id: generateId(), timestamp: new Date().toISOString() }] })),
  setStreaming: (v) => set({ isStreaming: v }),
  setThinking: (v) => set({ isThinking: v }),
  clearMessages: () => set({ messages: [], isStreaming: false, isThinking: false }),
  updateLastMessage: (content) => set((s) => {
    const msgs = [...s.messages];
    if (msgs.length > 0) msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], content };
    return { messages: msgs };
  }),
}));
