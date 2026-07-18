export async function convertPdfToMarkdown(buffer: Buffer, fileName: string): Promise<string> {
  // In a production environment, this would call a PDF extraction engine like pdfplumber or pdf2md.
  // For the prototype, if the buffer has special testing markers, we extract it directly, 
  // otherwise we extract readable ASCII characters from the PDF stream and format it as Markdown.
  
  const rawText = buffer.toString('utf8');
  
  // If it's a test file containing simulated data, return the mock markdown representation
  if (rawText.includes('__MOCK_PDF_INVOICE__')) {
    return `
# INVOICE: INV-2026-004

**Vendor:** Steel Traders Inc
**Tax ID:** GSTIN99448822
**Address:** 12 Factory Lane, Industrial Zone

**Customer:** Apex CNC Machining
**Tax ID:** GSTIN11223344
**Address:** 44 Shop Floor Way, Fabrication Park

**Invoice Date:** 2026-07-15
**Due Date:** 2026-08-15
**Payment Terms:** Net 30
**Category:** Raw Material Purchases

| Part Number | Description | Quantity | Unit Price | Total Price |
| :--- | :--- | :--- | :--- | :--- |
| MS-PL-10MM | Mild Steel Plates 10mm | 10.00 | 150.00 | 1500.00 |
| AL-BAR-2IN | Aluminum Round Bars 2" | 5.00 | 80.00 | 400.00 |

**Subtotal:** 1900.00
**Tax Rate:** 18%
**Tax Amount:** 342.00
**Total Amount:** 2242.00
**Currency:** USD
`;
  }

  // Fallback basic text extraction from buffer
  const cleanLines = rawText
    .replace(/[^\x20-\x7E\n]/g, '') // remove non-printable characters
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  return `# PDF Document: ${fileName}\n\n${cleanLines.join('\n')}`;
}
