import { convertPdfToMarkdown } from './pdf';
import { convertDocxToMarkdown } from './docx';
import { convertExcelToCsv } from './excel';

export interface ConversionResult {
  content: string;
  format: 'MARKDOWN' | 'CSV' | 'TEXT';
}

export async function convertDocument(
  buffer: Buffer,
  fileName: string
): Promise<ConversionResult> {
  const extension = fileName.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'pdf':
      return {
        content: await convertPdfToMarkdown(buffer, fileName),
        format: 'MARKDOWN'
      };
    case 'docx':
      return {
        content: await convertDocxToMarkdown(buffer, fileName),
        format: 'MARKDOWN'
      };
    case 'xlsx':
    case 'xls':
      return {
        content: await convertExcelToCsv(buffer, fileName),
        format: 'CSV'
      };
    case 'csv':
      return {
        content: buffer.toString('utf8'),
        format: 'CSV'
      };
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'tiff':
      return {
        content: buffer.toString('base64'),
        format: 'TEXT' // Will be routed to Puter.js Gemma Vision OCR
      };
    default:
      // Return plain text
      return {
        content: buffer.toString('utf8'),
        format: 'TEXT'
      };
  }
}
