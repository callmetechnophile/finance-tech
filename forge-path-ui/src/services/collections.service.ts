import api from "@/lib/api-client";

export interface Invoice {
  id: string;
  invoice_number: string;
  customer: string;
  amount: number;
  outstanding: number;
  days_overdue: number;
  priority: "Critical" | "High" | "Medium" | "Low";
  risk: "High" | "Medium" | "Low";
  status: string;
  emailDraft: string;
  smsDraft: string;
}

export const collectionsService = {
  async getInvoices(params?: { priority?: string; status?: string; search?: string }): Promise<Invoice[]> {
    const { data } = await api.get<Invoice[]>("/api/v1/collections/invoices", { params });
    return data;
  },
  async sendReminder(id: string, channel: "email" | "sms" | "whatsapp"): Promise<void> {
    await api.post(`/api/v1/collections/invoices/${id}/remind`, { channel });
  },
  async generateReport(): Promise<Blob> {
    const { data } = await api.get("/api/v1/collections/report", { responseType: "blob" });
    return data;
  },
};
