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

export const useCopilotStore = create<CopilotStore>((set) => ({
  messages: [
    {
      id: "welcome",
      role: "assistant",
      content: "Waiting for financial context.",
      timestamp: new Date().toISOString(),
    },
  ],
  isStreaming: false,
  isThinking: false,
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, { ...msg, id: generateId(), timestamp: new Date().toISOString() }] })),
  setStreaming: (v) => set({ isStreaming: v }),
  setThinking: (v) => set({ isThinking: v }),
  clearMessages: () => set({
    messages: [
      {
        id: "welcome",
        role: "assistant",
        content: "Waiting for financial context.",
        timestamp: new Date().toISOString(),
      },
    ],
    isStreaming: false,
    isThinking: false,
  }),
  updateLastMessage: (content) => set((s) => {
    const msgs = [...s.messages];
    if (msgs.length > 0) msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], content };
    return { messages: msgs };
  }),
}));
