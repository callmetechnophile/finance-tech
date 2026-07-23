export interface SearchRecord {
  id: string;
  type: "Invoice" | "Customer" | "Vendor" | "Report" | "Document";
  title: string;
  subtitle: string;
  metadata?: string;
  path: string;
}

const mockSearchDatabase: SearchRecord[] = [];

export const searchMockDatabase = (query: string): SearchRecord[] => {
  if (!query.trim()) return [];
  const lowercase = query.toLowerCase();
  
  return mockSearchDatabase.filter(
    (item) =>
      item.title.toLowerCase().includes(lowercase) ||
      item.subtitle.toLowerCase().includes(lowercase) ||
      (item.metadata && item.metadata.toLowerCase().includes(lowercase))
  );
};
