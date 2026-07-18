export async function performOcr(base64Content: string, fileName: string): Promise<string> {
  // In a production app, this would use a real HTTP client to execute OCR via Puter.js and Gemma Vision:
  // e.g. puter.ai.vision(...) or calling Puter's serverless JS API
  //
  // For this prototype, we simulate the Puter.js OCR and Gemma Vision behavior.
  
  let decoded = '';
  try {
    decoded = Buffer.from(base64Content, 'base64').toString('utf8');
  } catch (err) {
    decoded = base64Content;
  }
  
  if (base64Content.includes('__MOCK_PNG_INVOICE__') || decoded.includes('__MOCK_PNG_INVOICE__')) {
    return `
=== OCR EXTRACTED TEXT FROM IMAGE (Puter.js + Gemma Vision) ===
INVOICE NUMBER: INV-2026-9901
Date: 2026-07-17
Due Date: 2026-08-17
Vendor: LaserTech Cutting Solutions
Tax ID: GSTIN88881111
Address: 100 Laser Beam Blvd, Fabrication Area
Customer: Apex CNC Machining
Tax ID: GSTIN11223344
Address: 44 Shop Floor Way, Fabrication Park
Currency: USD

Items:
1. Laser Cutting Mild Steel - Qty: 200.00 - Unit Price: 4.50 - Total: 900.00
2. Setup and Programming fee - Qty: 1.00 - Unit Price: 150.00 - Total: 150.00

Subtotal: 1050.00
Tax Rate: 10%
Tax Amount: 105.00
Total Amount: 1155.00
Payment Terms: Net 30
Category: Raw Material Purchases
`;
  }

  if (base64Content.includes('__MOCK_HANDWRITTEN_LEDGER__') || decoded.includes('__MOCK_HANDWRITTEN_LEDGER__')) {
    return `
=== OCR EXTRACTED TEXT FROM HANDWRITTEN IMAGE (Puter.js + Gemma Vision) ===
[PAGE 42: SHOP FLOOR EXPENSE LEDGER]
Date: 15/07/2026
Factory: Apex CNC Machining Shop Floor
Operator: John Doe

Entries:
- Tooling vendor: Carbide Drill Bits purchased from Tooling Supply Corp for USD 120.00. (Cash paid from office register)
- Lubricant oil: 5 Liters for CNC lathe, cost: USD 45.00 paid.
- Welding repairs: Done by local welder: Welders Ltd. Invoice ref: WL-101. Total cost: USD 250.00. Not yet paid.
- Operator snacks: USD 15.00 cash paid.

Summary of cash outflows:
Drills: 120.00 USD (Paid)
Oil: 45.00 USD (Paid)
Welding: 250.00 USD (Unpaid)
Snacks: 15.00 USD (Paid)

Total cash out: 180.00 USD
Total pending bill: 250.00 USD
`;
  }

  // General fallback OCR output
  return `Generic OCR output for file ${fileName}. Raw text contents could not be classified.`;
}
