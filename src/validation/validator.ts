import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { StandardFinancialRecord, financialSchema } from '../schema/financialSchema';
import * as db from '../config/database';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validateSchema = ajv.compile(financialSchema);

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  quarantineReason?: string;
}

export async function validateRecord(
  record: StandardFinancialRecord,
  companyId: string
): Promise<ValidationResult> {
  const errors: string[] = [];

  // 1. Schema Validation (Structure, required fields, formats, regex)
  const schemaValid = validateSchema(record);
  if (!schemaValid && validateSchema.errors) {
    for (const err of validateSchema.errors) {
      errors.push(`Schema Error: ${err.instancePath} ${err.message}`);
    }
  }

  // If schema is fundamentally broken, return immediately as quarantined
  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      quarantineReason: 'FAILED_SCHEMA_VALIDATION'
    };
  }

  // 2. Math Verification
  const subtotal = record.amount.subtotal;
  const discount = record.amount.discount || 0;
  const taxAmount = record.amount.tax_amount;
  const totalAmount = record.amount.total_amount;

  const expectedTotal = subtotal - discount + taxAmount;
  const totalDifference = Math.abs(totalAmount - expectedTotal);

  if (totalDifference > 0.02) {
    errors.push(`Math Mismatch: Total Amount (${totalAmount}) does not equal expected (${expectedTotal.toFixed(2)}) based on Subtotal (${subtotal}) - Discount (${discount}) + Tax (${taxAmount}).`);
  }

  // Verify Line Items Sum
  if (record.line_items && record.line_items.length > 0) {
    let lineItemsSum = 0;
    for (const item of record.line_items) {
      const expectedItemTotal = item.quantity * item.unit_price;
      const itemDifference = Math.abs(item.total_price - expectedItemTotal);
      if (itemDifference > 0.02) {
        errors.push(`Line Item Math Mismatch: Line item "${item.description}" total price (${item.total_price}) does not match quantity (${item.quantity}) * unit price (${item.unit_price}).`);
      }
      lineItemsSum += item.total_price;
    }

    const subtotalDifference = Math.abs(lineItemsSum - subtotal);
    if (subtotalDifference > 0.02) {
      errors.push(`Line Item Sum Mismatch: The sum of line items (${lineItemsSum.toFixed(2)}) does not equal Subtotal (${subtotal}).`);
    }
  }

  // 3. Date Integrity Checks
  const issueDate = new Date(record.issue_date);
  const now = new Date();
  // Allow 24 hours buffer for timezone offsets
  const futureThreshold = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  if (isNaN(issueDate.getTime())) {
    errors.push(`Date Error: Issue date "${record.issue_date}" is not a valid date.`);
  } else if (issueDate > futureThreshold) {
    errors.push(`Date Error: Issue date "${record.issue_date}" is in the future.`);
  }

  if (record.due_date) {
    const dueDate = new Date(record.due_date);
    if (isNaN(dueDate.getTime())) {
      errors.push(`Date Error: Due date "${record.due_date}" is not a valid date.`);
    } else if (dueDate < issueDate) {
      errors.push(`Date Error: Due date "${record.due_date}" is before issue date "${record.issue_date}".`);
    }
  }

  // 4. Confidence Threshold Check
  const minConfidence = 0.85;
  if (record.confidence_score < minConfidence) {
    errors.push(`Confidence Threshold Mismatch: Confidence score (${record.confidence_score}) is below the required threshold of (${minConfidence}).`);
  }

  // 5. Duplicate Check
  // We resolve vendor id if we can fuzzy match them, then query
  if (record.invoice_number && record.vendor.name) {
    try {
      // Find matching vendor ID first
      const vendorQuery = await db.query(
        'SELECT id FROM vendors WHERE company_id = $1 AND (tax_id = $2 OR LOWER(vendor_name) = LOWER($3))',
        [companyId, record.vendor.tax_id || null, record.vendor.name]
      );
      
      if (vendorQuery.rows.length > 0) {
        const vendorId = vendorQuery.rows[0].id;
        // Check duplicate invoice
        const invoiceQuery = await db.query(
          'SELECT id FROM invoices WHERE company_id = $1 AND vendor_id = $2 AND invoice_number = $3',
          [companyId, vendorId, record.invoice_number]
        );
        if (invoiceQuery.rows.length > 0) {
          errors.push(`Duplicate Invoice Detection: Invoice number "${record.invoice_number}" already exists for Vendor "${record.vendor.name}".`);
        }
      }
    } catch (err: any) {
      errors.push(`Database Check Error: ${err.message}`);
    }
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    quarantineReason: isValid ? undefined : 'VALIDATION_FAILED'
  };
}
