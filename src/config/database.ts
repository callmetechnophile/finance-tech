import { Pool, QueryResult } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const useRealDb = !!process.env.DATABASE_URL;

let pool: Pool | null = null;

if (useRealDb) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL!.includes('neon') ? { rejectUnauthorized: false } : undefined
  });
}

// In-memory mock database state for running without a live connection
export class MockDatabase {
  static companies: any[] = [];
  static customers: any[] = [];
  static vendors: any[] = [];
  static bank_accounts: any[] = [];
  static tax_configurations: any[] = [];
  static payment_terms_master: any[] = [];
  static recurring_templates: any[] = [];
  static purchase_orders: any[] = [];
  static sales_orders: any[] = [];
  static invoices: any[] = [];
  static invoice_line_items: any[] = [];
  static transactions: any[] = [];
  static accounts_receivable: any[] = [];
  static accounts_payable: any[] = [];
  static payroll: any[] = [];
  static loans: any[] = [];
  static raw_material_purchases: any[] = [];
  static machine_maintenance: any[] = [];
  static cash_balance: any[] = [];
  static document_registry: any[] = [];
  static validation_logs: any[] = [];
  static system_audit_trail: any[] = [];
  static quarantine_queue: any[] = [];

  static reset() {
    this.companies = [];
    this.customers = [];
    this.vendors = [];
    this.bank_accounts = [];
    this.tax_configurations = [];
    this.payment_terms_master = [];
    this.recurring_templates = [];
    this.purchase_orders = [];
    this.sales_orders = [];
    this.invoices = [];
    this.invoice_line_items = [];
    this.transactions = [];
    this.accounts_receivable = [];
    this.accounts_payable = [];
    this.payroll = [];
    this.loans = [];
    this.raw_material_purchases = [];
    this.machine_maintenance = [];
    this.cash_balance = [];
    this.document_registry = [];
    this.validation_logs = [];
    this.system_audit_trail = [];
    this.quarantine_queue = [];
  }
}

export async function query(text: string, params?: any[]): Promise<QueryResult<any>> {
  if (pool) {
    return pool.query(text, params);
  }

  // Handle mock SQL operations for testing/demo
  const upperText = text.toUpperCase();
  const result: QueryResult<any> = {
    rows: [],
    rowCount: 0,
    oid: 0,
    fields: [],
    command: 'SELECT'
  };

  // Basic mock implementations of SELECT / INSERT checks
  if (upperText.includes('FROM COMPANIES')) {
    result.rows = MockDatabase.companies;
  } else if (upperText.includes('FROM VENDORS')) {
    if (params && params.length > 0) {
      const taxId = params[1] || params[0];
      const vendor = MockDatabase.vendors.find(v => v.tax_id === taxId || v.vendor_name === taxId);
      result.rows = vendor ? [vendor] : [];
    } else {
      result.rows = MockDatabase.vendors;
    }
  } else if (upperText.includes('FROM CUSTOMERS')) {
    if (params && params.length > 0) {
      const taxId = params[1] || params[0];
      const customer = MockDatabase.customers.find(c => c.tax_id === taxId || c.customer_name === taxId);
      result.rows = customer ? [customer] : [];
    } else {
      result.rows = MockDatabase.customers;
    }
  } else if (upperText.includes('FROM PAYMENT_TERMS_MASTER')) {
    if (params && params.length > 1) {
      const termName = params[1];
      const term = MockDatabase.payment_terms_master.find(pt => pt.term_name === termName);
      result.rows = term ? [term] : [];
    } else {
      result.rows = MockDatabase.payment_terms_master;
    }
  } else if (upperText.includes('FROM TAX_CONFIGURATIONS')) {
    if (params && params.length > 1) {
      const taxCode = params[1];
      const tax = MockDatabase.tax_configurations.find(t => t.tax_code === taxCode);
      result.rows = tax ? [tax] : [];
    } else {
      result.rows = MockDatabase.tax_configurations;
    }
  } else if (upperText.includes('FROM INVOICES')) {
    if (upperText.includes('INVOICE_NUMBER')) {
      const companyId = params ? params[0] : null;
      const vendorId = params ? params[1] : null;
      const invNum = params ? params[2] : null;
      const match = MockDatabase.invoices.find(inv => 
        inv.company_id === companyId && inv.vendor_id === vendorId && inv.invoice_number === invNum
      );
      result.rows = match ? [match] : [];
    } else {
      result.rows = MockDatabase.invoices;
    }
  } else if (upperText.includes('INSERT INTO COMPANIES')) {
    const newCompany = {
      id: 'mock-company-id-' + Math.random().toString(36).substr(2, 9),
      company_name: params ? params[0] : '',
      tax_id: params ? params[1] : '',
      base_currency: params ? params[2] : 'USD'
    };
    MockDatabase.companies.push(newCompany);
    result.rows = [newCompany];
    result.rowCount = 1;
  } else if (upperText.includes('INSERT INTO VENDORS')) {
    const newVendor = {
      id: 'mock-vendor-id-' + Math.random().toString(36).substr(2, 9),
      company_id: params ? params[0] : '',
      vendor_name: params ? params[1] : '',
      tax_id: params ? params[2] : '',
      address: params ? params[3] : ''
    };
    MockDatabase.vendors.push(newVendor);
    result.rows = [newVendor];
    result.rowCount = 1;
  } else if (upperText.includes('INSERT INTO CUSTOMERS')) {
    const newCustomer = {
      id: 'mock-customer-id-' + Math.random().toString(36).substr(2, 9),
      company_id: params ? params[0] : '',
      customer_name: params ? params[1] : '',
      tax_id: params ? params[2] : '',
      address: params ? params[3] : ''
    };
    MockDatabase.customers.push(newCustomer);
    result.rows = [newCustomer];
    result.rowCount = 1;
  } else if (upperText.includes('INSERT INTO PAYMENT_TERMS_MASTER')) {
    const newTerm = {
      id: 'mock-term-id-' + Math.random().toString(36).substr(2, 9),
      company_id: params ? params[0] : '',
      term_name: params ? params[1] : '',
      due_days: params ? params[2] : 30,
      discount_days: params ? params[3] : 0,
      discount_percentage: params ? params[4] : 0.00
    };
    MockDatabase.payment_terms_master.push(newTerm);
    result.rows = [newTerm];
    result.rowCount = 1;
  } else if (upperText.includes('INSERT INTO TAX_CONFIGURATIONS')) {
    const newTax = {
      id: 'mock-tax-config-id-' + Math.random().toString(36).substr(2, 9),
      company_id: params ? params[0] : '',
      tax_code: params ? params[1] : '',
      tax_type: params ? params[2] : '',
      tax_rate: params ? params[3] : 0.00
    };
    MockDatabase.tax_configurations.push(newTax);
    result.rows = [newTax];
    result.rowCount = 1;
  } else if (upperText.includes('INSERT INTO DOCUMENT_REGISTRY')) {
    const newDoc = {
      id: 'mock-doc-id-' + Math.random().toString(36).substr(2, 9),
      company_id: params ? params[0] : '',
      document_type: params ? params[1] : '',
      original_file_name: params ? params[2] : '',
      file_hash: params ? params[3] : '',
      storage_url: params ? params[4] : ''
    };
    MockDatabase.document_registry.push(newDoc);
    result.rows = [newDoc];
    result.rowCount = 1;
  } else if (upperText.includes('INSERT INTO VALIDATION_LOGS')) {
    const newLog = {
      id: 'mock-validation-log-id-' + Math.random().toString(36).substr(2, 9),
      document_id: params ? params[0] : '',
      math_validity: params ? params[1] : true,
      missing_fields: params ? params[2] : '',
      confidence_score: params ? params[3] : 1.0,
      error_code: params ? params[4] : ''
    };
    MockDatabase.validation_logs.push(newLog);
    result.rows = [newLog];
    result.rowCount = 1;
  } else if (upperText.includes('INSERT INTO SYSTEM_AUDIT_TRAIL')) {
    const newAudit = {
      id: 'mock-audit-id-' + Math.random().toString(36).substr(2, 9),
      company_id: params ? params[0] : '',
      user_identifier: 'SYSTEM',
      change_type: params ? params[1] : '',
      target_table: params ? params[2] : '',
      record_id: params ? params[3] : '',
      previous_state: params ? params[4] : null,
      new_state: params ? params[5] : null
    };
    MockDatabase.system_audit_trail.push(newAudit);
    result.rows = [newAudit];
    result.rowCount = 1;
  } else if (upperText.includes('INSERT INTO SALES_ORDERS')) {
    const newSO = {
      id: 'mock-so-id-' + Math.random().toString(36).substr(2, 9),
      company_id: params ? params[0] : '',
      customer_id: params ? params[1] : null,
      sales_order_number: params ? params[2] : '',
      order_date: params ? params[3] : '',
      promised_delivery_date: params ? params[4] : null,
      total_value: params ? params[5] : 0.00,
      order_status: params ? params[6] : 'Open'
    };
    MockDatabase.sales_orders.push(newSO);
    result.rows = [newSO];
    result.rowCount = 1;
  } else if (upperText.includes('INSERT INTO PURCHASE_ORDERS')) {
    const newPO = {
      id: 'mock-po-id-' + Math.random().toString(36).substr(2, 9),
      company_id: params ? params[0] : '',
      vendor_id: params ? params[1] : null,
      po_number: params ? params[2] : '',
      po_date: params ? params[3] : '',
      total_amount: params ? params[4] : 0,
      currency: params ? params[5] : 'USD',
      status: params ? params[6] : 'Draft'
    };
    MockDatabase.purchase_orders.push(newPO);
    result.rows = [newPO];
    result.rowCount = 1;
  } else if (upperText.includes('INSERT INTO INVOICES')) {
    const newInvoice = {
      id: 'mock-invoice-id-' + Math.random().toString(36).substr(2, 9),
      company_id: params ? params[0] : '',
      vendor_id: params ? params[1] : null,
      customer_id: params ? params[2] : null,
      invoice_number: params ? params[3] : '',
      purchase_order_id: params ? params[4] : null,
      sales_order_id: params ? params[5] : null,
      issue_date: params ? params[6] : '',
      due_date: params ? params[7] : '',
      subtotal: params ? params[8] : 0,
      tax_amount: params ? params[9] : 0,
      total_amount: params ? params[10] : 0,
      currency: params ? params[11] : 'USD',
      payment_status: params ? params[12] : 'Unpaid',
      category: params ? params[13] : '',
      source_document_url: params ? params[14] : '',
      confidence_score: params ? params[15] : 1.0,
      validation_status: params ? params[16] : 'Valid'
    };
    MockDatabase.invoices.push(newInvoice);
    result.rows = [newInvoice];
    result.rowCount = 1;
  } else if (upperText.includes('INSERT INTO INVOICE_LINE_ITEMS')) {
    const newItem = {
      id: 'mock-line-item-id-' + Math.random().toString(36).substr(2, 9),
      invoice_id: params ? params[0] : '',
      description: params ? params[1] : '',
      quantity: params ? params[2] : 0,
      unit_price: params ? params[3] : 0,
      total_price: params ? params[4] : 0,
      part_number: params ? params[5] : null,
      tax_config_id: params ? params[6] : null
    };
    MockDatabase.invoice_line_items.push(newItem);
    result.rows = [newItem];
    result.rowCount = 1;
  } else if (upperText.includes('INSERT INTO ACCOUNTS_PAYABLE')) {
    const newAP = {
      id: 'mock-ap-id-' + Math.random().toString(36).substr(2, 9),
      company_id: params ? params[0] : '',
      vendor_id: params ? params[1] : '',
      invoice_id: params ? params[2] : '',
      amount_due: params ? params[3] : 0,
      due_date: params ? params[4] : ''
    };
    MockDatabase.accounts_payable.push(newAP);
    result.rows = [newAP];
    result.rowCount = 1;
  } else if (upperText.includes('INSERT INTO ACCOUNTS_RECEIVABLE')) {
    const newAR = {
      id: 'mock-ar-id-' + Math.random().toString(36).substr(2, 9),
      company_id: params ? params[0] : '',
      customer_id: params ? params[1] : '',
      invoice_id: params ? params[2] : '',
      amount_due: params ? params[3] : 0,
      due_date: params ? params[4] : ''
    };
    MockDatabase.accounts_receivable.push(newAR);
    result.rows = [newAR];
    result.rowCount = 1;
  } else if (upperText.includes('INSERT INTO QUARANTINE_QUEUE')) {
    const newQuarantine = {
      id: 'mock-quarantine-id-' + Math.random().toString(36).substr(2, 9),
      company_id: params ? params[0] : '',
      raw_document_url: params ? params[1] : '',
      failed_json: params ? params[2] : {},
      failure_reason: params ? params[3] : '',
      resolved: false
    };
    MockDatabase.quarantine_queue.push(newQuarantine);
    result.rows = [newQuarantine];
    result.rowCount = 1;
  } else if (upperText.includes('INSERT INTO MACHINE_MAINTENANCE')) {
    const newMaint = {
      id: 'mock-maint-id-' + Math.random().toString(36).substr(2, 9),
      company_id: params ? params[0] : '',
      machine_id: params ? params[1] : '',
      maintenance_date: params ? params[2] : '',
      vendor_id: params ? params[3] : '',
      cost: params ? params[4] : 0,
      description: params ? params[5] : '',
      maintenance_type: params ? params[6] : ''
    };
    MockDatabase.machine_maintenance.push(newMaint);
    result.rows = [newMaint];
    result.rowCount = 1;
  } else if (upperText.includes('INSERT INTO RAW_MATERIAL_PURCHASES')) {
    const newRaw = {
      id: 'mock-raw-id-' + Math.random().toString(36).substr(2, 9),
      company_id: params ? params[0] : '',
      vendor_id: params ? params[1] : '',
      po_id: params ? params[2] : null,
      material_name: params ? params[3] : '',
      quantity: params ? params[4] : 0,
      unit_of_measure: params ? params[5] : '',
      unit_price: params ? params[6] : 0,
      total_cost: params ? params[7] : 0
    };
    MockDatabase.raw_material_purchases.push(newRaw);
    result.rows = [newRaw];
    result.rowCount = 1;
  }

  result.rowCount = result.rows.length;
  return result;
}

export async function getClient() {
  if (pool) {
    return pool.connect();
  }

  // Return a mock client with query and transaction capabilities
  return {
    query: async (text: string, params?: any[]) => query(text, params),
    release: () => {}
  } as any;
}

export function isRealDbConfigured(): boolean {
  return useRealDb;
}
