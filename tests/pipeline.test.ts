import { convertDocument } from '../src/converters';
import { performOcr } from '../src/ocr/puter';
import { parseWithGemma } from '../src/parser/gemma';
import { validateRecord } from '../src/validation/validator';
import { writeRecordToNeon } from '../src/storage/neonWriter';
import { MockDatabase } from '../src/config/database';
import * as fs from 'fs';
import * as path from 'path';

describe('Module 0: Financial Intake & Standardization Integration Pipeline', () => {
  const companyId = 'test-company-uuid';

  beforeEach(() => {
    // Reset mock database states before each test run
    MockDatabase.reset();
  });

  test('E2E Success Path: PDF Ingestion & DB ACID Write', async () => {
    // 1. Load mock PDF invoice
    const pdfPath = path.join(__dirname, 'mockData', 'invoice.pdf');
    const pdfBuffer = fs.readFileSync(pdfPath);

    // 2. Convert to Markdown
    const conversion = await convertDocument(pdfBuffer, 'invoice.pdf');
    expect(conversion.format).toBe('MARKDOWN');
    expect(conversion.content).toContain('Steel Traders Inc');

    // 3. Extract JSON schema via Gemma parser
    const record = await parseWithGemma(conversion.content, 'invoice.pdf');
    expect(record.document_type).toBe('INVOICE');
    expect(record.vendor.name).toBe('Steel Traders Inc');
    expect(record.amount.total_amount).toBe(2242.00);

    // 4. Validate record
    const validation = await validateRecord(record, companyId);
    expect(validation.isValid).toBe(true);

    // 5. Store record in DB
    const dbResult = await writeRecordToNeon(record, companyId);
    expect(dbResult.success).toBe(true);
    expect(dbResult.invoiceId).toBeDefined();
    expect(dbResult.documentId).toBeDefined();

    // Verify mock database table contents (original tables)
    expect(MockDatabase.invoices.length).toBe(1);
    expect(MockDatabase.invoices[0].invoice_number).toBe('INV-2026-004');
    expect(MockDatabase.vendors.length).toBe(1);
    expect(MockDatabase.vendors[0].vendor_name).toBe('Steel Traders Inc');
    expect(MockDatabase.accounts_payable.length).toBe(1);
    expect(MockDatabase.accounts_payable[0].amount_due).toBe(2242.00);
    expect(MockDatabase.raw_material_purchases.length).toBe(2);

    // Verify mock database table contents (new aligned schema tables)
    expect(MockDatabase.document_registry.length).toBe(1);
    expect(MockDatabase.document_registry[0].original_file_name).toBe('invoice.pdf');
    expect(MockDatabase.document_registry[0].file_hash).toBe('hash-steel-traders-1234');
    expect(MockDatabase.validation_logs.length).toBe(1);
    expect(MockDatabase.validation_logs[0].math_validity).toBe(true);
    expect(MockDatabase.system_audit_trail.length).toBe(1);
    expect(MockDatabase.system_audit_trail[0].change_type).toBe('INSERT');
    expect(MockDatabase.system_audit_trail[0].target_table).toBe('invoices');
    expect(MockDatabase.payment_terms_master.length).toBe(1);
    expect(MockDatabase.payment_terms_master[0].term_name).toBe('Net 30');
    expect(MockDatabase.tax_configurations.length).toBe(1);
    expect(MockDatabase.tax_configurations[0].tax_code).toBe('GST');
    expect(MockDatabase.tax_configurations[0].tax_rate).toBe(18);
  });

  test('E2E Success Path: Ingest PNG invoice scan', async () => {
    const pngPath = path.join(__dirname, 'mockData', 'invoice_scan.png');
    const pngBuffer = fs.readFileSync(pngPath);

    const conversion = await convertDocument(pngBuffer, 'invoice_scan.png');
    expect(conversion.format).toBe('TEXT');

    const ocrText = await performOcr(conversion.content, 'invoice_scan.png');
    expect(ocrText).toContain('LaserTech Cutting Solutions');

    const record = await parseWithGemma(ocrText, 'invoice_scan.png');
    expect(record.document_type).toBe('INVOICE');
    expect(record.vendor.name).toBe('LaserTech Cutting Solutions');
    expect(record.amount.total_amount).toBe(1155.00);

    const validation = await validateRecord(record, companyId);
    expect(validation.isValid).toBe(true);

    const dbResult = await writeRecordToNeon(record, companyId);
    expect(dbResult.success).toBe(true);
    expect(MockDatabase.invoices.length).toBe(1);
    expect(MockDatabase.accounts_payable.length).toBe(1);

    // Verify metadata logging
    expect(MockDatabase.document_registry.length).toBe(1);
    expect(MockDatabase.document_registry[0].original_file_name).toBe('invoice_scan.png');
    expect(MockDatabase.validation_logs.length).toBe(1);
    expect(MockDatabase.validation_logs[0].confidence_score).toBe(0.95);
    expect(MockDatabase.system_audit_trail.length).toBe(1);
  });

  test('Failure Route: Math Mismatch triggers Quarantine Queue', async () => {
    const pdfPath = path.join(__dirname, 'mockData', 'invoice.pdf');
    const pdfBuffer = fs.readFileSync(pdfPath);
    const conversion = await convertDocument(pdfBuffer, 'invoice.pdf');
    const record = await parseWithGemma(conversion.content, 'invoice.pdf');

    record.amount.total_amount = 500000.00;

    const validation = await validateRecord(record, companyId);
    expect(validation.isValid).toBe(false);
    expect(validation.errors[0]).toContain('Math Mismatch');

    const dbResult = await writeRecordToNeon(record, companyId, validation.errors);
    expect(dbResult.success).toBe(false);
    expect(dbResult.quarantineId).toBeDefined();

    expect(MockDatabase.invoices.length).toBe(0);
    expect(MockDatabase.quarantine_queue.length).toBe(1);
    expect(MockDatabase.quarantine_queue[0].failure_reason).toContain('Math Mismatch');

    // Verify metadata still registered
    expect(MockDatabase.document_registry.length).toBe(1);
    expect(MockDatabase.validation_logs.length).toBe(1);
    expect(MockDatabase.validation_logs[0].math_validity).toBe(false); // Math validity is marked false!
    expect(MockDatabase.system_audit_trail.length).toBe(1);
    expect(MockDatabase.system_audit_trail[0].change_type).toBe('QUARANTINE_PLACEMENT');
  });

  test('Failure Route: Low Confidence Score (< 0.85) triggers Quarantine Queue', async () => {
    const pdfPath = path.join(__dirname, 'mockData', 'invoice.pdf');
    const pdfBuffer = fs.readFileSync(pdfPath);
    const conversion = await convertDocument(pdfBuffer, 'invoice.pdf');
    
    const record = await parseWithGemma(conversion.content, 'invoice.pdf', 0.65);
    expect(record.confidence_score).toBe(0.65);

    const validation = await validateRecord(record, companyId);
    expect(validation.isValid).toBe(false);
    expect(validation.errors[0]).toContain('Confidence Threshold Mismatch');

    const dbResult = await writeRecordToNeon(record, companyId, validation.errors);
    expect(dbResult.success).toBe(false);
    expect(MockDatabase.invoices.length).toBe(0);
    expect(MockDatabase.quarantine_queue.length).toBe(1);

    // Verify metadata
    expect(MockDatabase.document_registry.length).toBe(1);
    expect(MockDatabase.validation_logs.length).toBe(1);
    expect(MockDatabase.validation_logs[0].confidence_score).toBe(0.65);
    expect(MockDatabase.validation_logs[0].error_code).toBe('VALIDATION_FAILED');
  });

  test('Failure Route: Duplicate Invoice prevention', async () => {
    const pdfPath = path.join(__dirname, 'mockData', 'invoice.pdf');
    const pdfBuffer = fs.readFileSync(pdfPath);
    const conversion = await convertDocument(pdfBuffer, 'invoice.pdf');
    const record = await parseWithGemma(conversion.content, 'invoice.pdf');

    const dbResult1 = await writeRecordToNeon(record, companyId);
    expect(dbResult1.success).toBe(true);

    const validation2 = await validateRecord(record, companyId);
    expect(validation2.isValid).toBe(false);
    expect(validation2.errors[0]).toContain('Duplicate Invoice Detection');

    const dbResult2 = await writeRecordToNeon(record, companyId, validation2.errors);
    expect(dbResult2.success).toBe(false);
    expect(MockDatabase.quarantine_queue.length).toBe(1);
  });
});
