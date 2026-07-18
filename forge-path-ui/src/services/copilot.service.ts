import api from "@/lib/api-client";
import type { CopilotMessage } from "@/types";

export const copilotService = {
  async sendMessage(message: string, history: CopilotMessage[]): Promise<{ response: string }> {
    const { data } = await api.post("/api/v1/copilot/chat", {
      message,
      history: history.slice(-10).map((m) => ({ role: m.role, content: m.content })),
    });
    return data;
  },
  async clearHistory(): Promise<void> {
    await api.delete("/api/v1/copilot/history");
  },
};
