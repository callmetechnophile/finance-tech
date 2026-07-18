# Module 0 - Financial Data Intake & Standardization Engine

This is the codebase for **Module 0 – Financial Data Intake & Standardization Engine** of the AI-powered Financial Copilot for Manufacturing SMEs.

## Architecture Pipeline
1. **Ingestion**: Upload document (Invoice, Receipts, Purchase Orders, Ledgers, Bank Statements).
2. **Converters**: Route based on extension. Convert PDF/DOCX to Markdown and Excel to CSV.
3. **OCR**: If the document is an image, run layout-preserving OCR via Puter.js (using Gemma Vision).
4. **Gemma Parser**: Feed layout text / Markdown / CSV into the Gemma Financial Parser to structure it as schema-compliant JSON.
5. **Validator**: Validate JSON structure, dates, and mathematical operations ($Subtotal - Discount + Tax = Total$). Query NeonDB for duplicate records.
6. **ACID Storage**: Write to NeonDB target tables inside a Postgres transaction, or quarantine invalid documents in `quarantine_queue` for B2B dashboard inspection.

---

## Installation

Install project dependencies:
```bash
npm install
```

## Running the Demo

Run the end-to-end integration demo showing conversions, LLM parsing, validations, and virtual database population for all 5 target formats:
```bash
npm run demo
```

## Running Tests

Execute Jest unit and integration tests covering the pipelines, mathematical checks, confidence thresholds, and duplicate detection:
```bash
npm test
```

## File Tour
* [architecture_document.md](file:///C:/Users/worka/.gemini/antigravity/scratch/SME-FINANCE-SOLUTION/architecture_document.md): Full architectural specification document.
* [src/schema/financialSchema.ts](file:///C:/Users/worka/.gemini/antigravity/scratch/SME-FINANCE-SOLUTION/src/schema/financialSchema.ts): Universal JSON Schema definitions.
* [src/config/database.ts](file:///C:/Users/worka/.gemini/antigravity/scratch/SME-FINANCE-SOLUTION/src/config/database.ts): Database client with fallback mock DB engine.
* [src/validation/validator.ts](file:///C:/Users/worka/.gemini/antigravity/scratch/SME-FINANCE-SOLUTION/src/validation/validator.ts): Math, date, and duplicate validation engine.
* [src/storage/neonWriter.ts](file:///C:/Users/worka/.gemini/antigravity/scratch/SME-FINANCE-SOLUTION/src/storage/neonWriter.ts): ACID transaction database mapper.
* [tests/pipeline.test.ts](file:///C:/Users/worka/.gemini/antigravity/scratch/SME-FINANCE-SOLUTION/tests/pipeline.test.ts): Integrated Jest test suites.
