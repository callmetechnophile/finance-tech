"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Square, Loader2, Bot, Layers, CheckCircle2, ChevronRight } from "lucide-react";

export default function GuidedDemoTour() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const tourSteps = [
    {
      title: "1. Setup & Integration",
      desc: "Connect Neon DB ledger and configure the automated collections workflow queue.",
      icon: Layers,
      duration: 5,
    },
    {
      title: "2. Document Ingest & OCR",
      desc: "Drag invoice. Gemma models run cognitive OCR extraction and verify ledger totals.",
      icon: Loader2,
      duration: 6,
    },
    {
      title: "3. Cash Flow Forecast",
      desc: "Compute liquid cash buffer metrics and project 90-day runway curves automatically.",
      icon: Bot,
      duration: 6,
    },
    {
      title: "4. Autonomous Risk Brief",
      desc: "Review daily critical alerts and trigger smart extensions or reminder campaigns.",
      icon: CheckCircle2,
      duration: 5,
    },
  ];

  const handleStartTour = () => {
    setIsRunning(true);
    setCurrentStep(0);
    setProgress(0);
  };

  const handleStopTour = () => {
    setIsRunning(false);
    setProgress(0);
  };

  // Run progress bar of current step
  useEffect(() => {
    if (!isRunning) return;

    const stepDuration = tourSteps[currentStep].duration * 1000;
    const intervalTime = 50;
    const increment = (intervalTime / stepDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          if (currentStep < tourSteps.length - 1) {
            setCurrentStep((s) => s + 1);
            return 0;
          } else {
            setIsRunning(false);
            return 0;
          }
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isRunning, currentStep]);

  return (
    <section id="guided-demo-section" className="relative min-h-screen bg-[#0b0e11] flex flex-col justify-center items-center overflow-hidden px-6 py-20 select-none border-t border-[#2b3139]">
      {/* Title */}
      <div className="relative z-10 text-center max-w-2xl mx-auto space-y-4 mb-16">
        <h2 className="text-[#fcd535] uppercase text-xs tracking-widest font-bold">
          Chapter 12: Interactive Journey
        </h2>
        <h3 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight">
          Guided Platform Tour
        </h3>
        <p className="text-[#eaecef] text-sm md:text-base max-w-lg mx-auto">
          Start the 30-second automated demo tour to witness full financial pipelines running in real-time.
        </p>
      </div>

      <div className="relative w-full max-w-3xl rounded-3xl bg-[#1e2329] border border-[#2b3139] p-8 shadow-2xl z-10 text-left space-y-8 min-h-[380px] flex flex-col justify-between">
        {!isRunning ? (
          // Landing Screen
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            <h4 className="text-white text-lg font-bold">Ready to see FORGE-PATH in action?</h4>
            <p className="text-xs text-[#eaecef]/70 leading-relaxed max-w-xl">
              The guided tour automatically walks through database setup, invoice OCR ingestion, cash flow forecasting, and AI Copilot reasoning.
            </p>
            <button
              onClick={handleStartTour}
              className="h-10 px-6 rounded-md bg-[#fcd535] hover:bg-[#f0b90b] text-[#181a20] font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer w-fit shadow-lg shadow-[#fcd535]/5"
            >
              <Play className="w-4 h-4 fill-[#181a20]" /> Start Guided Tour
            </button>
          </div>
        ) : (
          // Active Tour Modal overlay style
          <div className="flex-1 flex flex-col justify-between gap-6">
            {/* Step indicators */}
            <div className="flex justify-between items-center gap-2">
              {tourSteps.map((step, idx) => (
                <div key={idx} className="flex-1 space-y-2">
                  <div className="h-1 rounded-full bg-black/40 overflow-hidden">
                    <div
                      className="h-full bg-[#fcd535] transition-all"
                      style={{
                        width: idx < currentStep ? "100%" : idx === currentStep ? `${progress}%` : "0%",
                      }}
                    />
                  </div>
                  <span className={`hidden md:block text-[9px] font-bold uppercase tracking-wider ${
                    idx === currentStep ? "text-[#fcd535]" : "text-[#707a8a]"
                  }`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Current Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col md:flex-row gap-6 items-start flex-1 py-4"
              >
                {/* Step Icon */}
                <div className="w-12 h-12 rounded-xl bg-[#fcd535]/10 border border-[#fcd535]/20 flex items-center justify-center text-[#fcd535]">
                  {(() => {
                    const CurrentIcon = tourSteps[currentStep].icon;
                    return <CurrentIcon className={`w-6 h-6 ${CurrentIcon === Loader2 ? 'animate-spin' : ''}`} />;
                  })()}
                </div>

                <div className="space-y-2 text-left flex-1">
                  <h4 className="text-white text-base font-bold">{tourSteps[currentStep].title}</h4>
                  <p className="text-xs text-[#eaecef] leading-relaxed max-w-xl">{tourSteps[currentStep].desc}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controls footer */}
            <div className="flex justify-between items-center pt-4 border-t border-[#2b3139]">
              <button
                onClick={handleStopTour}
                className="h-10 px-5 rounded-md border border-[#3a3a3a] text-white hover:bg-[#242424] font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Square className="w-3.5 h-3.5 fill-white" /> Stop Tour
              </button>

              <button
                onClick={() => {
                  setProgress(0);
                  if (currentStep < tourSteps.length - 1) {
                    setCurrentStep((s) => s + 1);
                  } else {
                    setIsRunning(false);
                  }
                }}
                className="h-10 px-5 rounded-md bg-white hover:bg-[#fcd535] text-black font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                Next Step <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
