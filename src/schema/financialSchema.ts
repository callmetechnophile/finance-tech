export interface EntityDetail {
  name: string;
  tax_id?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface AmountDetail {
  subtotal: number;
  discount?: number;
  tax_amount: number;
  total_amount: number;
}

export interface TaxItem {
  tax_type: string;
  rate: number;
  amount: number;
}

export interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  part_number?: string;
}

export interface SourceDocument {
  file_name: string;
  file_hash: string;
  storage_url: string;
}

export interface StandardFinancialRecord {
  document_type: 'INVOICE' | 'PURCHASE_ORDER' | 'BILL' | 'DELIVERY_CHALLAN' | 'BANK_STATEMENT' | 'LEDGER_ENTRY' | 'UNKNOWN';
  transaction_type: 'DEBIT' | 'CREDIT' | 'NEUTRAL';
  vendor: EntityDetail;
  customer: EntityDetail;
  invoice_number?: string | null;
  purchase_order_number?: string | null;
  amount: AmountDetail;
  tax_details?: TaxItem[];
  currency: string;
  issue_date: string; // YYYY-MM-DD
  due_date?: string | null; // YYYY-MM-DD
  payment_terms?: string | null;
  category: string;
  payment_status: 'PAID' | 'UNPAID' | 'PARTIALLY_PAID' | 'OVERDUE' | 'UNKNOWN';
  line_items?: LineItem[];
  source_document: SourceDocument;
  confidence_score: number; // 0.0 to 1.0
  validation_status: 'VALID' | 'QUARANTINED';
}

export const financialSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "StandardizedFinancialRecord",
  type: "object",
  properties: {
    document_type: {
      type: "string",
      enum: ["INVOICE", "PURCHASE_ORDER", "BILL", "DELIVERY_CHALLAN", "BANK_STATEMENT", "LEDGER_ENTRY", "UNKNOWN"]
    },
    transaction_type: {
      type: "string",
      enum: ["DEBIT", "CREDIT", "NEUTRAL"]
    },
    vendor: {
      type: "object",
      properties: {
        name: { type: "string" },
        tax_id: { type: "string" },
        address: { type: "string" },
        phone: { type: "string" },
        email: { type: "string" }
      },
      required: ["name"]
    },
    customer: {
      type: "object",
      properties: {
        name: { type: "string" },
        tax_id: { type: "string" },
        address: { type: "string" },
        phone: { type: "string" },
        email: { type: "string" }
      },
      required: ["name"]
    },
    invoice_number: { type: ["string", "null"] },
    purchase_order_number: { type: ["string", "null"] },
    amount: {
      type: "object",
      properties: {
        subtotal: { type: "number" },
        discount: { type: "number" },
        tax_amount: { type: "number" },
        total_amount: { type: "number" }
      },
      required: ["subtotal", "tax_amount", "total_amount"]
    },
    tax_details: {
      type: "array",
      items: {
        type: "object",
        properties: {
          tax_type: { type: "string" },
          rate: { type: "number" },
          amount: { type: "number" }
        },
        required: ["tax_type", "rate", "amount"]
      }
    },
    currency: { type: "string", pattern: "^[A-Z]{3}$" },
    issue_date: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
    due_date: { type: ["string", "null"], pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
    payment_terms: { type: ["string", "null"] },
    category: { type: "string" },
    payment_status: {
      type: "string",
      enum: ["PAID", "UNPAID", "PARTIALLY_PAID", "OVERDUE", "UNKNOWN"]
    },
    line_items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          description: { type: "string" },
          quantity: { type: "number" },
          unit_price: { type: "number" },
          total_price: { type: "number" },
          part_number: { type: ["string", "null"] }
        },
        required: ["description", "quantity", "unit_price", "total_price"]
      }
    },
    source_document: {
      type: "object",
      properties: {
        file_name: { type: "string" },
        file_hash: { type: "string" },
        storage_url: { type: "string" }
      },
      required: ["file_name", "file_hash", "storage_url"]
    },
    confidence_score: { type: "number", minimum: 0.0, maximum: 1.0 },
    validation_status: {
      type: "string",
      enum: ["VALID", "QUARANTINED"]
    }
  },
  required: [
    "document_type",
    "transaction_type",
    "vendor",
    "customer",
    "amount",
    "currency",
    "issue_date",
    "category",
    "payment_status",
    "source_document",
    "confidence_score",
    "validation_status"
  ]
};
