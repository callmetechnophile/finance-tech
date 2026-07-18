export interface SearchRecord {
  id: string;
  type: "Invoice" | "Customer" | "Vendor" | "Report" | "Document";
  title: string;
  subtitle: string;
  metadata?: string;
  path: string;
}

const mockSearchDatabase: SearchRecord[] = [
  // Invoices
  { id: "inv-1", type: "Invoice", title: "INV-2024-089 (Apex Steel Works)", subtitle: "$47,500 Outstanding • 45 days overdue", metadata: "L3 Escalation", path: "/collections" },
  { id: "inv-2", type: "Invoice", title: "INV-2024-094 (Vanguard Machining)", subtitle: "$28,000 Outstanding • 18 days overdue", metadata: "L1 Reminder", path: "/collections" },
  { id: "inv-3", type: "Invoice", title: "INV-2024-074 (Delta Fabrication)", subtitle: "$22,000 Paid • Fully Settled", metadata: "Completed", path: "/collections" },
  
  // Customers
  { id: "cust-1", type: "Customer", title: "Apex Steel Works", subtitle: "Total Solvency balance: $47,500 overdue", metadata: "Credit Score: 68/100", path: "/collections" },
  { id: "cust-2", type: "Customer", title: "Vanguard Machining", subtitle: "Total Solvency balance: $28,000 overdue", metadata: "Credit Score: 78/100", path: "/collections" },
  { id: "cust-3", type: "Customer", title: "Delta Fabrication", subtitle: "Total Solvency balance: $0", metadata: "Credit Score: 84/100", path: "/collections" },
  
  // Vendors
  { id: "vend-1", type: "Vendor", title: "Iron Ore Supply Inc.", subtitle: "Queued AP: $45,000 due tomorrow (2/10 Net 30)", metadata: "Critical Supplier", path: "/treasury" },
  { id: "vend-2", type: "Vendor", title: "Amada Machinery Leasing", subtitle: "Queued AP: $12,000 due July 25", metadata: "Standard Lease", path: "/treasury" },
  
  // Reports
  { id: "rep-1", type: "Report", title: "Q3 Board Meeting Presentation", subtitle: "Generated July 18, 2026 by Alexander Miller", metadata: "PDF Export Ready", path: "/reports" },
  { id: "rep-2", type: "Report", title: "July Solvency & Cash Runway Audit Log", subtitle: "Generated July 14, 2026", metadata: "Excel Export Ready", path: "/reports" },

  // Documents Ingestion queue
  { id: "doc-1", type: "Document", title: "Apex_Steel_Invoice_89.pdf", subtitle: "Size: 1.4 MB • Status: Extracted", metadata: "NeonDB Sync Completed", path: "/documents" },
  { id: "doc-2", type: "Document", title: "CNC_Maintenance_Bill_July.xlsx", subtitle: "Size: 320 KB • Status: Extracted", metadata: "NeonDB Sync Completed", path: "/documents" },
  { id: "doc-3", type: "Document", title: "Laser_Cutting_Job_Work_Ledger.png", subtitle: "Size: 2.1 MB • Status: Review Required", metadata: "OCR OCR Anomaly", path: "/documents" },
];

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
