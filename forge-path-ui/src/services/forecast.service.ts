import api from "@/lib/api-client";
import type { ForecastData, ForecastPoint, Anomaly } from "@/types";

export const forecastService = {
  async getForecast(period: "7d" | "30d" | "90d"): Promise<ForecastData> {
    const { data } = await api.get<ForecastData>(`/api/v1/cashflow/forecast?period=${period}`);
    return data;
  },
  async getTimeSeries(period: "7d" | "30d" | "90d"): Promise<ForecastPoint[]> {
    const { data } = await api.get<ForecastPoint[]>(`/api/v1/cashflow/timeseries?period=${period}`);
    return data;
  },
  async getAnomalies(): Promise<Anomaly[]> {
    const { data } = await api.get<Anomaly[]>("/api/v1/cashflow/anomalies");
    return data;
  },
  async exportForecast(period: string, format: "pdf" | "csv" | "excel"): Promise<Blob> {
    const { data } = await api.get(`/api/v1/cashflow/export?period=${period}&format=${format}`, { responseType: "blob" });
    return data;
  },
};
