"use client";

import React, { useState } from "react";
import { FileText, Download, Calendar, Mail, Filter, Clock } from "lucide-react";
import { PageContainer } from "@/shared/components/layout/PageContainer";
import { WorkspaceHeader } from "@/shared/components/layout/WorkspaceHeader";
import { Section } from "@/shared/components/layout/Section";
import { Panel } from "@/shared/components/layout/Panel";
import { useDocumentStatusStore } from "@/shared/stores/document-status.store";

export default function ReportsPage() {
  const [reportFormat, setReportFormat] = useState<"pdf" | "csv" | "excel">("pdf");
  const [isGenerating, setIsGenerating] = useState(false);
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;

  const HeaderActions = (
    <div className="flex items-center gap-2">
      <button
        onClick={() => {
          setIsGenerating(true);
          setTimeout(() => {
            setIsGenerating(false);
            alert("Report generation initiated.");
          }, 1000);
        }}
        className="px-3 py-1.5 rounded-lg bg-[#faff69] hover:bg-[#e6eb52] text-black text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        disabled={isGenerating || !hasData}
      >
        <Download className="w-3.5 h-3.5 fill-black" />
        <span>{isGenerating ? "Generating..." : "Generate New Report"}</span>
      </button>
    </div>
  );

  const HeaderBadge = (
    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#faff69]/10 text-[#faff69] border border-[#faff69]/20 uppercase tracking-wider">
      Automated Reporting Engine
    </span>
  );

  const reportTemplates = [
    { id: "t1", title: "CFO Executive Solvency Brief", desc: "Comprehensive 30-day runway projection, liquidity risk rating, and AR exposure analysis.", category: "Executive" },
    { id: "t2", title: "AR Aging & Delinquency Audit", desc: "Detailed breakdown of delinquent customer accounts across 30d, 60d, 90d+ aging buckets.", category: "Collections" },
    { id: "t3", title: "Treasury Sweep & Yield Audit", desc: "Multi-bank account telemetry, yield reserve earnings, and scheduled wire payouts.", category: "Treasury" },
    { id: "t4", title: "Document IDP Ingestion Log", desc: "Audit log of all scanned invoices, OCR confidence thresholds, and quarantined documents.", category: "Compliance" },
  ];

  return (
    <div className="h-full flex flex-col min-h-0 bg-[#0a0a0a]" aria-label="Executive Financial Report Center">
      <WorkspaceHeader
        title="Executive Report Center"
        subtitle="Generate, export, and schedule corporate financial briefs, solvency projections, and audit logs."
        icon={<FileText className="w-5 h-5 text-[#faff69]" aria-hidden="true" />}
        badge={HeaderBadge}
        actions={HeaderActions}
        bordered={true}
        className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#2a2a2a]"
      />

      <PageContainer scrollable={true} padded={true} className="flex-1 space-y-6 pb-16">
        <Section title="Standard Corporate Report Templates" compact>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTemplates.map((t) => (
              <Panel key={t.id} className="bg-[#111] border-[#222] space-y-3 justify-between" padded>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="px-1.5 py-0.5 text-[8px] font-bold rounded bg-[#faff69]/10 text-[#faff69] border border-[#faff69]/20 uppercase">
                      {t.category}
                    </span>
                    <FileText className="w-4 h-4 text-white/30" />
                  </div>
                  <h3 className="text-xs font-bold text-white leading-snug">{t.title}</h3>
                  <p className="text-[10px] text-white/40 leading-relaxed">{t.desc}</p>
                </div>

                <button
                  onClick={() => alert(`Generating "${t.title}" report.`)}
                  disabled={!hasData}
                  className="w-full py-1.5 rounded bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] text-[10px] font-bold text-white/80 hover:text-white uppercase transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-3 h-3 text-[#faff69]" />
                  <span>Generate Report</span>
                </button>
              </Panel>
            ))}
          </div>
        </Section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <Panel className="bg-[#111] border-[#222] space-y-4" padded>
              <div className="flex justify-between items-center border-b border-[#222] pb-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-[#faff69]" /> Custom Report Builder
                </h3>
                <span className="text-[9px] text-white/40 font-mono">PDF / CSV / XLSX</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">Target Horizon</label>
                  <select className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#faff69]">
                    <option value="30d">30-Day Rolling Forecast</option>
                    <option value="90d">90-Day Quarterly Horizon</option>
                    <option value="365d">Full Year Financial Audit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">Output Format</label>
                  <div className="flex gap-2">
                    {(["pdf", "csv", "excel"] as const).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setReportFormat(fmt)}
                        className={[
                          "flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all border cursor-pointer",
                          reportFormat === fmt
                            ? "bg-[#faff69] text-black border-[#faff69]"
                            : "bg-[#1a1a1a] text-white/60 border-[#2a2a2a] hover:text-white"
                        ].join(" ")}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Panel>
          </div>

          <div className="lg:col-span-5">
            <Panel className="bg-[#111] border-[#222] space-y-4" padded>
              <div className="flex justify-between items-center border-b border-[#222] pb-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-white/40" /> Archive of Generated Reports
                </h3>
                <span className="text-[9px] text-white/40 font-mono">{hasData ? "Active Archive" : "0 Reports"}</span>
              </div>

              {hasData ? (
                <div className="py-4 text-xs text-white/60 text-center">
                  Archive loaded.
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-white/40">
                  No reports generated.
                </div>
              )}
            </Panel>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
