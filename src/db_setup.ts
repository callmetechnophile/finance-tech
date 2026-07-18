import * as db from './config/database';

const ddl = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. COMPANIES
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(50) UNIQUE NOT NULL,
    base_currency CHAR(3) DEFAULT 'USD',
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. CUSTOMERS
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(50),
    contact_email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, tax_id)
);

-- 3. VENDORS
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    vendor_name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(50),
    contact_email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, tax_id)
);

-- 4. BANK ACCOUNTS
CREATE TABLE IF NOT EXISTS bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    bank_name VARCHAR(255) NOT NULL,
    account_number VARCHAR(100) NOT NULL,
    routing_number VARCHAR(100),
    account_type VARCHAR(50) NOT NULL,
    current_balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, account_number)
);

-- 5. TAX CONFIGURATIONS
CREATE TABLE IF NOT EXISTS tax_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    tax_code VARCHAR(50) NOT NULL,
    tax_type VARCHAR(50) NOT NULL,
    tax_rate DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, tax_code)
);

-- 6. PAYMENT TERMS MASTER
CREATE TABLE IF NOT EXISTS payment_terms_master (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    term_name VARCHAR(100) NOT NULL,
    due_days INT NOT NULL,
    discount_days INT DEFAULT 0,
    discount_percentage DECIMAL(5, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, term_name)
);

-- 7. RECURRING TEMPLATES
CREATE TABLE IF NOT EXISTS recurring_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    template_type VARCHAR(20) NOT NULL, -- EXPENSE or REVENUE
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    amount DECIMAL(15, 2) NOT NULL,
    frequency VARCHAR(50) NOT NULL, -- Monthly, Quarterly, Annually
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. PURCHASE ORDERS
CREATE TABLE IF NOT EXISTS purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    po_number VARCHAR(100) NOT NULL,
    po_date DATE NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    status VARCHAR(50) NOT NULL DEFAULT 'Draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, po_number)
);

-- 9. SALES ORDERS
CREATE TABLE IF NOT EXISTS sales_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    sales_order_number VARCHAR(100) NOT NULL,
    order_date DATE NOT NULL,
    promised_delivery_date DATE,
    total_value DECIMAL(15, 2) NOT NULL,
    order_status VARCHAR(50) NOT NULL DEFAULT 'Open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, sales_order_number)
);

-- 10. INVOICES
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    invoice_number VARCHAR(100) NOT NULL,
    purchase_order_id UUID REFERENCES purchase_orders(id) ON DELETE SET NULL,
    sales_order_id UUID REFERENCES sales_orders(id) ON DELETE SET NULL,
    issue_date DATE NOT NULL,
    due_date DATE,
    subtotal DECIMAL(15, 2) NOT NULL,
    tax_amount DECIMAL(15, 2) NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    payment_status VARCHAR(50) NOT NULL DEFAULT 'Unpaid',
    category VARCHAR(100),
    source_document_url TEXT NOT NULL,
    confidence_score DECIMAL(3, 2) NOT NULL,
    validation_status VARCHAR(50) NOT NULL DEFAULT 'Valid',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, vendor_id, invoice_number)
);

-- 11. LINE ITEMS
CREATE TABLE IF NOT EXISTS invoice_line_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity DECIMAL(12, 4) NOT NULL,
    unit_price DECIMAL(15, 4) NOT NULL,
    total_price DECIMAL(15, 2) NOT NULL,
    part_number VARCHAR(100),
    tax_config_id UUID REFERENCES tax_configurations(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. TRANSACTIONS
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    bank_account_id UUID REFERENCES bank_accounts(id) ON DELETE SET NULL,
    transaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    transaction_type VARCHAR(10) NOT NULL,
    description TEXT,
    reference_number VARCHAR(100),
    category VARCHAR(100),
    reconciliation_status VARCHAR(50) NOT NULL DEFAULT 'Unreconciled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. ACCOUNTS RECEIVABLE
CREATE TABLE IF NOT EXISTS accounts_receivable (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    invoice_id UUID UNIQUE NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    amount_due DECIMAL(15, 2) NOT NULL,
    due_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. ACCOUNTS PAYABLE
CREATE TABLE IF NOT EXISTS accounts_payable (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    invoice_id UUID UNIQUE NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    amount_due DECIMAL(15, 2) NOT NULL,
    due_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. PAYROLL
CREATE TABLE IF NOT EXISTS payroll (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    employee_name VARCHAR(255) NOT NULL,
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    basic_pay DECIMAL(15, 2) NOT NULL,
    allowances DECIMAL(15, 2) DEFAULT 0.00,
    deductions DECIMAL(15, 2) DEFAULT 0.00,
    net_pay DECIMAL(15, 2) NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'Unpaid',
    payment_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. LOANS
CREATE TABLE IF NOT EXISTS loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    lender_name VARCHAR(255) NOT NULL,
    loan_amount DECIMAL(15, 2) NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    term_months INT NOT NULL,
    outstanding_balance DECIMAL(15, 2) NOT NULL,
    monthly_emi DECIMAL(15, 2) NOT NULL,
    next_payment_due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. RAW MATERIAL PURCHASES
CREATE TABLE IF NOT EXISTS raw_material_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    po_id UUID REFERENCES purchase_orders(id) ON DELETE SET NULL,
    material_name VARCHAR(255) NOT NULL,
    quantity DECIMAL(12, 4) NOT NULL,
    unit_of_measure VARCHAR(50) NOT NULL,
    unit_price DECIMAL(15, 4) NOT NULL,
    total_cost DECIMAL(15, 2) NOT NULL,
    received_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 18. MACHINE MAINTENANCE
CREATE TABLE IF NOT EXISTS machine_maintenance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    machine_id VARCHAR(100) NOT NULL,
    maintenance_date DATE NOT NULL,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    cost DECIMAL(15, 2) NOT NULL,
    description TEXT,
    maintenance_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 19. CASH BALANCE
CREATE TABLE IF NOT EXISTS cash_balance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    office_location_or_register VARCHAR(255) NOT NULL DEFAULT 'Main Office',
    current_balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    last_cash_count_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, office_location_or_register)
);

-- 20. DOCUMENT REGISTRY
CREATE TABLE IF NOT EXISTS document_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    original_file_name VARCHAR(255) NOT NULL,
    file_hash VARCHAR(100) UNIQUE NOT NULL,
    storage_url TEXT NOT NULL,
    upload_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 21. VALIDATION LOGS
CREATE TABLE IF NOT EXISTS validation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES document_registry(id) ON DELETE CASCADE,
    validation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    math_validity BOOLEAN NOT NULL DEFAULT TRUE,
    missing_fields TEXT,
    confidence_score DECIMAL(3,2) NOT NULL,
    error_code VARCHAR(100)
);

-- 22. SYSTEM AUDIT TRAIL
CREATE TABLE IF NOT EXISTS system_audit_trail (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_identifier VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
    change_type VARCHAR(50) NOT NULL, -- INSERT, UPDATE, DELETE, RESOLUTION
    target_table VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    previous_state JSONB,
    new_state JSONB,
    change_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 23. QUARANTINE QUEUE
CREATE TABLE IF NOT EXISTS quarantine_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    raw_document_url TEXT NOT NULL,
    failed_json JSONB,
    failure_reason TEXT NOT NULL,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;

async function setup() {
  console.log('--- Database Schema Setup Initiated ---');
  if (db.isRealDbConfigured()) {
    console.log('Connecting to real Postgres instance...');
    try {
      await db.query(ddl);
      console.log('Postgres tables created successfully.');
    } catch (err) {
      console.error('Error creating PostgreSQL tables:', err);
    }
  } else {
    console.log('No DATABASE_URL configured. Operating in local Mock Mode. Virtual schemas initialized.');
  }
}

if (require.main === module) {
  setup();
}
export { setup };
