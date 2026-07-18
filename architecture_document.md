# MODULE 0: FINANCIAL DATA INTAKE & STANDARDIZATION ENGINE
## ARCHITECTURAL SPECIFICATION DOCUMENT

---

## 1. MODULE OVERVIEW

### 1.1 Scope & Mission
Module 0 (Financial Data Intake & Standardization Engine) is the dedicated gateway of the AI-powered Financial Copilot for Manufacturing SMEs. Its sole responsibility is to ingest heterogeneous, unstructured, and semi-structured financial documents, extract financial data, validate its integrity, and standardize it into a clean, structured schema. This structured data is then stored in NeonDB, which acts as the operational database for all downstream analysis.

### 1.2 Boundary Constraints
* **Ingestion Only**: Module 0 strictly handles ingestion, OCR, parsing, standardization, validation, and storage. It does not perform forecasting, cash flow modeling, payment optimization, or generate financial advice.
* **Operational Source of Truth**: Post Module 0, all downstream applications, analytics engines, and AI agents consume exclusively structured SQL tables in NeonDB. No downstream module is ever permitted to read raw images, PDFs, or spreadsheets.

---

## 2. SYSTEM ARCHITECTURE

The diagram below details the pipeline of Module 0. Raw files enter from various channels, traverse specialized converters and Vision/Language parsing layers, run through validation logic, and write transactionally to NeonDB.

```
                                  +-----------------------+
                                  |    SME User / ERP     |
                                  | (Doc Upload Gateway)  |
                                  +-----------+-----------+
                                              |
                     +------------------------+------------------------+
                     |                        |                        |
     [Images / Handwritten]              [PDFs / DOCX]          [Excel / CSV Files]
                     |                        |                        |
                     v                        v                        v
         +-----------------------+  +-------------------+    +-------------------+
         | Puter.js (Gemma Vis.) |  | docx2txt/pdf2md   |    | xlsx2csv Converter|
         |  Multilingual OCR &   |  | Hierarchy & Table |    |   Stream Reader   |
         |  Layout Recognition   |  |   Extraction      |    |                   |
         +-----------+-----------+  +---------+---------+    +---------+---------+
                     |                        |                        |
                     |  Extracted Markdown    | Extracted Markdown     | Raw CSV Data
                     +------------------------+------------------------+
                                              |
                                              v
                                  +-----------------------+
                                  |     Gemma LLM         |
                                  |  Financial Parser     |
                                  +-----------+-----------+
                                              |
                                              | Raw JSON (Unvalidated)
                                              v
                                  +-----------------------+
                                  |   Validation Engine   |
                                  |  - Duplicate Check    |
                                  |  - Tax/Math Validation| <--- Fuzzy-Matches
                                  |  - Schema Compliance  |      Vendors/Customers
                                  +-----------+-----------+
                                              |
                             +----------------+----------------+
                             | (Pass)                          | (Fail)
                             v                                 v
                 +-----------------------+         +-----------------------+
                 |    NeonDB Storage     |         |  Quarantine & Review  |
                 | (PostgreSQL Database) |         |      Queue Table      |
                 +-----------------------+         +-----------------------+
```

---

## 3. DATA FLOW

1. **Ingestion Trigger**: A user or automated ERP hook uploads a document (invoice, ledger photo, PO, Excel sheet, etc.).
2. **Format-Specific Extraction**:
   * **Images & Hand-written papers**: Routed to `Puter.js` utilizing `Gemma Vision`. Puter.js returns structured text retaining spatial layouts.
   * **PDF & DOCX**: Converted to semantic Markdown (`.md`) to retain tables, headers, and relative formatting.
   * **Excel & CSV**: Converted to CSV format to guarantee predictable tabular boundaries.
3. **Semantic Parsing**: The extracted text/CSV is fed to the **Gemma Financial Parser**. Using a precise system prompt, Gemma performs semantic field alignment, identifying dates, amounts, line items, and entities.
4. **Validation Pipeline**: The raw output JSON is checked by an automated validation service that verifies mathematical consistency (Subtotal + Tax = Total), scans for duplicates, checks active vendors/customers in NeonDB, and tests confidence scores.
5. **Storage**:
   * **Valid Records**: Transacted into NeonDB target tables (Invoices, Raw Material Purchases, Accounts Payable, etc.) within a unified DB transaction.
   * **Invalid Records**: Quarantined with an audit trail showing failure reasons for human-in-the-loop (HITL) resolution.

---

## 4. COMPONENT RESPONSIBILITIES

| Component | Key Responsibility | Technologies / Models |
| :--- | :--- | :--- |
| **Ingestion API** | File upload handler, MIME-type validation, size limiting, storage of raw source files. | Fastify / Express, AWS S3 / MinIO |
| **Puter.js Gateway** | Execution of OCR, text layout analysis, and image interpretation using Vision-Language models. | Puter.js, Gemma Vision |
| **Markdown Converter** | Parsing binary documents (PDF, DOCX) into clean Markdown while preserving table structures. | pdfplumber, docx2txt, Pandoc |
| **Excel Parser** | Converting binary sheets into flat CSV streams, handling multi-tab workbooks. | sheetjs (xlsx), Python-pandas |
| **Gemma Financial Parser**| Large Language Model instructed to extract metadata and return structured, schema-compliant JSON. | Gemma (7B/9B/27B Instruct) |
| **Validation Engine** | Execution of structural, mathematical, and database lookup validation rules. | Node.js / Python core logic |
| **NeonDB Connector** | Transactional database operations, fuzzy matching against Master tables, auditing. | PostgreSQL Driver, Prisma / Knex |

---

## 5. INPUT PROCESSING PIPELINE

### 5.1 Images (Invoices, Receipts, Purchase Orders, Delivery Challans)
1. **Normalization**: Images are auto-rotated, contrast-optimized, and converted to grayscale if necessary to maximize legibility.
2. **Puter.js Execution**:
   * The image is sent to the Puter.js hosting container utilizing Gemma Vision.
   * Gemma Vision reads the layout and outputs the textual content while placing labels and values in adjacent structural lines.
3. **Gemma Parsing**: The layout-preserved text is sent to the Gemma Financial Parser to be converted to JSON.

### 5.2 Handwritten Documents (Ledgers, Expense Books, Shop Floor Ledgers)
1. **Multilingual Handwriting Support**: Manufacturing shops in regional hubs often use handwriting combining local scripts (e.g., Hindi, Gujarati, German, Spanish) and English numbers.
2. **Processing Pipeline**:
   * The handwritten page is scanned/photographed.
   * Puter.js (using Gemma Vision trained on multilingual document datasets) performs handwriting extraction. It reads tabular columns, vertical lines, crossed-out entries, and shorthand notations.
   * Gemma Vision outputs standardized markdown text representing the ledger layout.
   * Gemma Financial Parser decodes regional terminologies (e.g., matching "Jama/Udhar" to Credit/Debit, or "Kharidi" to Purchase) and maps them to standard JSON fields.

### 5.3 PDF & DOCX Documents (Invoices, Contracts, POs, GST Reports)
* **Conversion**: PDF and DOCX files are transformed into Markdown (`.md`).
* **Why Markdown is Preferred**:
  * **Table Preservation**: Unlike raw text extraction, which blends column values, Markdown structures tables cleanly with pipes (`|`) and hyphens (`-`).
  * **Visual Hierarchy**: Headers (`#`, `##`), bold labels, and bullet lists remain intact. This guides the LLM to understand document structure (e.g., header vs. footer vs. line item).
  * **Token Efficiency**: Markdown is highly compact compared to XML or HTML, reducing LLM token consumption by up to 60%.
  * **Spatial Relevance**: Labels (e.g., **Total Amount:**) remain physically close to their target values, resolving ambiguity.

### 5.4 Excel & CSV Files
* **Conversion**: Excel workbooks are split into individual sheets, and each sheet is saved as a clean CSV file.
* **Pipeline**:
  * Formulas are computed/flattened to their final values during conversion.
  * Empty rows, headers, and metadata lines are processed.
  * The CSV is passed directly to the Gemma Financial Parser. Because CSV represents explicit structure, Gemma simply needs to align custom columns to the unified JSON schema.

---

## 6. GEMMA PROCESSING PIPELINE

The Gemma Financial Parser operates as a zero-shot, schema-constrained parser. Its 17 primary responsibilities are detailed below:

1. **Document Classification**: Identifies if the document is an Invoice, Purchase Order, Bill, Delivery Challan, Bank Statement, Ledger Page, or Contract.
2. **Financial Entity Extraction**: Extracts the legal names, tax registrations, and addresses of the parties involved.
3. **Vendor Identification**: Determines the seller/provider (Supplier).
4. **Customer Identification**: Determines the buyer (SME or SME’s client).
5. **Invoice Number Extraction**: Isolates the unique reference number of the invoice, skipping unrelated numbers.
6. **Purchase Order Extraction**: Extracts any referenced PO number to allow cross-matching.
7. **Amount Extraction**: Identifies the Subtotal, Discount, Net Amount, and Grand Total.
8. **Tax Extraction**: Isolates tax components (GST, VAT, Sales Tax) along with their corresponding percentages and values.
9. **Currency Detection**: Identifies the transaction currency (e.g., USD, INR, EUR) using ISO 4217 currency codes.
10. **Date Extraction**: Standardizes the issue/invoice date to `YYYY-MM-DD`.
11. **Due Date Extraction**: Standardizes the payment due date to `YYYY-MM-DD`.
12. **Payment Terms Extraction**: Extracts net payment clauses (e.g., "Net 30", "Cash on Delivery", "50% advance / 50% net 15").
13. **Transaction Categorization**: Maps the transaction to standard accounting categories (e.g., Raw Materials, Utilities, Capital Equipment, Machine Maintenance, Logistics).
14. **Duplicate Detection (Heuristic)**: Flags internal document signs that point to duplicates (e.g., watermark text saying "DUPLICATE", "COPY", or "RE-ISSUE").
15. **Missing Field Detection**: Scans the input text for fields that *should* be present based on the document type but are absent (e.g., missing Tax ID or Payment Terms).
16. **Financial Validation (Preliminary)**: Performs basic math checks on the extracted numbers before outputting (verifying that item costs sum up to the subtotal).
17. **JSON Generation**: Outputs the entire parsed payload in strict adherence to the system's JSON schema, wrapping it in standard Markdown code blocks.

---

## 7. FINANCIAL JSON SCHEMA

Every document parsed by Module 0 is mapped to this universal schema. Below is the specification followed by field-level descriptions.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "StandardizedFinancialRecord",
  "type": "object",
  "properties": {
    "document_type": {
      "type": "string",
      "enum": ["INVOICE", "PURCHASE_ORDER", "BILL", "DELIVERY_CHALLAN", "BANK_STATEMENT", "LEDGER_ENTRY", "UNKNOWN"]
    },
    "transaction_type": {
      "type": "string",
      "enum": ["DEBIT", "CREDIT", "NEUTRAL"]
    },
    "vendor": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "tax_id": { "type": "string" },
        "address": { "type": "string" },
        "phone": { "type": "string" },
        "email": { "type": "string" }
      },
      "required": ["name"]
    },
    "customer": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "tax_id": { "type": "string" },
        "address": { "type": "string" },
        "phone": { "type": "string" },
        "email": { "type": "string" }
      },
      "required": ["name"]
    },
    "invoice_number": { "type": ["string", "null"] },
    "purchase_order_number": { "type": ["string", "null"] },
    "amount": {
      "type": "object",
      "properties": {
        "subtotal": { "type": "number" },
        "discount": { "type": "number" },
        "tax_amount": { "type": "number" },
        "total_amount": { "type": "number" }
      },
      "required": ["subtotal", "tax_amount", "total_amount"]
    },
    "tax_details": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "tax_type": { "type": "string" },
          "rate": { "type": "number" },
          "amount": { "type": "number" }
        },
        "required": ["tax_type", "rate", "amount"]
      }
    },
    "currency": { "type": "string", "pattern": "^[A-Z]{3}$" },
    "issue_date": { "type": "string", "format": "date" },
    "due_date": { "type": ["string", "null"], "format": "date" },
    "payment_terms": { "type": ["string", "null"] },
    "category": { "type": "string" },
    "payment_status": {
      "type": "string",
      "enum": ["PAID", "UNPAID", "PARTIALLY_PAID", "OVERDUE", "UNKNOWN"]
    },
    "line_items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "description": { "type": "string" },
          "quantity": { "type": "number" },
          "unit_price": { "type": "number" },
          "total_price": { "type": "number" },
          "part_number": { "type": ["string", "null"] }
        },
        "required": ["description", "quantity", "unit_price", "total_price"]
      }
    },
    "source_document": {
      "type": "object",
      "properties": {
        "file_name": { "type": "string" },
        "file_hash": { "type": "string" },
        "storage_url": { "type": "string" }
      },
      "required": ["file_name", "file_hash", "storage_url"]
    },
    "confidence_score": { "type": "number", "minimum": 0.0, "maximum": 1.0 },
    "validation_status": {
      "type": "string",
      "enum": ["VALID", "QUARANTINED"]
    }
  },
  "required": [
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
}
```

### 7.1 Field Explanations
* **document_type**: Standardizes incoming files. Used for routing to specific DB tables (e.g. `INVOICE` writes to `invoices`, `PURCHASE_ORDER` writes to `purchase_orders`).
* **transaction_type**: Flags financial flow direction (`DEBIT` for outgoing cash/purchases, `CREDIT` for incoming revenue, `NEUTRAL` for internal movements).
* **vendor & customer**: Structured nested objects containing details of both parties. Includes `tax_id` (GSTIN/VAT/TIN) for B2B tax matching.
* **invoice_number / purchase_order_number**: Extracted string keys to identify and cross-link source transactions.
* **amount**: Financial breakdown of subtotal, discounts, tax, and the final payable sum. Must be absolute numbers.
* **tax_details**: Structured array detailing tax rates (e.g., SGST/CGST breakdown in Indian manufacturing, or VAT in EU/UK).
* **currency**: ISO 4217 3-letter currency code (e.g. `USD`, `EUR`, `INR`).
* **issue_date**: The date on which the document was issued, formatted to standard `YYYY-MM-DD`.
* **due_date**: The date on which payment is due. Standardized to `YYYY-MM-DD`.
* **payment_terms**: Plain text detailing credit period terms (e.g., "Net 60").
* **category**: High-level expense/revenue category matched with standard manufacturing accounts.
* **payment_status**: Status of the document payment at the time of ingest (default: `UNPAID` for incoming invoices unless marked paid).
* **line_items**: Individual row data extracted from documents. Highly critical for manufacturing to track material types (e.g., "Mild Steel Plates 10mm", "CNC Milling Charge") and part numbers.
* **source_document**: Metadata linking the record back to the raw file in secure cloud storage.
* **confidence_score**: An aggregate probability score (0.0 to 1.0) calculated from OCR extraction levels and Gemma’s parsing confidence.
* **validation_status**: Internal state indicator (`VALID` routes to operational database tables; `QUARANTINED` stops the pipeline and flags for user review).

---

## 8. NEON DATABASE ARCHITECTURE

NeonDB (Serverless Postgres) is the relational operational source of truth. Below is the SQL database DDL layout.

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. COMPANIES (The SME operating the platform)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(50) UNIQUE NOT NULL, -- GSTIN, VAT, or EIN
    base_currency CHAR(3) DEFAULT 'USD',
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. CUSTOMERS (B2B buyers of the SME's services/products)
CREATE TABLE customers (
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

-- 3. VENDORS (Suppliers of steel, tooling, gas, machinery to the SME)
CREATE TABLE vendors (
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
CREATE TABLE bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    bank_name VARCHAR(255) NOT NULL,
    account_number VARCHAR(100) NOT NULL,
    routing_number VARCHAR(100),
    account_type VARCHAR(50) NOT NULL, -- Checking, Savings, Overdraft
    current_balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, account_number)
);

-- 5. PURCHASE ORDERS
CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    po_number VARCHAR(100) NOT NULL,
    po_date DATE NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    status VARCHAR(50) NOT NULL DEFAULT 'Draft', -- Draft, Issued, Fulfilled, Cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, po_number)
);

-- 6. INVOICES
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL, -- Present if vendor bill (Accounts Payable)
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL, -- Present if customer invoice (Accounts Receivable)
    invoice_number VARCHAR(100) NOT NULL,
    purchase_order_id UUID REFERENCES purchase_orders(id) ON DELETE SET NULL,
    issue_date DATE NOT NULL,
    due_date DATE,
    subtotal DECIMAL(15, 2) NOT NULL,
    tax_amount DECIMAL(15, 2) NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    payment_status VARCHAR(50) NOT NULL DEFAULT 'Unpaid', -- Unpaid, Partially Paid, Paid, Overdue
    category VARCHAR(100),
    source_document_url TEXT NOT NULL,
    confidence_score DECIMAL(3, 2) NOT NULL,
    validation_status VARCHAR(50) NOT NULL DEFAULT 'Valid',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, vendor_id, invoice_number)
);

-- 7. LINE ITEMS
CREATE TABLE invoice_line_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity DECIMAL(12, 4) NOT NULL,
    unit_price DECIMAL(15, 4) NOT NULL,
    total_price DECIMAL(15, 2) NOT NULL,
    part_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. TRANSACTIONS (Reconciled/Unreconciled Bank & Cash entries)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    bank_account_id UUID REFERENCES bank_accounts(id) ON DELETE SET NULL,
    transaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    transaction_type VARCHAR(10) NOT NULL, -- DEBIT or CREDIT
    description TEXT,
    reference_number VARCHAR(100), -- Transaction Ref, Cheque, UTR
    category VARCHAR(100),
    reconciliation_status VARCHAR(50) NOT NULL DEFAULT 'Unreconciled', -- Unreconciled, Reconciled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. ACCOUNTS RECEIVABLE
CREATE TABLE accounts_receivable (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    invoice_id UUID UNIQUE NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    amount_due DECIMAL(15, 2) NOT NULL,
    due_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. ACCOUNTS PAYABLE
CREATE TABLE accounts_payable (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    invoice_id UUID UNIQUE NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    amount_due DECIMAL(15, 2) NOT NULL,
    due_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. PAYROLL
CREATE TABLE payroll (
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

-- 12. LOANS (SME business and machinery loans)
CREATE TABLE loans (
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

-- 13. RECURRING EXPENSES (Software licenses, factory rent, AMC)
CREATE TABLE recurring_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    expense_name VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    frequency VARCHAR(50) NOT NULL, -- Monthly, Quarterly, Annually
    next_due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. MACHINE MAINTENANCE (CNC calibration, laser replacement, welding repairs)
CREATE TABLE machine_maintenance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    machine_id VARCHAR(100) NOT NULL, -- Identifier of the lathe/mill
    maintenance_date DATE NOT NULL,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    cost DECIMAL(15, 2) NOT NULL,
    description TEXT,
    maintenance_type VARCHAR(50) NOT NULL, -- Routine, Breakdown
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. RAW MATERIAL PURCHASES (Track raw stock buying)
CREATE TABLE raw_material_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    po_id UUID REFERENCES purchase_orders(id) ON DELETE SET NULL,
    material_name VARCHAR(255) NOT NULL, -- Mild Steel Plate, Aluminum Bar
    quantity DECIMAL(12, 4) NOT NULL,
    unit_of_measure VARCHAR(50) NOT NULL, -- kg, tons, meters
    unit_price DECIMAL(15, 4) NOT NULL,
    total_cost DECIMAL(15, 2) NOT NULL,
    received_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. CASH BALANCE (Physical register counts in the factory)
CREATE TABLE cash_balance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    office_location_or_register VARCHAR(255) NOT NULL DEFAULT 'Main Office',
    current_balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    last_cash_count_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, office_location_or_register)
);

-- 17. QUARANTINE_QUEUE (Table to buffer and audit failed ingests)
CREATE TABLE quarantine_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    raw_document_url TEXT NOT NULL,
    failed_json JSONB,
    failure_reason TEXT NOT NULL,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 8.1 How Module 0 Populates These Tables
* **Fuzzy Match & Resolution**: When a JSON payload arrives, Module 0 looks up the `company_id` using the user's tenant session. It then queries `vendors` or `customers` tables using the extracted `tax_id` or `name` (with fuzzy text match `pg_trgm`). If a matching entity exists, its UUID is linked; otherwise, a new entity is created.
* **Document Routing**:
  * If `document_type = 'INVOICE'` and `transaction_type = 'DEBIT'`, it writes to `invoices` (as a vendor bill) and creates a row in `accounts_payable`.
  * If `document_type = 'INVOICE'` and `transaction_type = 'CREDIT'`, it writes to `invoices` (as an outgoing invoice) and creates a row in `accounts_receivable`.
  * If `document_type = 'PURCHASE_ORDER'`, it inserts into `purchase_orders`.
* **Line Item Splitting**: Individual items in `line_items` of the JSON are parsed and inserted into `invoice_line_items` tied to the invoice UUID. If a line item mentions raw materials (e.g., Steel, Aluminum) and has a associated PO, a record is added to `raw_material_purchases`.
* **Maintenance Ingress**: Invoices classified under "Machine Maintenance" (using the JSON category field) trigger a insert into `machine_maintenance`.
* **Bank Statements**: Bank transactions parsed from statement files populate the `transactions` table. Downstream matching reconciles these with existing `invoices` or `payroll` records.

---

## 9. DATA VALIDATION PIPELINE

The Validation Layer is a programmatic wrapper that evaluates the JSON output before writing to NeonDB.

```
                           +---------------------------+
                           |  Raw Gemma JSON Payload   |
                           +-------------+-------------+
                                         |
                                         v
                           +---------------------------+
                           |    1. Math Verification   | ---- (Mismatch) ---> [ QUARANTINE ]
                           | Subtotal + Tax == Total?  |
                           +-------------+-------------+
                                         | (Pass)
                                         v
                           +---------------------------+
                           |  2. Entity Resolution     | ---- (Not Found) ---> [ Auto-create/Fuzzy Match ]
                           |   Tax ID / Name Search    |
                           +-------------+-------------+
                                         | (Pass)
                                         v
                           +---------------------------+
                           |  3. Date Integrity check  | ---- (Due < Issue) -> [ QUARANTINE ]
                           | Chronology & ISO validity |
                           +-------------+-------------+
                                         | (Pass)
                                         v
                           +---------------------------+
                           | 4. Duplicate Check (Hash) | ---- (Exists) ------> [ Skip / Alert ]
                           | Invoice No. + Vendor Uniq?|
                           +-------------+-------------+
                                         | (Pass)
                                         v
                           +---------------------------+
                           |   5. Confidence Check     | ---- (Score < 0.85) -> [ QUARANTINE ]
                           |     Check parser score    |
                           +-------------+-------------+
                                         | (Pass)
                                         v
                           +---------------------------+
                           |      WRITE TO NeonDB      |
                           +---------------------------+
```

### 9.1 Core Validations
1. **Duplicate Detection**: Evaluates uniqueness on `(company_id, vendor_id, invoice_number)` for invoices and `(company_id, po_number)` for POs. The source file hash is also checked against historical hashes to prevent processing the identical file twice.
2. **Missing Fields Check**: Enforces presence of mandatory fields. Critical missing fields (e.g., `total_amount`, `issue_date`) trigger immediate quarantine. Non-critical missing fields (e.g., `payment_terms`) are set to default values (e.g., "Due on Receipt").
3. **Incorrect Dates**: Validates dates against standard YYYY-MM-DD. Checks logical rules:
   * `issue_date` cannot be in the future (beyond a 24-hour buffer).
   * `due_date` must be greater than or equal to `issue_date`.
4. **Currency Validation**: Checks if `currency` is a valid ISO 4217 code. If the currency differs from the company’s `base_currency`, a warning is raised and the transaction is prepared for downstream multi-currency conversion.
5. **Amount Validation**: Enforces:
   $$\text{Subtotal} - \text{Discount} + \text{Tax Amount} = \text{Total Amount}$$
   $$\sum (\text{Line Item Total Price}) = \text{Subtotal}$$
   A margin of error of $\pm0.02$ is permitted to allow for rounding variances.
6. **Vendor & Customer Verification**: Resolves entities by checking `tax_id` in NeonDB. If not found, fuzzy matches names. If no matches are found, the engine can auto-create the vendor/customer with a flag `is_unverified = true` to prevent blocking the intake queue.
7. **Data Completeness & Thresholds**: Checks `confidence_score`. If the score is less than `0.85` (due to blurred scan or confusing handwriting), the document is marked as failed.

### 9.2 Handling of Invalid Records (Quarantine System)
* If any critical validation fails, the process halts database updates for that record.
* The transaction is rolled back, and the document metadata is stored in `quarantine_queue` along with `failure_reason` and the parsed raw JSON (`failed_json`).
* An event notification alerts the SME admin to open the human-in-the-loop (HITL) dashboard, view the raw document alongside the failed fields, make manual edits, and re-submit the record.

---

## 10. STORAGE PIPELINE (ACID WRITER)

To maintain database consistency, Module 0 writes to NeonDB inside a Postgres TRANSACTION.

```sql
BEGIN;

-- 1. Lock/Fetch Company
SELECT id FROM companies WHERE id = $1 FOR UPDATE;

-- 2. Verify or Insert Vendor/Customer
INSERT INTO vendors (company_id, vendor_name, tax_id, address)
VALUES ($1, $2, $3, $4)
ON CONFLICT (company_id, tax_id) DO UPDATE 
SET address = EXCLUDED.address
RETURNING id;

-- 3. Insert Invoice
INSERT INTO invoices (company_id, vendor_id, invoice_number, issue_date, due_date, subtotal, tax_amount, total_amount, currency, source_document_url, confidence_score, validation_status)
VALUES ($1, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'Valid')
RETURNING id;

-- 4. Bulk Insert Line Items
INSERT INTO invoice_line_items (invoice_id, description, quantity, unit_price, total_price, part_number)
VALUES ($15, $16, $17, $18, $19, $20);

-- 5. Add to Accounts Payable
INSERT INTO accounts_payable (company_id, vendor_id, invoice_id, amount_due, due_date)
VALUES ($1, $5, $15, $11, $8);

COMMIT;
```

This guarantees that a failure during line item insertion or accounts payable entry prevents orphan invoices in the database.

---

## 11. TEXT-BASED SYSTEM DIAGRAM

```
+---------------------------------------------------------------------------------------------------+
|                                  MODULE 0 - INGESTION ENGINE                                      |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [Source Files] ---> (Ingestion API Gateway) ---> [Archive Storage S3]                            |
|                               |                                                                   |
|                               +---> [Image / Handwriting] ---> (Puter.js + Gemma Vision OCR)      |
|                               |                                      |                            |
|                               |                                      v [Layout MD]                |
|                               +---> [PDF / DOCX] ------------> (Markdown Parser)                  |
|                               |                                      |                            |
|                               |                                      v [Standard MD]              |
|                               +---> [Excel / CSV] ------------> (CSV Converter)                   |
|                                                                      |                            |
|                                                                      v [Flat CSV Text]            |
|                                                                                                   |
|                                                          (Gemma Financial Parser)                 |
|                                                                      |                            |
|                                                                      v [Raw JSON]                 |
|                                                                                                   |
|                                                            (Validation Engine)                    |
|                                                                      |                            |
|                                            +-------------------------+-------------------------+  |
|                                            | (Validation Fails)                                |  |
|                                            v                                                   v  |
|                                   [Quarantine Queue]                               [NeonDB Writer]|
|                                            |                                        (Postgres txn)|
|                                            |                                           |          |
|                                            v                                           +--> invoices
|                                    [Human Dashboard]                                   +--> line_items
|                                            |                                           +--> payable/rec
|                                            v (Override/Fix)                            +--> materials
|                                            +-------------------------------------------+          |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
|                                      NEON OPERATIONAL DATABASE                                    |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|    +-----------------+        +-----------------+        +-----------------+                      |
|    |    companies    |        |    vendors      |        |    customers    |                      |
|    +--------+--------+        +--------+--------+        +--------+--------+                      |
|             |                          |                          |                               |
|             v                          v                          v                               |
|    +--------+--------+                 +--------+--------+--------+--------+                      |
|    | purchase_orders | <-------------> |              invoices             |                      |
|    +-----------------+                 +--------+-----------------+--------+                      |
|                                                 |                 |                               |
|                                                 v                 v                               |
|                                  +--------------+--+       +------+--------+                      |
|                                  | invoice_items   |       | accounts_pay  |                      |
|                                  +-----------------+       +---------------+                      |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```
