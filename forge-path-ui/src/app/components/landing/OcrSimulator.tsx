"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, Check, Cpu, Loader2 } from "lucide-react";

export default function OcrSimulator() {
  const [step, setStep] = useState<"idle" | "scanning" | "reasoning" | "done">("idle");
  const [reasoningText, setReasoningText] = useState("");
  const [revealedFields, setRevealedFields] = useState<string[]>([]);

  const mockThoughts = [
    "[Gemma 4: Init] Load invoice schema...\n",
    "[OCR] Extracted Text Block: 'APEX MANUFACTURING INC - INV-2026-089'\n",
    "[Parser] Identified Vendor: Apex Steel & Wire Corp\n",
    "[Parser] Identified Amount: $47,500.00 USD\n",
    "[Parser] Identified Due Date: August 15, 2026\n",
    "[Gemma 4: Risk Engine] Analyzing Apex Steel payment history...\n",
    "[Gemma 4: Risk Engine] DELAY DETECTED: Average delay trend is +18 days.\n",
    "[Gemma 4: Impact Analyzer] Run liquidity stress scenario: Drop below 60-day buffer likely.\n",
    "[Gemma 4: Action] Flagging high risk. Generating executive summary...\n",
  ];

  const handleStartSimulation = () => {
    if (step !== "idle") return;
    setStep("scanning");
    setRevealedFields([]);
    setReasoningText("");

    // Step 1: Laser scanning (3s)
    setTimeout(() => {
      setStep("reasoning");
    }, 3000);
  };

  // Step 2: Stream reasoning thoughts
  useEffect(() => {
    if (step !== "reasoning") return;

    let thoughtIdx = 0;
    let charIdx = 0;
    let currentText = "";

    const interval = setInterval(() => {
      if (thoughtIdx >= mockThoughts.length) {
        clearInterval(interval);
        setStep("done");
        return;
      }

      const line = mockThoughts[thoughtIdx];
      if (charIdx < line.length) {
        currentText += line[charIdx];
        setReasoningText(currentText);
        charIdx++;

        // Trigger field reveals during parsing
        if (line.includes("Vendor:") && !revealedFields.includes("Vendor")) {
          setRevealedFields((prev) => [...prev, "Vendor"]);
        } else if (line.includes("Amount:") && !revealedFields.includes("Amount")) {
          setRevealedFields((prev) => [...prev, "Amount"]);
        } else if (line.includes("Due Date:") && !revealedFields.includes("DueDate")) {
          setRevealedFields((prev) => [...prev, "DueDate"]);
        }
      } else {
        thoughtIdx++;
        charIdx = 0;
      }
    }, 25);

    return () => clearInterval(interval);
  }, [step]);

  return (
    <section className="relative min-h-screen bg-[#08080a] flex flex-col justify-center items-center overflow-hidden px-6 py-20 select-none border-t border-[#1a1a1a]">
      {/* Title */}
      <div className="relative z-10 text-center max-w-2xl mx-auto space-y-4 mb-16">
        <h2 className="text-[#faff69] uppercase text-xs tracking-widest font-bold">
          Chapters 3 & 4: Cognitive Parsing
        </h2>
        <h3 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight">
          Document OCR & AI Reasoning
        </h3>
        <p className="text-[#888888] text-sm md:text-base font-medium max-w-lg mx-auto">
          Upload an invoice to witness real-time OCR extraction and Gemma 4’s autonomous cognitive workflow analysis.
        </p>
      </div>

      <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch justify-center z-10">
        {/* Left Side: Invoice upload simulator */}
        <div className="rounded-3xl bg-[#0f0f11] border border-[#2a2a2a] p-6 flex flex-col justify-between min-h-[420px] relative overflow-hidden">
          {step === "idle" && (
            <div
              onClick={handleStartSimulation}
              className="flex-1 border-2 border-dashed border-[#3a3a3c] rounded-2xl flex flex-col items-center justify-center p-8 hover:border-[#faff69]/40 cursor-pointer hover:bg-white/[0.01] transition-all"
            >
              <UploadCloud className="w-12 h-12 text-[#666] mb-4 animate-bounce" style={{ animationDuration: "3s" }} />
              <h4 className="text-white text-sm font-bold">Drop invoice here to analyze</h4>
              <p className="text-[11px] text-[#666] mt-2">Supports PDF, PNG, JPG up to 10MB</p>
              <button className="mt-6 px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#faff69] transition-colors shadow-lg">
                Select Mock Invoice
              </button>
            </div>
          )}

          {step !== "idle" && (
            <div className="flex-1 flex flex-col gap-6 relative">
              {/* Document Mockup */}
              <div className="relative border border-[#2a2a2a] rounded-2xl bg-black/40 p-5 flex flex-col justify-between overflow-hidden flex-1">
                {/* Laser line overlay during scanning */}
                {step === "scanning" && (
                  <motion.div
                    animate={{
                      top: ["0%", "100%", "0%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#faff69] to-transparent shadow-[0_0_10px_#faff69] z-20 pointer-events-none"
                  />
                )}

                <div className="flex justify-between items-start border-b border-[#2a2a2a] pb-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-[#faff69]" />
                    <div className="text-left">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Invoice</h4>
                      <p className="text-[9px] text-[#666] mt-0.5">INV-2026-089</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-white/50 font-tabular font-semibold">DATE: 07/22/2026</span>
                </div>

                <div className="py-4 space-y-3">
                  {/* Field Highlights */}
                  <div className={`p-2.5 rounded-lg border transition-all ${revealedFields.includes("Vendor") ? "border-[#faff69]/40 bg-[#faff69]/5" : "border-transparent"}`}>
                    <span className="block text-[9px] text-[#666] uppercase font-bold tracking-wider">Vendor</span>
                    <span className="text-xs text-white font-medium">Apex Steel & Wire Corp</span>
                  </div>

                  <div className={`p-2.5 rounded-lg border transition-all ${revealedFields.includes("Amount") ? "border-[#faff69]/40 bg-[#faff69]/5" : "border-transparent"}`}>
                    <span className="block text-[9px] text-[#666] uppercase font-bold tracking-wider">Total Amount</span>
                    <span className="text-xs text-white font-tabular font-medium">$47,500.00 USD</span>
                  </div>

                  <div className={`p-2.5 rounded-lg border transition-all ${revealedFields.includes("DueDate") ? "border-[#faff69]/40 bg-[#faff69]/5" : "border-transparent"}`}>
                    <span className="block text-[9px] text-[#666] uppercase font-bold tracking-wider">Due Date</span>
                    <span className="text-xs text-white font-medium">August 15, 2026</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Gemma Reasoning & Thought Stream */}
        <div className="rounded-3xl bg-[#0f0f11] border border-[#2a2a2a] p-6 flex flex-col justify-between min-h-[420px] relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4 mb-4">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-[#faff69]" />
              <h4 className="text-xs font-bold text-white uppercase tracking-widest">Gemma 4 Cognitive Engine</h4>
            </div>
            {step === "scanning" && (
              <span className="flex items-center gap-1.5 text-[9px] text-[#faff69] font-bold uppercase tracking-wider">
                <Loader2 className="w-3 h-3 animate-spin" /> Scanning Document...
              </span>
            )}
            {step === "reasoning" && (
              <span className="flex items-center gap-1.5 text-[9px] text-[#faff69] font-bold uppercase tracking-wider animate-pulse">
                Thinking...
              </span>
            )}
            {step === "done" && (
              <span className="flex items-center gap-1 text-[9px] text-emerald-400 font-bold uppercase tracking-wider">
                <Check className="w-3 h-3" /> Analysis Complete
              </span>
            )}
          </div>

          {/* Thought log terminal */}
          <div className="flex-1 bg-black/40 border border-[#222] rounded-2xl p-4 font-mono text-[10px] text-emerald-400/90 overflow-y-auto max-h-[260px] text-left leading-relaxed whitespace-pre-wrap select-text">
            {step === "idle" && (
              <span className="text-[#555] font-semibold italic">Waiting for document ingest...</span>
            )}
            {step !== "idle" && reasoningText}
          </div>

          {/* Action Footer */}
          {step === "done" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/5 text-left"
            >
              <h5 className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Executive Recommendation</h5>
              <p className="text-xs text-white/80 mt-1 leading-relaxed">
                Flagged: Apex Steel average delay is **+18 days**. Recommended action: **Auto-schedule Net-30 reminder** & trigger stress scenario projection.
              </p>
            </motion.div>
          )}

          {step === "done" && (
            <button
              onClick={() => setStep("idle")}
              className="mt-4 w-full py-3 rounded-xl border border-[#2a2a2a] text-white font-bold text-xs hover:border-[#faff69]/40 hover:bg-[#151518] transition-all cursor-pointer"
            >
              Reset Simulation
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
