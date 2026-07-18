import { useAIStore } from "@/shared/stores/ai.store";
export default function useAI() {
  const store = useAIStore();
  return {
    isAiPanelCollapsed: store.isAiPanelCollapsed,
    conversations: store.conversations,
    isStreaming: store.isStreaming,
    streamingText: store.streamingText,
    setAiPanelCollapsed: store.setAiPanelCollapsed,
    addMessage: store.addMessage,
    setStreaming: store.setStreaming,
    setStreamingText: store.setStreamingText,
  };
}
