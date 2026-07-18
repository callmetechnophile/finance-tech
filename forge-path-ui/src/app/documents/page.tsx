export default function DocumentsPage() {
  return (
    <div className="p-12 space-y-6">
      <h2 className="text-xl font-bold text-white uppercase tracking-wider">Document Ingestion Pipeline</h2>
      <p className="text-xs text-[#cccccc] leading-relaxed max-w-xl">
        Structured OCR document hub. Transcribe purchase orders, supplier bills, and bank statements directly into NeonDB transaction tables.
      </p>
    </div>
  );
}
