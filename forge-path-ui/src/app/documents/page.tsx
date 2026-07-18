"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { UploadCloud, FileText, CheckCircle, Clock, AlertCircle, Eye, Search, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface DocumentUpload {
  name: string;
  size: string;
  type: string;
  status: "Processing" | "Completed" | "Failed";
  progress: number;
}

export default function DocumentsPage() {
  const [uploads, setUploads] = useState<DocumentUpload[]>([
    { name: "Apex_Steel_Invoice_89.pdf", size: "1.4 MB", type: "PDF", status: "Completed", progress: 100 },
    { name: "CNC_Maintenance_Bill_July.xlsx", size: "320 KB", type: "EXCEL", status: "Completed", progress: 100 },
    { name: "Laser_Cutting_Job_Work_Ledger.png", size: "2.1 MB", type: "IMAGE", status: "Processing", progress: 65 },
  ]);

  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const newUpload: DocumentUpload = {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.name.split(".").pop()?.toUpperCase() ?? "UNKNOWN",
        status: "Processing",
        progress: 0,
      };
      
      setUploads((prev) => [newUpload, ...prev]);
      toast.success("Document uploaded, beginning parser extraction.");
      
      // Simulate progress
      let interval = setInterval(() => {
        setUploads((prev) =>
          prev.map((item) =>
            item.name === file.name
              ? { ...item, progress: Math.min(item.progress + 25, 100), status: item.progress + 25 >= 100 ? "Completed" : "Processing" }
              : item
          )
        );
      }, 500);
      
      setTimeout(() => clearInterval(interval), 3000);
    }
  };

  return (
    <AppShell>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div>
          <h2 className="text-xl font-bold text-white">Financial Document Center</h2>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Standardize raw CSV invoices, scanned ledger images, bank PDF statements, and receipts into structured NeonDB transaction tables.
          </p>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${
            dragActive ? "border-blue-500 bg-blue-500/5 shadow-glow-blue" : "border-[#1E253E] bg-[#111827]/30"
          }`}
        >
          <UploadCloud className="w-10 h-10 text-blue-400 mb-3" />
          <h3 className="text-sm font-semibold text-white">Drag & drop files here</h3>
          <p className="text-xs text-[#6B7280] mt-1">Supports PDF, CSV, XLSX, PNG, JPG (Max 15MB)</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-xl shadow-lg shadow-blue-600/10 transition-colors">
            Browse Files
          </button>
        </div>

        {/* Search / Filters */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563]" />
            <input
              type="text"
              placeholder="Search processed documents..."
              className="w-full pl-9 pr-4 py-2 bg-[#111827] border border-[#1E253E] rounded-xl text-xs text-white focus:outline-none"
            />
          </div>
          <button className="px-3 py-2 bg-[#111827] border border-[#1E253E] rounded-xl text-xs text-white flex items-center gap-1.5 hover:bg-[#1a2235]">
            <Filter className="w-3.5 h-3.5 text-[#6B7280]" /> Filter
          </button>
        </div>

        {/* Uploads / Processing list */}
        <div className="bg-[#111827] border border-[#1E253E] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1E253E] flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">Processing Pipeline</h3>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-400 font-semibold">
              Parser Active
            </span>
          </div>

          <div className="divide-y divide-[#1f2d44]/50">
            {uploads.map((item, idx) => (
              <div key={idx} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0d1625] border border-[#1E253E] flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white truncate max-w-xs">{item.name}</h4>
                    <p className="text-[10px] text-[#6B7280] mt-0.5">{item.size} • {item.type}</p>
                  </div>
                </div>

                <div className="flex-1 max-w-xs px-4">
                  {item.status === "Processing" ? (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] text-[#6B7280]">
                        <span>Extracting data...</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="w-full h-1 bg-[#0d1625] rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${item.progress}%` }} />
                      </div>
                    </div>
                  ) : item.status === "Completed" ? (
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Extracted & Validated
                    </span>
                  ) : (
                    <span className="text-[10px] text-red-400 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> OCR Parsing Failed
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button className="p-2 hover:bg-[#1a2235] text-[#6B7280] hover:text-white rounded-lg transition-colors" title="View extraction JSON">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
