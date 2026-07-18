import { convertDocument } from '../src/converters';
import { performOcr } from '../src/ocr/puter';
import { parseWithGemma } from '../src/parser/gemma';
import { validateRecord } from '../src/validation/validator';
import { writeRecordToNeon, StorageResult } from '../src/storage/neonWriter';
import { MockDatabase } from '../src/config/database';
import * as fs from 'fs';
import * as path from 'path';

async function runDemo() {
  console.log('\n======================================================');
  console.log('      MODULE 0: DATA INGESTION ENGINE DEMO RUN       ');
  console.log('======================================================');

  const companyId = 'apex-manufacturing-uuid';
  MockDatabase.reset();

  // Load files
  const files = [
    { name: 'invoice.pdf', desc: 'Vendor Bill (PDF)' },
    { name: 'contract.docx', desc: 'Purchase Order Agreement (DOCX)' },
    { name: 'bank_statement.xlsx', desc: 'Bank Statement Sheet (Excel)' },
    { name: 'invoice_scan.png', desc: 'Camera Scan Invoice (PNG)' },
    { name: 'shop_ledger.png', desc: 'Handwritten Shop Floor Ledger (PNG)' }
  ];

  for (const fileInfo of files) {
    console.log(`\n--> Ingesting File: ${fileInfo.name} (${fileInfo.desc})`);
    
    const filePath = path.join(__dirname, 'mockData', fileInfo.name);
    const fileBuffer = fs.readFileSync(filePath);

    // 1. Conversion
    const conversion = await convertDocument(fileBuffer, fileInfo.name);
    console.log(`   [Converter] Formatted as: ${conversion.format}`);

    let textToParse = conversion.content;

    // 2. OCR if needed
    if (conversion.format === 'TEXT' && fileInfo.name.match(/\.(png|jpg|jpeg)$/i)) {
      console.log(`   [OCR Engine] Performing Puter.js layout extraction...`);
      textToParse = await performOcr(conversion.content, fileInfo.name);
    }

    // 3. Parser
    console.log(`   [Gemma parser] Processing financial schema mapping...`);
    const record = await parseWithGemma(textToParse, fileInfo.name);
    console.log(`   [Gemma parser] Classified document: ${record.document_type} | Category: ${record.category}`);

    // 4. Validate
    console.log(`   [Validator] Checking math, dates, and duplicates...`);
    const validation = await validateRecord(record, companyId);
    console.log(`   [Validator] Validation Result: ${validation.isValid ? 'PASS' : 'FAIL'}`);
    if (!validation.isValid) {
      console.log(`   [Validator] Errors: ${validation.errors.join(' | ')}`);
      record.validation_status = 'QUARANTINED';
    }

    // 5. Store
    console.log(`   [Database ACID Writer] Persisting transaction transactionally...`);
    const dbResult = await writeRecordToNeon(record, companyId, validation.errors);
    if (dbResult.success) {
      console.log(`   [Database ACID Writer] Saved. Link: Invoice ID: ${dbResult.invoiceId || 'N/A'} | PO ID: ${dbResult.purchaseOrderId || 'N/A'} | SO ID: ${dbResult.salesOrderId || 'N/A'}`);
    } else {
      console.log(`   [Database ACID Writer] Quarantined. Log ID: ${dbResult.quarantineId}`);
    }
  }

  // Inject a failure case (duplicate check)
  console.log('\n--> Injecting Duplicate Invoice Check...');
  const duplicatePath = path.join(__dirname, 'mockData', 'invoice.pdf');
  const duplicateBuffer = fs.readFileSync(duplicatePath);
  const convDup = await convertDocument(duplicateBuffer, 'invoice.pdf');
  const recDup = await parseWithGemma(convDup.content, 'invoice.pdf');
  
  const valDup = await validateRecord(recDup, companyId);
  console.log(`   [Validator] Validation Result: ${valDup.isValid ? 'PASS' : 'FAIL'}`);
  console.log(`   [Validator] Expected Error: ${valDup.errors[0]}`);
  
  const writeDup = await writeRecordToNeon(recDup, companyId, valDup.errors);
  console.log(`   [Database ACID Writer] Result: Quarantined: ${!writeDup.success} | Log ID: ${writeDup.quarantineId}`);

  console.log('\n======================================================');
  console.log('         NEON OPERATIONAL DATABASE SUMMARY           ');
  console.log('======================================================');
  console.log(`Companies Registered:      ${MockDatabase.companies.length}`);
  console.log(`Vendors Discovered:        ${MockDatabase.vendors.length}`);
  console.log(`Customers Discovered:      ${MockDatabase.customers.length}`);
  console.log(`Tax Config Entries:        ${MockDatabase.tax_configurations.length}`);
  console.log(`Payment Terms Registered:  ${MockDatabase.payment_terms_master.length}`);
  
  console.log('------------------------------------------------------');
  console.log(`Invoices Persisted:        ${MockDatabase.invoices.length}`);
  console.log(`Purchase Orders Captured:  ${MockDatabase.purchase_orders.length}`);
  console.log(`Sales Orders Captured:     ${MockDatabase.sales_orders.length}`);
  console.log(`Invoice Line Items:        ${MockDatabase.invoice_line_items.length}`);
  console.log(`Accounts Payable Ledger:   ${MockDatabase.accounts_payable.length}`);
  console.log(`Accounts Receivable Ledger:${MockDatabase.accounts_receivable.length}`);
  console.log(`Machine Maintenance Log:   ${MockDatabase.machine_maintenance.length}`);
  console.log(`Raw Material Purchases:    ${MockDatabase.raw_material_purchases.length}`);
  
  console.log('------------------------------------------------------');
  console.log(`Document Registry Logs:    ${MockDatabase.document_registry.length}`);
  console.log(`Pipeline Validation Logs:  ${MockDatabase.validation_logs.length}`);
  console.log(`System Audit Trail Events: ${MockDatabase.system_audit_trail.length}`);
  console.log(`Quarantine Review Queue:   ${MockDatabase.quarantine_queue.length}`);
  console.log('======================================================\n');
}

runDemo();
export { runDemo };
