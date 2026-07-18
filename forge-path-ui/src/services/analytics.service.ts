import api from "@/lib/api-client";

export interface AnalyticsMetric {
  name: string;
  value: number;
  change: number;
  status: "up" | "down" | "stable";
}

export const analyticsService = {
  async getMetrics(period: "1m" | "3m" | "6m" | "1y" = "3m"): Promise<AnalyticsMetric[]> {
    const { data } = await api.get<AnalyticsMetric[]>(`/api/v1/analytics/metrics?period=${period}`);
    return data;
  },
  async exportReport(format: "pdf" | "csv" | "excel"): Promise<Blob> {
    const { data } = await api.get(`/api/v1/analytics/export?format=${format}`, { responseType: "blob" });
    return data;
  },
};
