import api from "@/lib/api-client";

export interface PayoutItem {
  id: string;
  vendor: string;
  amount: number;
  due_date: string;
  priority: "High" | "Medium" | "Low";
  discountOpportunity: string | null;
  penaltyRisk: string | null;
  status: string;
}

export const paymentsService = {
  async getQueue(): Promise<PayoutItem[]> {
    const { data } = await api.get<PayoutItem[]>("/api/v1/payments/queue");
    return data;
  },
  async payNow(id: string): Promise<void> {
    await api.post(`/api/v1/payments/${id}/pay`);
  },
  async delay(id: string, days: number): Promise<void> {
    await api.post(`/api/v1/payments/${id}/delay`, { days });
  },
};
