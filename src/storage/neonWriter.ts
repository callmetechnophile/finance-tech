import * as db from '../config/database';
import { StandardFinancialRecord } from '../schema/financialSchema';

export interface StorageResult {
  success: boolean;
  invoiceId?: string;
  purchaseOrderId?: string;
  salesOrderId?: string;
  documentId?: string;
  quarantineId?: string;
  error?: string;
}

export async function writeRecordToNeon(
  record: StandardFinancialRecord,
  companyId: string,
  validationErrors?: string[]
): Promise<StorageResult> {
  const client = await db.getClient();
  const hasErrors = (validationErrors && validationErrors.length > 0) || record.validation_status === 'QUARANTINED';
  
  let documentId: string | undefined = undefined;

  try {
    // Start ACID transaction
    await client.query('BEGIN');

    // 1. Write to DOCUMENT REGISTRY (Always register processed files)
    const docResult = await client.query(
      `INSERT INTO document_registry (company_id, document_type, original_file_name, file_hash, storage_url)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (file_hash) DO UPDATE 
       SET storage_url = EXCLUDED.storage_url
       RETURNING id`,
      [
        companyId,
        record.document_type,
        record.source_document.file_name,
        record.source_document.file_hash,
        record.source_document.storage_url
      ]
    );
    documentId = docResult.rows[0].id;

    // 2. Write to VALIDATION LOGS
    const mathValid = !validationErrors?.some(e => e.includes('Math Mismatch') || e.includes('Sum Mismatch'));
    const missingFieldsText = validationErrors?.filter(e => e.includes('Schema Error') || e.includes('Missing')).join(', ') || null;
    const errorCode = validationErrors && validationErrors.length > 0 ? 'VALIDATION_FAILED' : null;

    await client.query(
      `INSERT INTO validation_logs (document_id, math_validity, missing_fields, confidence_score, error_code)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        documentId,
        mathValid,
        missingFieldsText,
        record.confidence_score,
        errorCode
      ]
    );

    // If quarantined, save in quarantine queue and commit transaction
    if (hasErrors) {
      const qResult = await client.query(
        `INSERT INTO quarantine_queue (company_id, raw_document_url, failed_json, failure_reason)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [
          companyId,
          record.source_document.storage_url,
          JSON.stringify(record),
          validationErrors ? validationErrors.join(' | ') : 'Manual or LLM marked Quarantine'
        ]
      );
      
      const quarantineId = qResult.rows[0].id;

      // Log the quarantine placement in system audit trail
      await client.query(
        `INSERT INTO system_audit_trail (company_id, change_type, target_table, record_id, previous_state, new_state)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          companyId,
          'QUARANTINE_PLACEMENT',
          'quarantine_queue',
          quarantineId,
          null,
          JSON.stringify(record)
        ]
      );

      await client.query('COMMIT');
      return {
        success: false,
        documentId,
        quarantineId,
        error: 'Record quarantined'
      };
    }

    // 3. Resolve Credit Payment Terms (Write to payment_terms_master if defined)
    let paymentTermId: string | null = null;
    if (record.payment_terms) {
      const termLookup = await client.query(
        'SELECT id FROM payment_terms_master WHERE company_id = $1 AND term_name = $2',
        [companyId, record.payment_terms]
      );

      if (termLookup.rows.length > 0) {
        paymentTermId = termLookup.rows[0].id;
      } else {
        // Parse days from term name (e.g. Net 30 -> 30, COD -> 0)
        let days = 30;
        const matches = record.payment_terms.match(/\d+/);
        if (matches) {
          days = parseInt(matches[0], 10);
        } else if (record.payment_terms.toLowerCase().includes('cod')) {
          days = 0;
        }

        const newTerm = await client.query(
          `INSERT INTO payment_terms_master (company_id, term_name, due_days)
           VALUES ($1, $2, $3)
           RETURNING id`,
          [companyId, record.payment_terms, days]
        );
        paymentTermId = newTerm.rows[0].id;
      }
    }

    // 4. Resolve Tax Configurations
    let taxConfigId: string | null = null;
    if (record.tax_details && record.tax_details.length > 0) {
      const mainTax = record.tax_details[0];
      const taxLookup = await client.query(
        'SELECT id FROM tax_configurations WHERE company_id = $1 AND tax_code = $2',
        [companyId, mainTax.tax_type]
      );

      if (taxLookup.rows.length > 0) {
        taxConfigId = taxLookup.rows[0].id;
      } else {
        const newTax = await client.query(
          `INSERT INTO tax_configurations (company_id, tax_code, tax_type, tax_rate)
           VALUES ($1, $2, $3, $4)
           RETURNING id`,
          [companyId, mainTax.tax_type, mainTax.tax_type, mainTax.rate]
        );
        taxConfigId = newTax.rows[0].id;
      }
    }

    // 5. Resolve Vendor
    let vendorId: string | null = null;
    if (record.vendor && record.vendor.name) {
      const vendorLookup = await client.query(
        `SELECT id FROM vendors 
         WHERE company_id = $1 AND (tax_id = $2 OR LOWER(vendor_name) = LOWER($3))`,
        [companyId, record.vendor.tax_id || null, record.vendor.name]
      );

      if (vendorLookup.rows.length > 0) {
        vendorId = vendorLookup.rows[0].id;
      } else {
        const newVendor = await client.query(
          `INSERT INTO vendors (company_id, vendor_name, tax_id, address, phone, email)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id`,
          [
            companyId,
            record.vendor.name,
            record.vendor.tax_id || null,
            record.vendor.address || null,
            record.vendor.phone || null,
            record.vendor.email || null
          ]
        );
        vendorId = newVendor.rows[0].id;
      }
    }

    // 6. Resolve Customer
    let customerId: string | null = null;
    if (record.customer && record.customer.name) {
      const customerLookup = await client.query(
        `SELECT id FROM customers 
         WHERE company_id = $1 AND (tax_id = $2 OR LOWER(customer_name) = LOWER($3))`,
        [companyId, record.customer.tax_id || null, record.customer.name]
      );

      if (customerLookup.rows.length > 0) {
        customerId = customerLookup.rows[0].id;
      } else {
        const newCustomer = await client.query(
          `INSERT INTO customers (company_id, customer_name, tax_id, address, phone, email)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id`,
          [
            companyId,
            record.customer.name,
            record.customer.tax_id || null,
            record.customer.address || null,
            record.customer.phone || null,
            record.customer.email || null
          ]
        );
        customerId = newCustomer.rows[0].id;
      }
    }

    let invoiceId: string | undefined = undefined;
    let purchaseOrderId: string | undefined = undefined;
    let salesOrderId: string | undefined = undefined;

    // 7. Document routing
    if (record.document_type === 'PURCHASE_ORDER') {
      const poResult = await client.query(
        `INSERT INTO purchase_orders (company_id, vendor_id, po_number, po_date, total_amount, currency, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [
          companyId,
          vendorId,
          record.purchase_order_number || `PO-MOCK-${Date.now()}`,
          record.issue_date,
          record.amount.total_amount,
          record.currency,
          'Issued'
        ]
      );
      purchaseOrderId = poResult.rows[0].id;

      // Handle raw material purchases link if category matches
      if (record.category.toLowerCase().includes('material') && record.line_items) {
        for (const item of record.line_items) {
          await client.query(
            `INSERT INTO raw_material_purchases (company_id, vendor_id, po_id, material_name, quantity, unit_of_measure, unit_price, total_cost)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              companyId,
              vendorId,
              purchaseOrderId,
              item.description,
              item.quantity,
              'units',
              item.unit_price,
              item.total_price
            ]
          );
        }
      }

      // Log in system audit trail
      await client.query(
        `INSERT INTO system_audit_trail (company_id, change_type, target_table, record_id, previous_state, new_state)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          companyId,
          'INSERT',
          'purchase_orders',
          purchaseOrderId,
          null,
          JSON.stringify(record)
        ]
      );

    } else if (record.document_type === 'UNKNOWN' && record.category.toLowerCase().includes('order')) {
      // Simulate Sales Order insertion for order files classified as unknown but named order
      const soResult = await client.query(
        `INSERT INTO sales_orders (company_id, customer_id, sales_order_number, order_date, total_value, order_status)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [
          companyId,
          customerId,
          `SO-MOCK-${Date.now()}`,
          record.issue_date,
          record.amount.total_amount,
          'Open'
        ]
      );
      salesOrderId = soResult.rows[0].id;

      await client.query(
        `INSERT INTO system_audit_trail (company_id, change_type, target_table, record_id, previous_state, new_state)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          companyId,
          'INSERT',
          'sales_orders',
          salesOrderId,
          null,
          JSON.stringify(record)
        ]
      );
    } else if (record.document_type === 'INVOICE' || record.document_type === 'BILL') {
      // Check if PO exists for cross-reference
      let resolvedPoId: string | null = null;
      if (record.purchase_order_number) {
        const poQuery = await client.query(
          'SELECT id FROM purchase_orders WHERE company_id = $1 AND po_number = $2',
          [companyId, record.purchase_order_number]
        );
        if (poQuery.rows.length > 0) {
          resolvedPoId = poQuery.rows[0].id;
        }
      }

      // Insert core Invoice record
      const invResult = await client.query(
        `INSERT INTO invoices (company_id, vendor_id, customer_id, invoice_number, purchase_order_id, issue_date, due_date, subtotal, tax_amount, total_amount, currency, payment_status, category, source_document_url, confidence_score, validation_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
         RETURNING id`,
        [
          companyId,
          vendorId,
          customerId,
          record.invoice_number || `INV-MOCK-${Date.now()}`,
          resolvedPoId,
          record.issue_date,
          record.due_date || null,
          record.amount.subtotal,
          record.amount.tax_amount,
          record.amount.total_amount,
          record.currency,
          record.payment_status,
          record.category,
          record.source_document.storage_url,
          record.confidence_score,
          'Valid'
        ]
      );
      invoiceId = invResult.rows[0].id;

      // Bulk insert line items linking to tax config
      if (record.line_items && record.line_items.length > 0) {
        for (const item of record.line_items) {
          await client.query(
            `INSERT INTO invoice_line_items (invoice_id, description, quantity, unit_price, total_price, part_number, tax_config_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              invoiceId,
              item.description,
              item.quantity,
              item.unit_price,
              item.total_price,
              item.part_number || null,
              taxConfigId
            ]
          );

          // Populate Raw Material Purchases table if the invoice is a DEBIT (vendor bill) and category matches raw stock
          if (record.transaction_type === 'DEBIT' && record.category.toLowerCase().includes('material')) {
            await client.query(
              `INSERT INTO raw_material_purchases (company_id, vendor_id, po_id, material_name, quantity, unit_of_measure, unit_price, total_cost, received_date)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
              [
                companyId,
                vendorId,
                resolvedPoId,
                item.description,
                item.quantity,
                'units',
                item.unit_price,
                item.total_price,
                record.issue_date
              ]
            );
          }
        }
      }

      // Populate Accounts Payable (DEBIT) or Accounts Receivable (CREDIT)
      if (record.transaction_type === 'DEBIT' && vendorId) {
        await client.query(
          `INSERT INTO accounts_payable (company_id, vendor_id, invoice_id, amount_due, due_date)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            companyId,
            vendorId,
            invoiceId,
            record.amount.total_amount,
            record.due_date || record.issue_date
          ]
        );
      } else if (record.transaction_type === 'CREDIT' && customerId) {
        await client.query(
          `INSERT INTO accounts_receivable (company_id, customer_id, invoice_id, amount_due, due_date)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            companyId,
            customerId,
            invoiceId,
            record.amount.total_amount,
            record.due_date || record.issue_date
          ]
        );
      }

      // Populate Machine Maintenance if invoice category matches maintenance
      if (record.category.toLowerCase().includes('maintenance')) {
        await client.query(
          `INSERT INTO machine_maintenance (company_id, machine_id, maintenance_date, vendor_id, cost, description, maintenance_type)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            companyId,
            'CNC-MAIN-001',
            record.issue_date,
            vendorId,
            record.amount.total_amount,
            record.line_items?.map(it => it.description).join(', ') || record.category,
            'Routine'
          ]
        );
      }

      // Write System Audit log
      await client.query(
        `INSERT INTO system_audit_trail (company_id, change_type, target_table, record_id, previous_state, new_state)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          companyId,
          'INSERT',
          'invoices',
          invoiceId,
          null,
          JSON.stringify(record)
        ]
      );
    }

    // Commit SQL transaction
    await client.query('COMMIT');

    return {
      success: true,
      documentId,
      invoiceId,
      purchaseOrderId,
      salesOrderId
    };

  } catch (err: any) {
    // Rollback transaction on failure
    await client.query('ROLLBACK');
    
    // Save to quarantine queue due to insertion/db failure
    try {
      const qResult = await client.query(
        `INSERT INTO quarantine_queue (company_id, raw_document_url, failed_json, failure_reason)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [
          companyId,
          record.source_document.storage_url,
          JSON.stringify(record),
          `DATABASE_TRANSACTION_FAILED: ${err.message}`
        ]
      );
      
      const quarantineId = qResult.rows[0].id;

      // Log rollback failure to audit trail
      if (documentId) {
        await client.query(
          `INSERT INTO system_audit_trail (company_id, change_type, target_table, record_id, previous_state, new_state)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            companyId,
            'ROLLBACK_QUARANTINE',
            'quarantine_queue',
            quarantineId,
            null,
            JSON.stringify(record)
          ]
        );
      }

      return {
        success: false,
        documentId,
        quarantineId,
        error: `Database transaction failed: ${err.message}. Record quarantined.`
      };
    } catch (qErr: any) {
      return {
        success: false,
        error: `Critical: Database failed and failed to write to quarantine: ${qErr.message}`
      };
    }
  } finally {
    client.release();
  }
}
