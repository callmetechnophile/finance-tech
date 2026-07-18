import api from "@/lib/api-client";
import type { Invoice, InvoiceDetail } from "@/types";

export const collectionsService = {
  async getInvoices(params?: { priority?: string; status?: string; search?: string }): Promise<Invoice[]> {
    const { data } = await api.get<Invoice[]>("/api/v1/collections/invoices", { params });
    return data;
  },
  async getInvoiceDetail(id: string): Promise<InvoiceDetail> {
    const { data } = await api.get<InvoiceDetail>(`/api/v1/collections/invoices/${id}`);
    return data;
  },
  async sendReminder(id: string, channel: "email" | "sms" | "whatsapp"): Promise<void> {
    await api.post(`/api/v1/collections/invoices/${id}/remind`, { channel });
  },
  async escalate(id: string): Promise<void> {
    await api.post(`/api/v1/collections/invoices/${id}/escalate`);
  },
  async generateReport(): Promise<Blob> {
    const { data } = await api.get("/api/v1/collections/report", { responseType: "blob" });
    return data;
  },
};
