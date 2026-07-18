import api from "@/lib/api-client";
import type { Document } from "@/types";

export const documentsService = {
  async upload(file: File, onProgress?: (pct: number) => void): Promise<Document> {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post<Document>("/api/v1/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => { if (e.total) onProgress?.(Math.round((e.loaded * 100) / e.total)); },
    });
    return data;
  },
  async list(params?: { status?: string; type?: string; search?: string }): Promise<Document[]> {
    const { data } = await api.get<Document[]>("/api/v1/documents", { params });
    return data;
  },
  async getStatus(id: string): Promise<Document> {
    const { data } = await api.get<Document>(`/api/v1/documents/${id}`);
    return data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/api/v1/documents/${id}`);
  },
};
