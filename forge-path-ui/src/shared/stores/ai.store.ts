import { create } from "zustand";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AIState {
  isAiPanelCollapsed: boolean;
  conversations: Message[];
  isStreaming: boolean;
  streamingText: string;
  setAiPanelCollapsed: (c: boolean) => void;
  addMessage: (m: Message) => void;
  setStreaming: (s: boolean) => void;
  setStreamingText: (t: string) => void;
  clearSession: () => void;
}

export const useAIStore = create<AIState>((set) => ({
  isAiPanelCollapsed: false,
  // Default greeting has no hardcoded name — will be updated after login
  conversations: [
    { id: "1", role: "assistant", content: "Hello. How can I assist you today?" }
  ],
  isStreaming: false,
  streamingText: "",
  setAiPanelCollapsed: (isAiPanelCollapsed) => set({ isAiPanelCollapsed }),
  addMessage: (m) => set((s) => ({ conversations: [...s.conversations, m] })),
  setStreaming: (isStreaming) => set({ isStreaming }),
  setStreamingText: (streamingText) => set({ streamingText }),
  clearSession: () => set({
    conversations: [{ id: "new", role: "assistant", content: "Hello. How can I assist you today?" }],
    isStreaming: false,
    streamingText: "",
  }),
}));
