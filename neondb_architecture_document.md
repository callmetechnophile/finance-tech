# NEONDB DATABASE ARCHITECTURE DESIGN SPECIFICATION
## SYSTEM SPECIFICATION DOCUMENT - MODULE INTERFACES & SCHEMA SCHEMATICS

---

## 1. NEONDB OVERVIEW

### 1.1 Role as the Single Source of Truth
NeonDB (Serverless PostgreSQL) serves as the central operational database and the **Single Source of Truth (SSOT)** for the AI-powered Financial Copilot platform. The database architecture is designed to enforce strict normalization, referential integrity, and logical separation of domains. All downstream forecasting, optimization, and AI reasoning modules consume structured relational tables. Unstructured source files (PDFs, scans, Excel files) are transformed at the boundary by Module 0 and are never directly queried by subsequent modules.

```
                  +----------------------------------------------+
                  |           Ingestion Channels (Raw)           |
                  +----------------------+-----------------------+
                                         |
                                         v
                  +----------------------------------------------+
                  |  Module 0: Data Intake & Standardisation     |
                  +----------------------+-----------------------+
                                         | (ACID Relational Writes)
                                         v
                  +----------------------------------------------+
                  |                  NEONDB                      |
                  |     (Relational Source of Truth)             |
                  +---+---------+---------+---------+--------+---+
                      |         |         |         |        |
         +------------+         |         |         |        +------------+
         |                      |         |         |                     |
         v                      v         v         v                     v
  +--------------+  +--------------+  +--------+  +--------------+  +------------+
  |   Module 1   |  |   Module 2   |  |Mod. 3  |  |   Module 4   |  |  Module 5  |
  | Cash Flow    |  |  Liquidity   |  |Invoice |  |   Payment    |  | Financial  |
  | Forecasting  |  |  Risk Engine |  |Followup|  | Optimization |  |  Copilot   |
  +--------------+  +--------------+  +--------+  +--------------+  +------------+
```

---

## 2. DATABASE RESPONSIBILITIES

| Module | SQL Write Operations | SQL Read Operations |
| :--- | :--- | :--- |
| **Module 0: Data Intake** | Inserts standard Master data, populates Transactions, creates AR/AP entries, updates Cash Positions, registers documents in Document Registry, and writes Audit Trails. | Reads Master configurations, existing Invoice/PO records for duplicate checks, and fuzzy lookup reference keys. |
| **Module 1: Forecasting** | None. | Reads historical Invoices, Transactions, Recurring Templates, Payroll ledger, and Loan schedules to compute forecasts. |
| **Module 2: Liquidity Analysis** | None. | Reads AR/AP tables (aging buckets), Loan due dates, Machine Maintenance schedules, Raw Material Purchases, and Bank Account balances. |
| **Module 3: Invoice Follow-up** | Writes follow-up schedules, logs contact history and communication status. | Reads Customer accounts, Invoices, and accounts_receivable records. |
| **Module 4: Payables Optimizer**| Writes recommended payment dates and status flags to Invoice schedules. | Reads Vendors, Invoices (Accounts Payable), Bank Account limits, and cash flow forecasts. |
| **Module 5: Copilot Engine** | None. | Queries all domains (Master, Transactions, Metadata) using natural language schemas via RAG or SQL generation. |

---

## 3. LOGICAL DATABASE ARCHITECTURE

NeonDB is organized into three logical database layers to ensure scalability, security, and query efficiency:

### 3.1 Master Data Layer
Stores static or slow-changing master records. Provides the reference entities for all transactions.
* **Entities**: Companies, Customers, Vendors, Bank Accounts, Tax Configuration, Business Categories, Payment Terms, Recurring Expense/Revenue Templates.
* **Characteristics**: Highly normalized, unique constraints on tax identifiers, index-heavy on lookup names and registration keys.

### 3.2 Transaction Data Layer
Stores operational financial records, ledgers, schedules, and cash movements.
* **Entities**: Invoices, Purchase Orders, Sales Orders, Financial Transactions, Accounts Receivable, Accounts Payable, Payroll, Loans, Machine Maintenance, Raw Material Purchases, Utility/Electricity Bills.
* **Characteristics**: ACID-transactional, foreign key constrained to Master Data, partitionable by timestamp, index-optimized for date ranges and status codes.

### 3.3 Operational Metadata Layer
Maintains audit logs, ingestion states, confidence benchmarks, and trace tables.
* **Entities**: Document Registry, Processing Logs, Validation Status, Audit Trail, AI Processing History.
* **Characteristics**: Write-heavy, optimized for chronological queries, linked directly to the physical files and raw payloads.

---

## 4. MASTER DATA DESIGN

### Company Profiles (`companies`)
* **Purpose**: Represents the SME corporate entity running the platform.
* **Key Fields**: Name, Business Registration Number (e.g., EIN, GSTIN), Base Currency, Registration Address, Phone, Email.
* **Relationships**: Root parent of all tables. All tables have a mandatory `company_id` foreign key to support multi-tenant partitioning.

### Customer Profiles (`customers`)
* **Purpose**: Tracks B2B buyers who purchase manufactured goods or machining services from the SME.
* **Key Fields**: Company Ref, Customer Name, Tax Registration Code, Primary Email, Accounts Contact, Credit Limit, Default Payment Terms Ref.
* **Relationships**: Relates to `companies` (1:N) and `invoices` (1:N).

### Vendor Profiles (`vendors`)
* **Purpose**: Tracks suppliers of raw steel, alloys, tooling, gas, machinery parts, and industrial utilities.
* **Key Fields**: Company Ref, Vendor Name, Tax ID, Supplier Category (e.g., Raw Materials, Maintenance Services), Payment Terms Ref.
* **Relationships**: Relates to `companies` (1:N), `purchase_orders` (1:N), and `invoices` (1:N).

### Bank Accounts (`bank_accounts`)
* **Purpose**: Relational schema representing corporate savings, checking, and cash overdraft accounts.
* **Key Fields**: Company Ref, Bank Name, Account Number, Account Type, Current Balance, Ledger Balance, Currency Code.
* **Relationships**: Relates to `companies` (1:N) and bank statement `transactions` (1:N).

### Tax Configuration (`tax_configurations`)
* **Purpose**: Manages multi-regional tax parameters (GST, VAT, Sales Tax percentages) for compliance.
* **Key Fields**: Company Ref, Tax Code (e.g., CGST-9, VAT-20), Tax Type, Tax Rate (%).
* **Relationships**: Referenced by `invoice_line_items` to calculate specific levy margins.

### Payment Terms (`payment_terms_master`)
* **Purpose**: Configurable credit window templates.
* **Key Fields**: Term Name (e.g., "Net 30", "COD", "50% Advance/50% Net 15"), Due Days, Discount Days, Discount Percentage.
* **Relationships**: Referenced by `customers`, `vendors`, `invoices`, and `purchase_orders`.

### Recurring Templates (`recurring_templates`)
* **Purpose**: Master templates defining scheduled expenses (rent, software, service AMCs) or recurring revenue (retainers).
* **Key Fields**: Company Ref, Template Type (EXPENSE/REVENUE), Entity Ref (Vendor/Customer), Amount, Frequency (Monthly, Bi-weekly, Annual), Start Date, End Date.
* **Relationships**: Polled by Module 1 (Forecasting) to project future cash flows.

---

## 5. TRANSACTION DATA DESIGN

### Invoices (`invoices` & `invoice_line_items`)
* **Purpose**: Stores incoming bills (accounts payable) and outgoing sales invoices (accounts receivable).
* **Key Fields**: Invoice Number, Purchase Order Ref, Issue Date, Due Date, Payment Terms Ref, Subtotal, Tax Amount, Total Amount, Currency, Payment Status (Paid, Unpaid, Partially Paid, Overdue).
* **Line Items**: Description, Part Number (e.g., "MS-PLATE-10MM"), Quantity, Unit Price, Total Price, Tax Config Ref.
* **Relationships**: Relates to `vendors`/`customers` (N:1), `purchase_orders` (N:1), and matches to bank `transactions` during reconciliation.

### Purchase Orders (`purchase_orders`)
* **Purpose**: Outgoing procurement orders issued by the SME to vendors for raw inventory or tooling.
* **Key Fields**: PO Number, Vendor Ref, Date Issued, Delivery Due Date, Total Amount, PO Status (Draft, Approved, Fulfilled, Cancelled).
* **Relationships**: Maps 1:N to `invoices` during invoice validation.

### Sales Orders (`sales_orders`)
* **Purpose**: Customer orders accepted by the SME for manufacturing runs (machining, welding, stamping).
* **Key Fields**: Sales Order Number, Customer Ref, Order Date, Promised Delivery Date, Total Value, Order Status.
* **Relationships**: Maps 1:N to outgoing `invoices`.

### Financial Transactions (`transactions`)
* **Purpose**: Granular bank and cash ledger entries imported from statements or cash counters.
* **Key Fields**: Bank Account Ref, Transaction Date, Amount, Transaction Type (Debit/Credit), Reference Number (UTR, Cheque number), Reconciliation Status.
* **Relationships**: Relates to `bank_accounts` (N:1) and links to reconciled invoices (N:N via a junction table).

### Accounts Receivable (`accounts_receivable`)
* **Purpose**: Track aging, collections status, and expected incoming cash schedules.
* **Key Fields**: Customer Ref, Invoice Ref, Outstanding Balance, Expected Settlement Date, Collection Risk Category.
* **Relationships**: Populated by Module 0; updated by Module 3 (Follow-up) and reconciled against Transactions.

### Accounts Payable (`accounts_payable`)
* **Purpose**: Track payment liabilities and scheduled payment optimizations.
* **Key Fields**: Vendor Ref, Invoice Ref, Outstanding Balance, Scheduled Payment Date, Cash Discount Deadline.
* **Relationships**: Read and optimized by Module 4 (Optimizer) to preserve liquidity.

### Payroll (`payroll`)
* **Purpose**: Factory labor cost records.
* **Key Fields**: Employee Reference, Pay Period Start/End, Net Pay, Taxes Withheld, Payment Status, Payment Date.
* **Relationships**: Calculated as a cash outflow in forecasting calculations.

### Loans & Financing (`loans`)
* **Purpose**: Business loans, equipment leases (e.g., CNC financing), and lines of credit.
* **Key Fields**: Lender Name, Loan Principal, Interest Rate, Term (Months), Monthly EMI, Next Due Date.
* **Relationships**: Used in liquidity risk calculations.

### Raw Material Purchases (`raw_material_purchases`)
* **Purpose**: Itemized stock intake for materials (Mild Steel, Stainless Steel, Aluminum).
* **Key Fields**: Vendor Ref, Material Name, Quantity, Unit of Measure, Unit Price, Total Cost, Date Received.
* **Relationships**: Links to `purchase_orders` and `invoices` to track material pricing trends.

### Machine Maintenance (`machine_maintenance`)
* **Purpose**: Logs machine expenses (tool replacements, oil replacement, laser service).
* **Key Fields**: Machine ID, Maintenance Date, Vendor Ref (Service provider), Maintenance Cost, Maintenance Type (Routine, Breakdown).
* **Relationships**: Relates to `vendors` (N:1); provides forecasting details for future equipment AMC bills.

---

## 6. OPERATIONAL METADATA DESIGN

### Document Registry (`document_registry`)
* **Purpose**: Registry linking every database entry back to its source document (e.g. S3 file path).
* **Key Fields**: Document ID, Document Type (INVOICE, PO, LEDGER), File Hash, Original Name, Upload Timestamp, Storage URL.
* **Relationships**: Linked to `invoices` and `purchase_orders` via foreign keys.

### Validation Status (`validation_logs`)
* **Purpose**: Audits the validation pipeline of Module 0.
* **Key Fields**: Document Ref, Validation Date, Math Validity (Pass/Fail), Missing Fields List, Confidence Score, Error Code.
* **Relationships**: 1:1 with `document_registry`.

### Audit Trail (`system_audit_trail`)
* **Purpose**: Compliance logs detailing who edited, deleted, or manually resolved records.
* **Key Fields**: Transaction Ref, User Identifier, Change Type (Insert, Update, Delete, Manual Resolution), Previous State (JSONB), New State (JSONB), Timestamp.
* **Relationships**: Polymorphic references to target transactional tables.

---

## 7. TABLE RESPONSIBILITIES

| Logical Domain | Table Name | Primary Key | Foreign Keys | Domain Responsibility |
| :--- | :--- | :--- | :--- | :--- |
| **Master Data** | `companies` | `id` | None | Defines corporate tenant configuration. |
| **Master Data** | `customers` | `id` | `company_id` | Customer master registry. |
| **Master Data** | `vendors` | `id` | `company_id` | Supplier master registry. |
| **Master Data** | `bank_accounts` | `id` | `company_id` | Bank accounts and balances. |
| **Master Data** | `tax_configurations` | `id` | `company_id` | Tax rates dictionary. |
| **Master Data** | `payment_terms_master`| `id` | `company_id` | Credit policy definitions. |
| **Master Data** | `recurring_templates` | `id` | `company_id`, `vendor_id`, `customer_id` | Forecast templates. |
| **Transaction Data**| `purchase_orders` | `id` | `company_id`, `vendor_id` | Procurement authorization. |
| **Transaction Data**| `sales_orders` | `id` | `company_id`, `customer_id` | Order bookings from clients. |
| **Transaction Data**| `invoices` | `id` | `company_id`, `vendor_id`, `customer_id`, `purchase_order_id` | Relational invoice records. |
| **Transaction Data**| `invoice_line_items` | `id` | `invoice_id`, `tax_config_id` | Granular line items & parts. |
| **Transaction Data**| `transactions` | `id` | `company_id`, `bank_account_id` | Bank statements ledger. |
| **Transaction Data**| `accounts_receivable`| `id` | `company_id`, `customer_id`, `invoice_id` | Outstanding customer payments. |
| **Transaction Data**| `accounts_payable` | `id` | `company_id`, `vendor_id`, `invoice_id` | Outstanding supplier bills. |
| **Transaction Data**| `payroll` | `id` | `company_id` | Salary ledgers. |
| **Transaction Data**| `loans` | `id` | `company_id` | Financing liabilities. |
| **Transaction Data**| `raw_material_purchases`| `id`| `company_id`, `vendor_id`, `po_id` | Raw stock tracking. |
| **Transaction Data**| `machine_maintenance`| `id` | `company_id`, `vendor_id` | Factory asset upkeep ledger. |
| **Operational Metadata**| `document_registry`| `id` | `company_id` | Links relational rows to binary files. |
| **Operational Metadata**| `validation_logs` | `id` | `document_id` | Log of pipeline checks. |
| **Operational Metadata**| `system_audit_trail`| `id`| `company_id` | Audit tracking of manual changes. |

---

## 8. ENTITY RELATIONSHIP DIAGRAM (ERD)

The relational hierarchy below details the foreign key links between Master, Transaction, and Operational Metadata layers.

```
       [document_registry] <1-------1> [validation_logs]
                |
                |1
                |
                v 1
            [invoices] <1-------------N> [invoice_line_items]
             |      |
            N|      |N
             v      v
      [vendors]    [customers]
       ^   ^        ^   ^
      1|  1|       1|  1|
       |   +--------|---|----------------------+
       |            |   |                      |
       |1           |1  |1                     |1
 [purchase_orders]  |  [accounts_receivable]  [accounts_payable]
       ^            |
       |            |
       |N           |
  [raw_material_purchases]
                    |
                    +----------+
                               |
                               v
                       [bank_accounts] <1-------N> [transactions]
```

---

## 9. DATA FLOW LIFECYCLE

1. **Ingest Phase (Module 0)**:
   * Standardized JSON writes are executed in NeonDB.
   * `document_registry` is updated, locking the file hash.
   * New B2B entities are added to `vendors` or `customers` if missing.
   * Root transactions are committed to `invoices` or `purchase_orders`.
   * Open liabilities are created in `accounts_receivable` or `accounts_payable`.
2. **Forecasting Phase (Module 1)**:
   * Module 1 queries the historical transactions, active invoices, payroll, and recurring templates.
   * Generates a 30/60/90 day predictive cash flow ledger.
3. **Liquidity Assessment Phase (Module 2)**:
   * Module 2 reads the accounts receivable and payable schedules, cross-referencing expected settlement dates.
   * Identifies working capital shortfalls by contrasting bank account balances against upcoming payables and maintenance costs.
4. **Invoice Collection Phase (Module 3)**:
   * Module 3 queries `accounts_receivable` to locate invoices past their credit due dates.
   * Triggers payment notifications to customer contacts.
5. **Payables Scheduling Phase (Module 4)**:
   * Module 4 queries `accounts_payable` and evaluates payment windows.
   * Ranks payments by discount benefits and due dates, updating `scheduled_payment_date` in `accounts_payable`.
6. **Financial Copilot Reasoning (Module 5)**:
   * Module 5 accesses the database via natural language queries, retrieving real-time data across all schemas.

---

## 10. MODULE DEPENDENCY MATRIX

| Table Name | Module 0 | Module 1 | Module 2 | Module 3 | Module 4 | Module 5 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `companies` | R | R | R | R | R | R |
| `customers` | RW | R | R | R | - | R |
| `vendors` | RW | R | R | - | R | R |
| `bank_accounts` | R | R | R | - | R | R |
| `purchase_orders` | RW | R | R | - | R | R |
| `invoices` | RW | R | R | R | R | R |
| `transactions` | RW | R | R | - | R | R |
| `accounts_receivable`| RW | R | R | RW | - | R |
| `accounts_payable` | RW | R | R | - | RW | R |
| `payroll` | RW | R | R | - | - | R |
| `loans` | RW | R | R | - | - | R |
| `raw_material_purchases`| RW | R | R | - | - | R |
| `machine_maintenance`| RW | R | R | - | - | R |
| `document_registry` | RW | - | - | - | - | R |
| `validation_logs` | RW | - | - | - | - | R |
| `system_audit_trail` | RW | - | - | R | R | R |

*Legend: `R` = Read-Only, `RW` = Read-Write, `-` = No Access.*

---

## 11. TEXT-BASED DATABASE DIAGRAM

```
========================================================================================
                                     NEONDB LAYOUT
========================================================================================

    [ MASTER DATA LAYER ]
    +-------------------------------------------------------------------------------+
    | companies   <-- customers   <-- bank_accounts   <-- tax_configurations         |
    |             <-- vendors     <-- payment_terms   <-- recurring_templates       |
    +-------------------------------------------------------------------------------+
           |               |
           | (Has 1:N)     | (Has 1:N)
           v               v
    [ TRANSACTION DATA LAYER ]
    +-------------------------------------------------------------------------------+
    | purchase_orders   --> raw_material_purchases                                   |
    | sales_orders                                                                  |
    | invoices          --> invoice_line_items   --> accounts_receivable             |
    |                   --> machine_maintenance  --> accounts_payable               |
    | transactions      --> bank_reconcile                                          |
    | payroll           --> loans                                                   |
    +-------------------------------------------------------------------------------+
           ^
           | (Linked 1:1)
           |
    [ OPERATIONAL METADATA LAYER ]
    +-------------------------------------------------------------------------------+
    | document_registry <-- validation_logs <-- system_audit_trail                  |
    +-------------------------------------------------------------------------------+

========================================================================================
```

---

## 12. DESIGN DECISIONS AND RATIONALE

### 12.1 Normalization vs. Performance
The database uses **Third Normal Form (3NF)** normalization for all master registry entries. This design choice prevents data redundancy (e.g., updating a customer’s tax ID in a single location automatically cascades to all subsequent billing lookups). For downstream analytical forecasting (Module 1) that requires fast aggregations, indexes are built on transaction date and currency codes, avoiding denormalization while maintaining referential integrity.

### 12.2 Multi-Tenant Partitioning
To guarantee data isolation for different manufacturing companies using the platform, every table (except `companies` itself) contains a mandatory, index-backed `company_id` column. Every SQL query executed by the application layer must include `company_id = $1` in its `WHERE` clause.

### 12.3 ACID Transactions for Document Ingestion
When Module 0 processes an invoice, it populates several tables: `invoices`, `invoice_line_items`, `accounts_payable`, and `raw_material_purchases`. NeonDB’s strict PostgreSQL engine executes these inserts inside a unified SQL `TRANSACTION`. This guarantees that if any insert fails, the database rolls back to its original state, avoiding partial or orphan data writes.

### 12.4 Auditability and Ingest Integrity
The combination of `document_registry` and `system_audit_trail` provides auditability. If a manufacturing SME changes a total amount manually via a dashboard, the previous state generated by Gemma is archived in the audit logs. The system preserves a clear chain of custody from the raw file hash in S3 to the final record.
