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

import { useDocumentStatusStore } from "@/shared/stores/document-status.store";

const welcomeNormal = {
  id: "welcome",
  role: "assistant" as const,
  content: "Hello! I'm **FORGE-PATH**, your AI Financial Copilot.\n\nI have full context on your cash flow, liquidity, outstanding invoices, and payment obligations. Ask me anything about your manufacturing SME's financial health.",
  timestamp: new Date().toISOString(),
};

const welcomeEmpty = {
  id: "welcome",
  role: "assistant" as const,
  content: "No context available.",
  timestamp: new Date().toISOString(),
};

export const useCopilotStore = create<CopilotStore>((set, get) => ({
  messages: [
    typeof window !== "undefined" && useDocumentStatusStore.getState().uploadedCount > 0
      ? welcomeNormal
      : welcomeEmpty
  ],
  isStreaming: false,
  isThinking: false,
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, { ...msg, id: generateId(), timestamp: new Date().toISOString() }] })),
  setStreaming: (v) => set({ isStreaming: v }),
  setThinking: (v) => set({ isThinking: v }),
  clearMessages: () => set((s) => ({
    messages: [
      typeof window !== "undefined" && useDocumentStatusStore.getState().uploadedCount > 0
        ? welcomeNormal
        : welcomeEmpty
    ],
    isStreaming: false,
    isThinking: false
  })),
  updateLastMessage: (content) => set((s) => {
    const msgs = [...s.messages];
    if (msgs.length > 0) msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], content };
    return { messages: msgs };
  }),
}));

if (typeof window !== "undefined") {
  useDocumentStatusStore.subscribe((state) => {
    const msgs = useCopilotStore.getState().messages;
    const hasWelcome = msgs.some((m) => m.id === "welcome");
    if (state.uploadedCount > 0) {
      if (hasWelcome) {
        useCopilotStore.setState({
          messages: msgs.map((m) => m.id === "welcome" ? { ...m, content: welcomeNormal.content } : m)
        });
      }
    } else {
      if (hasWelcome) {
        useCopilotStore.setState({
          messages: msgs.map((m) => m.id === "welcome" ? { ...m, content: welcomeEmpty.content } : m)
        });
      }
    }
  });
}
