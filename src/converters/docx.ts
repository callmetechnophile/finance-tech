export async function convertDocxToMarkdown(buffer: Buffer, fileName: string): Promise<string> {
  // In a production environment, this would call a DOCX-to-text parsing utility (e.g. mammoth, docx2txt).
  // For the prototype, we handle our mock testing triggers, or extract ASCII blocks.
  
  const rawText = buffer.toString('utf8');
  
  if (rawText.includes('__MOCK_DOCX_CONTRACT__')) {
    return `
# CONTRACT & PURCHASE ORDER AGREEMENT

**PO Number:** PO-2026-8899
**Vendor:** Tooling Supply Corp
**Customer:** Apex CNC Machining
**Issue Date:** 2026-07-16
**Total Amount:** 500.00
**Currency:** USD

**Agreement Terms:**
This purchase agreement covers the supply of CNC milling inserts and tool holders. 
Standard delivery challan must accompany items.

**Items:**
1. CNC Carbide Inserts - 10 packs - Unit: $35.00 - Total: $350.00
2. Collet Chuck ER32 - 3 units - Unit: $50.00 - Total: $150.00

**Calculations:**
Subtotal: 500.00
Tax: 0.00
Grand Total: 500.00
`;
  }

  const cleanLines = rawText
    .replace(/[^\x20-\x7E\n]/g, '')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  return `# DOCX Document: ${fileName}\n\n${cleanLines.join('\n')}`;
}
