"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ChevronRight, CheckCircle2, Loader2, ArrowRight } from "lucide-react";

export default function GuidedDemoTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  const steps = [
    { title: "Initialize Workspace", desc: "Setting up Neon transactional ledger and indexing documents..." },
    { title: "Invoice Ingestion (OCR)", desc: "Parser scanning INV-2026-089. Extracting due dates and values..." },
    { title: "AI Risk Analysis", desc: "Gemma 4 assessing payment delays and historical trends..." },
    { title: "Cash Forecast Calculation", desc: "Updating 90-day cash projection matrix in ClickHouse..." },
    { title: "Copilot Risk Briefing", desc: "AI CFO Copilot generating payment extensions recommendations..." },
  ];

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setTourStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev; // stays on final step
        }
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isOpen]);

  const startTour = () => {
    setTourStep(0);
    setIsOpen(true);
  };

  const closeTour = () => {
    setIsOpen(false);
  };

  return (
    <section className="relative min-h-screen bg-[#08080a] flex flex-col justify-center items-center overflow-hidden px-6 py-20 select-none border-t border-[#1a1a1a]">
      {/* Title */}
      <div className="relative z-10 text-center max-w-2xl mx-auto space-y-6 mb-12">
        <h2 className="text-[#faff69] uppercase text-xs tracking-widest font-bold">
          Chapter 12: Live Demo Tour
        </h2>
        <h3 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight">
          Experience the Platform in 30 Seconds
        </h3>
        <p className="text-[#888888] text-sm md:text-base font-medium max-w-lg mx-auto">
          Start the guided tour to see how the system operates autonomously from document upload to executive brief.
        </p>
        <button
          onClick={startTour}
          className="mx-auto px-6 py-3.5 rounded-xl bg-[#faff69] hover:bg-[#f0f560] text-black font-extrabold text-sm transition-all cursor-pointer shadow-lg shadow-[#faff69]/10 flex items-center gap-2"
        >
          <Play className="w-4 h-4 fill-black" /> Start Guided Tour
        </button>
      </div>

      {/* Guided Tour Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0f0f11] border border-[#2a2a2a] rounded-3xl p-8 shadow-2xl flex flex-col justify-between min-h-[380px] text-left"
            >
              {/* Close Button */}
              <button onClick={closeTour} className="absolute right-6 top-6 text-[#666] hover:text-white transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>

              {/* Progress Indicator */}
              <div className="flex gap-1.5 w-full mb-8">
                {steps.map((_, idx) => (
                  <div key={idx} className="flex-1 h-[3px] bg-[#222] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{
                        width: idx === tourStep ? "100%" : idx < tourStep ? "100%" : "0%",
                      }}
                      transition={{
                        duration: idx === tourStep ? 4.5 : 0.3,
                        ease: "linear",
                      }}
                      className="h-full bg-[#faff69]"
                    />
                  </div>
                ))}
              </div>

              {/* Step Info */}
              <div className="flex-1 flex flex-col justify-center space-y-4">
                <span className="text-[10px] font-bold text-[#faff69] uppercase tracking-widest">
                  Step {tourStep + 1} of {steps.length}
                </span>

                <h4 className="text-white text-2xl font-extrabold tracking-tight">
                  {steps[tourStep].title}
                </h4>

                <p className="text-sm text-[#888] leading-relaxed max-w-lg">
                  {steps[tourStep].desc}
                </p>

                {/* Animated status widget */}
                <div className="pt-4 flex items-center gap-3">
                  {tourStep < steps.length - 1 ? (
                    <>
                      <Loader2 className="w-4 h-4 text-[#faff69] animate-spin" />
                      <span className="text-[10px] text-[#666] font-bold uppercase tracking-wider">Simulating system processes...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Platform Demo Finished</span>
                    </>
                  )}
                </div>
              </div>

              {/* Action buttons footer */}
              <div className="flex justify-between items-center border-t border-[#222] pt-6 mt-8">
                <button
                  onClick={closeTour}
                  className="px-5 py-2.5 rounded-xl border border-[#2a2a2a] text-white font-bold text-xs hover:border-[#faff69]/40 hover:bg-[#151518] transition-all cursor-pointer"
                >
                  Skip Tour
                </button>

                {tourStep < steps.length - 1 ? (
                  <button
                    onClick={() => setTourStep((prev) => prev + 1)}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    Next Step <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <a
                    href="/signup"
                    className="px-5 py-2.5 rounded-xl bg-[#faff69] hover:bg-[#f0f560] text-black font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-[#faff69]/10"
                  >
                    Get Started Free <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
