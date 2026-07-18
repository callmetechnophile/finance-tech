import api from "@/lib/api-client";
import type { LiquidityMetrics, StressScenario } from "@/types";

export const liquidityService = {
  async getMetrics(): Promise<LiquidityMetrics> {
    const { data } = await api.get<LiquidityMetrics>("/api/v1/liquidity/metrics");
    return data;
  },
  async getStressScenarios(): Promise<StressScenario[]> {
    const { data } = await api.get<StressScenario[]>("/api/v1/liquidity/stress-tests");
    return data;
  },
  async runStressTest(scenario: string): Promise<StressScenario> {
    const { data } = await api.post<StressScenario>("/api/v1/liquidity/stress-test", { scenario });
    return data;
  },
};
