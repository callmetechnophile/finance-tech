"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Documentation() {
  const [activeDocsTab, setActiveDocsTab] = useState<"api" | "sdk" | "examples">("api");

  const docsCode = {
    api: `POST /v1/documents/ingest HTTP/1.1
Host: api.forgepath.com
Authorization: Bearer fp_live_8829...
Content-Type: multipart/form-data

{
  "file": "@invoice_US_9021.pdf",
  "metadata": {
    "auto_classify": true,
    "ocr_precision": "high"
  }
}`,
    sdk: `import { ForgePath } from "@forge-path/node";

const client = new ForgePath({ apiKey: "fp_live_8829..." });

const document = await client.documents.upload({
  file: fs.createReadStream("./invoice.pdf"),
  autoClassify: true
});

console.log(\`Ingested: \${document.id} | Amount: \${document.amount}\`);`,
    examples: `{
  "document_id": "doc_883192",
  "status": "ingested",
  "extracted_data": {
    "vendor": "Apex Steel",
    "amount": 47500.00,
    "currency": "USD",
    "due_date": "2026-08-30",
    "risk_assessment": {
      "rating": "low",
      "delay_probability": 0.08
    }
  }
}`
  };

  return (
    <section className="py-24 border-b border-[#2b3139] bg-[#181a20]/20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div className="lg:col-span-5 space-y-6 text-left">
          <span className="text-[10px] font-extrabold text-[#fcd535] uppercase tracking-[0.2em]">Developer APIs</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
            Stripe-Quality Integration
          </h2>
          <p className="text-xs md:text-sm text-[#707a8a] leading-relaxed">
            Inject financial documents directly into FORGE-PATH OCR pipelines using simple REST endpoints. Our developer tools make accounts integration trivial.
          </p>
          <div className="flex gap-3 pt-2">
            {["api", "sdk", "examples"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveDocsTab(tab as any)}
                className={`px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider border rounded-md transition-all ${
                  activeDocsTab === tab
                    ? "bg-[#fcd535] border-[#fcd535] text-[#181a20]"
                    : "bg-[#1e2329]/40 border-[#2b3139] text-[#707a8a] hover:text-white"
                }`}
              >
                {tab === "api" ? "cURL API" : tab === "sdk" ? "Node.js SDK" : "JSON Response"}
              </button>
            ))}
          </div>
          <Link
            href="/docs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#fcd535] hover:gap-2.5 transition-all pt-4 border-t border-[#2b3139]/40 w-full"
          >
            Read Developer Documentation <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Interactive Code Console (Right) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0b0e11] border border-[#2b3139] overflow-hidden shadow-2xl relative">
          <div className="absolute top-3 right-4 flex items-center gap-2 text-[9px] text-[#707a8a] font-mono">
            <span className="w-1.5 h-1.5 bg-[#0ecb81] rounded-full animate-pulse" /> endpoint active
          </div>
          
          <div className="flex items-center gap-2 border-b border-[#2b3139] px-4 py-3 bg-[#181a20]">
            <div className="w-2.5 h-2.5 rounded-full bg-[#f6465d]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#fcd535]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#0ecb81]" />
            <span className="text-[10px] text-[#707a8a] font-mono ml-2">forgepath_api_shell.js</span>
          </div>

          <div className="p-5 font-mono text-[11px] text-[#eaecef] overflow-x-auto min-h-[220px]">
            <pre className="text-left leading-relaxed">
              {docsCode[activeDocsTab]}
            </pre>
          </div>
        </div>

      </div>
    </section>
  );
}
