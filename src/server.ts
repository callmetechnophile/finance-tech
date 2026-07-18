import fastify from 'fastify';
import multipart from '@fastify/multipart';
import { convertDocument } from './converters';
import { performOcr } from './ocr/puter';
import { parseWithGemma } from './parser/gemma';
import { validateRecord } from './validation/validator';
import { writeRecordToNeon } from './storage/neonWriter';
import * as db from './config/database';

const server = fastify({ logger: true });

// Register multipart support for handling file uploads
server.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Health check endpoint
server.get('/health', async () => {
  return { status: 'OK', database: db.isRealDbConfigured() ? 'Postgres' : 'Mock' };
});

// Ingest endpoint: Processes PDF, DOCX, CSV, Excel, PNG, JPG files
server.post('/api/ingest', async (request, reply) => {
  const data = await request.file();
  if (!data) {
    return reply.status(400).send({ error: 'No file uploaded' });
  }

  // Retrieve headers or use default company ID
  const companyId = (request.headers['x-company-id'] as string) || 'mock-company-uuid';

  try {
    const fileBuffer = await data.toBuffer();
    const fileName = data.filename;
    
    // 1. Convert document format to standard text / MD / CSV
    const conversion = await convertDocument(fileBuffer, fileName);
    
    let textToParse = conversion.content;
    
    // 2. If it's an image, perform OCR layout preservation using Puter.js
    if (conversion.format === 'TEXT' && (fileName.match(/\.(png|jpg|jpeg|tiff)$/i))) {
      textToParse = await performOcr(conversion.content, fileName);
    }
    
    // 3. Extract entities & schema values with Gemma LLM Parser
    const confidenceScoreOverride = request.headers['x-confidence-score'] 
      ? parseFloat(request.headers['x-confidence-score'] as string) 
      : undefined;

    const parsedRecord = await parseWithGemma(textToParse, fileName, confidenceScoreOverride);
    
    // 4. Validate output schema & business calculations
    const validation = await validateRecord(parsedRecord, companyId);
    
    // 5. Store record in database tables (invoices, raw materials, etc.)
    if (!validation.isValid) {
      parsedRecord.validation_status = 'QUARANTINED';
    }
    
    const dbResult = await writeRecordToNeon(parsedRecord, companyId, validation.errors);
    
    return {
      message: dbResult.success ? 'Document parsed and saved successfully' : 'Document quarantined due to validation failures',
      isValid: validation.isValid,
      errors: validation.errors,
      record: parsedRecord,
      dbResult
    };

  } catch (err: any) {
    request.log.error(err);
    return reply.status(500).send({
      error: 'Failed to process document',
      details: err.message
    });
  }
});

// GET /api/quarantine: Returns items flagged in the review queue
server.get('/api/quarantine', async (request, reply) => {
  try {
    const companyId = (request.headers['x-company-id'] as string) || 'mock-company-uuid';
    const result = await db.query(
      'SELECT id, raw_document_url, failed_json, failure_reason, resolved, created_at FROM quarantine_queue WHERE company_id = $1 AND resolved = false',
      [companyId]
    );
    return result.rows;
  } catch (err: any) {
    return reply.status(500).send({ error: 'Failed to query quarantine queue', details: err.message });
  }
});

// POST /api/quarantine/:id/resolve: Manually corrects a quarantine item and posts to master tables
server.post('/api/quarantine/:id/resolve', async (request, reply) => {
  const { id } = request.params as { id: string };
  const companyId = (request.headers['x-company-id'] as string) || 'mock-company-uuid';
  const correctedBody = request.body as any;

  if (!correctedBody) {
    return reply.status(400).send({ error: 'No correction payload provided' });
  }

  const client = await db.getClient();
  try {
    // Check if quarantine item exists
    const qQuery = await client.query(
      'SELECT id, resolved FROM quarantine_queue WHERE id = $1 AND company_id = $2',
      [id, companyId]
    );

    if (qQuery.rows.length === 0) {
      return reply.status(404).send({ error: 'Quarantined document not found' });
    }

    if (qQuery.rows[0].resolved) {
      return reply.status(400).send({ error: 'Document has already been resolved' });
    }

    // Set validation status to VALID since it is now manually corrected
    correctedBody.validation_status = 'VALID';

    // Validate the corrected manual record
    const validation = await validateRecord(correctedBody, companyId);
    if (!validation.isValid) {
      return reply.status(400).send({
        error: 'Manual corrections did not pass financial validation checks',
        errors: validation.errors
      });
    }

    // Begin database transaction for storage
    await client.query('BEGIN');

    // Run writing pipeline using transaction client
    const writeResult = await writeRecordToNeon(correctedBody, companyId);
    if (!writeResult.success) {
      throw new Error(writeResult.error || 'Failed to write record during resolution');
    }

    // Mark quarantine entry as resolved
    await client.query(
      'UPDATE quarantine_queue SET resolved = true WHERE id = $1',
      [id]
    );

    await client.query('COMMIT');
    return {
      message: 'Document successfully resolved from quarantine queue',
      writeResult
    };

  } catch (err: any) {
    await client.query('ROLLBACK');
    return reply.status(500).send({ error: 'Failed to resolve quarantine document', details: err.message });
  } finally {
    client.release();
  }
});

export { server };
