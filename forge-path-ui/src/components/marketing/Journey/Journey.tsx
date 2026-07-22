"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, FileUp, FileScan, Cpu, Bot, TrendingUp, Send
} from "lucide-react";

export default function Journey() {
  const [activeStep, setActiveStep] = useState(0);

  const journeySteps = [
    {
      title: "Document Upload",
      subtitle: "Ingestion Core",
      desc: "Financial documents (PDFs, images, sheets) are securely uploaded via web workspace, email forwarders, or API endpoints.",
    },
    {
      title: "AI-Powered OCR",
      subtitle: "Line-Item Extraction",
      desc: "Advanced neural nets scan, parse, and structure every invoice item, tax rate, and payment term into digital JSON nodes.",
    },
    {
      title: "Gemma 4 Auditing",
      subtitle: "Reasoning Layer",
      desc: "Our financial LLM reasons through historical payment patterns and flags anomalies or risk trends associated with the client.",
    },
    {
      title: "Solvency Intelligence",
      subtitle: "Liquidity Modeling",
      desc: "FORGE-PATH automatically projects cash impact, recalculates runway days, and updates solvency models.",
    },
    {
      title: "Neon DB Transaction",
      subtitle: "Sovereign Ledger",
      desc: "Extracted facts are instantly written to Neon PostgreSQL database replicas using serverless multi-tenant encryption.",
    },
    {
      title: "Live Dashboard Updates",
      subtitle: "Executive View",
      desc: "Receivables, payables, and net-cash flow metrics dynamically increment with zero manual data entry.",
    },
    {
      title: "Morning Executive Brief",
      subtitle: "Solvency Briefing",
      desc: "Updates are summarized into the Daily morning brief. High-risk payment delays are bubbled to the top with suggested actions.",
    },
    {
      title: "AI Copilot Action",
      subtitle: "Automated Workflows",
      desc: "Draft payment reminders, authorize delayed invoice escalations, or request scenarios directly from the AI agent.",
    }
  ];

  return (
    <section className="py-24 border-b border-[#2b3139] bg-[#181a20]/20 relative">
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-[#fcd535]/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
          <span className="text-[10px] font-extrabold text-[#fcd535] uppercase tracking-[0.2em]">Product Lifecycle</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">The Journey of One Invoice</h2>
          <p className="text-xs md:text-sm text-[#707a8a] leading-relaxed">
            Watch as a raw document flows dynamically through the FORGE-PATH operating pipelines, turning into structured ledger actions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Interactive Timeline Controls (Left) */}
          <div className="lg:col-span-5 space-y-3 relative z-10">
            {journeySteps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`w-full p-4 rounded-xl border text-left flex items-start gap-4 transition-all duration-300 ${
                  activeStep === idx
                    ? "bg-[#1e2329] border-[#fcd535] shadow-lg"
                    : "bg-[#181a20]/40 border-[#2b3139]/50 opacity-60 hover:opacity-100 hover:border-[#2b3139]"
                }`}
              >
                <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                  activeStep === idx
                    ? "bg-[#fcd535] text-[#181a20]"
                    : "bg-[#2b3139] text-[#707a8a]"
                }`}>
                  {idx + 1}
                </span>
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">{step.title}</h3>
                  <span className="text-[9px] text-[#707a8a] block">{step.subtitle}</span>
                  {activeStep === idx && (
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[11px] text-[#eaecef] leading-relaxed pt-2"
                    >
                      {step.desc}
                    </motion.p>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Protagonist Invoice Card Preview (Right, Sticky) */}
          <div className="lg:col-span-7 lg:sticky lg:top-28 flex justify-center">
            <div className="w-full max-w-lg min-h-[350px] p-6 rounded-2xl bg-[#1e2329] border border-[#2b3139] relative shadow-2xl flex flex-col justify-between overflow-hidden">
              
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#fcd535]/5 blur-[30px] rounded-full pointer-events-none" />

              <div className="space-y-4">
                
                {/* Dynamic Header based on active step */}
                <div className="flex justify-between items-center border-b border-[#2b3139] pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#fcd535]/10 flex items-center justify-center text-[#fcd535]">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-white block">invoice_US_9021.pdf</span>
                      <span className="text-[8px] text-[#707a8a] block font-mono">MD5: e7b1a2080a...</span>
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    activeStep === 0 ? "bg-[#707a8a]/20 text-[#707a8a]" :
                    activeStep === 1 ? "bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20" :
                    activeStep === 2 ? "bg-[#a855f7]/10 text-[#a855f7] border border-[#a855f7]/20" :
                    "bg-[#0ecb81]/10 text-[#0ecb81] border border-[#0ecb81]/20"
                  }`}>
                    {activeStep === 0 ? "Raw Upload" :
                     activeStep === 1 ? "Extracting" :
                     activeStep === 2 ? "Auditing" :
                     "Ingested"}
                  </span>
                </div>

                {/* Dynamic Card Body */}
                <div className="min-h-[160px] flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    
                    {activeStep === 0 && (
                      <motion.div
                        key="step-0"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="border border-dashed border-[#2b3139] rounded-xl p-8 text-center space-y-3 bg-[#0b0e11]/30"
                      >
                        <FileUp className="w-8 h-8 mx-auto text-[#707a8a]" />
                        <div>
                          <span className="text-xs font-bold text-white block">Drag and drop file here</span>
                          <span className="text-[9px] text-[#707a8a] block mt-0.5">PDF, PNG, JPG, XML up to 50MB</span>
                        </div>
                      </motion.div>
                    )}

                    {activeStep === 1 && (
                      <motion.div
                        key="step-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3 relative overflow-hidden"
                      >
                        <motion.div
                          animate={{ y: [-10, 160, -10] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                          className="absolute left-0 right-0 h-0.5 bg-[#0ecb81]/60 shadow-[0_0_8px_rgba(14,203,129,0.8)] z-10"
                        />
                        <div className="space-y-2 text-[10px] font-mono bg-[#0b0e11] p-3 rounded-lg border border-[#2b3139]">
                          <div className="flex justify-between"><span className="text-[#707a8a]">Vendor:</span> <span className="text-white">Apex Steel Fabrication</span></div>
                          <div className="flex justify-between"><span className="text-[#707a8a]">Amount:</span> <span className="text-[#0ecb81]">$47,500.00</span></div>
                          <div className="flex justify-between"><span className="text-[#707a8a]">Date:</span> <span className="text-white">2026-07-20</span></div>
                          <div className="flex justify-between"><span className="text-[#707a8a]">Due Date:</span> <span className="text-white">2026-08-30</span></div>
                          <div className="flex justify-between"><span className="text-[#707a8a]">Terms:</span> <span className="text-white">Net 40 Days</span></div>
                        </div>
                      </motion.div>
                    )}

                    {activeStep === 2 && (
                      <motion.div
                        key="step-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-4 bg-[#0b0e11] rounded-xl border border-[#2b3139] flex gap-3 items-start"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#a855f7]/10 text-[#a855f7] flex items-center justify-center flex-shrink-0 border border-[#a855f7]/20">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <div className="space-y-2 flex-1">
                          <span className="text-[11px] font-bold text-white block">Gemma LLM Reasoning Task</span>
                          <div className="p-2.5 bg-[#181a20] rounded border border-[#2b3139] space-y-1.5">
                            <div className="flex items-center gap-1.5"><span className="text-[9px] text-[#a855f7] font-bold uppercase">Audit Alert:</span><span className="text-[9px] text-[#f6465d] bg-[#f6465d]/10 px-1 rounded">12d Delay Drift</span></div>
                            <p className="text-[9px] text-[#eaecef] leading-relaxed">
                              "Apex Steel exhibits a rising delay drift. Average fulfillment offset is 12 days past net due date. Probability of default: &lt;1% (Low risk, high friction)."
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeStep === 3 && (
                      <motion.div
                        key="step-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                      >
                        <div className="p-3 bg-[#0b0e11] border border-[#2b3139] rounded-xl space-y-2">
                          <div className="flex justify-between items-center"><span className="text-[10px] text-[#707a8a]">Runway Simulation</span> <span className="text-[10px] text-[#0ecb81] font-bold font-mono">+4 Days</span></div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold font-mono text-white">68 Days</span>
                            <span className="text-xs text-[#eaecef]">→</span>
                            <span className="text-xl font-bold font-mono text-[#0ecb81]">72 Days</span>
                          </div>
                          <div className="w-full bg-[#181a20] h-2 rounded-full overflow-hidden">
                            <motion.div initial={{ width: "68%" }} animate={{ width: "72%" }} className="h-full bg-[#0ecb81] rounded-full" />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeStep === 4 && (
                      <motion.div
                        key="step-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="rounded-xl bg-[#0b0e11] border border-[#2b3139] p-3 font-mono text-[9px] text-[#eaecef] overflow-hidden"
                      >
                        <div className="border-b border-[#2b3139] pb-1.5 mb-1.5 text-[#707a8a] flex justify-between">
                          <span>NEON DATABASE CONSOLE</span>
                          <span className="text-[#0ecb81]">CONNECTED</span>
                        </div>
                        <pre className="text-left leading-relaxed">
                          {`INSERT INTO company_receivables (
  id, vendor, amount, status, due_date
) VALUES (
  'rec_8831', 'Apex Steel', 47500.00, 'UNPAID', '2026-08-30'
);
Query OK, 1 row affected (12ms)`}
                        </pre>
                      </motion.div>
                    )}

                    {activeStep === 5 && (
                      <motion.div
                        key="step-5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-3 bg-[#0b0e11] border border-[#2b3139] rounded-xl flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase tracking-wider text-[#707a8a] block">Outstanding Receivables</span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold font-mono text-white">$237,000</span>
                            <span className="text-xs text-[#eaecef]">→</span>
                            <span className="text-xl font-bold font-mono text-[#fcd535]">$284,500</span>
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-full border border-[#fcd535]/20 flex items-center justify-center bg-[#fcd535]/5 text-[#fcd535]">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                      </motion.div>
                    )}

                    {activeStep === 6 && (
                      <motion.div
                        key="step-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-4 bg-[#0b0e11] rounded-xl border border-[#2b3139] space-y-2 text-left"
                      >
                        <div className="flex justify-between items-center"><span className="text-[10px] text-[#fcd535] font-extrabold uppercase tracking-wider">Morning Executive Brief</span> <span className="text-[8px] text-[#707a8a]">08:00 AM</span></div>
                        <p className="text-[10px] text-[#eaecef] leading-relaxed">
                          "A new invoice from **Apex Steel** ($47.5k) has been ingested. While liquidity has improved by +4 runway days, this vendor exhibits delay drift trends. Recommend assigning automation outreach rules."
                        </p>
                      </motion.div>
                    )}

                    {activeStep === 7 && (
                      <motion.div
                        key="step-7"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                      >
                        <div className="space-y-2">
                          <div className="flex gap-2 items-end justify-end"><div className="bg-[#fcd535]/15 border border-[#fcd535]/35 p-2 rounded-xl text-[9px] text-white">"Draft escalation for Apex Steel"</div></div>
                          <div className="flex gap-2 items-start"><div className="w-5 h-5 rounded bg-[#fcd535]/10 flex items-center justify-center text-[#fcd535] text-[10px]"><Bot className="w-3 h-3" /></div><div className="bg-[#181a20] border border-[#2b3139] p-2 rounded-xl text-[9px] text-[#eaecef] max-w-[80%]">"Escalation email draft created for alex@apexsteel.com. Trigger reminder channel?"</div></div>
                        </div>
                        <button className="w-full py-2 bg-[#fcd535] hover:bg-[#e2be28] text-[#181a20] text-[10px] font-extrabold rounded-lg flex items-center justify-center gap-1.5 transition-colors">
                          <Send className="w-3 h-3" /> Confirm & Send via WhatsApp
                        </button>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>

              </div>

              {/* Bottom Step Indicator Footer */}
              <div className="flex justify-between items-center border-t border-[#2b3139] pt-4 mt-6 text-[10px] text-[#707a8a]">
                <span>Step {activeStep + 1} of 8</span>
                <div className="flex gap-1.5">
                  {journeySteps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveStep(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        activeStep === i ? "bg-[#fcd535] w-4" : "bg-[#2b3139] hover:bg-[#707a8a]"
                      }`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
