import api from "@/lib/api-client";
import type { Payment } from "@/types";

export const paymentsService = {
  async getQueue(): Promise<Payment[]> {
    const { data } = await api.get<Payment[]>("/api/v1/payments/queue");
    return data;
  },
  async payNow(id: string): Promise<void> {
    await api.post(`/api/v1/payments/${id}/pay`);
  },
  async delay(id: string, days: number): Promise<void> {
    await api.post(`/api/v1/payments/${id}/delay`, { days });
  },
  async approve(id: string): Promise<void> {
    await api.post(`/api/v1/payments/${id}/approve`);
  },
};
