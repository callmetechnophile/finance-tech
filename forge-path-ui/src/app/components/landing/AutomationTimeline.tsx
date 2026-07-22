"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Upload, Cpu, BarChart2, Bell, AlertCircle, FileText, CheckCircle2 } from "lucide-react";

export default function AutomationTimeline() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { label: "Invoice Ingested", icon: Upload, desc: "Auto-ingest via email/portal" },
    { label: "OCR Parsing", icon: FileText, desc: "Verify fields & totals" },
    { label: "AI Risk Analysis", icon: Cpu, desc: "Compute payment risk score" },
    { label: "Forecast Updated", icon: BarChart2, desc: "Recalculate 90-day cash projection" },
    { label: "Reminder Scheduled", icon: Bell, desc: "Prepare notification queue" },
    { label: "Treasury Alert", icon: AlertCircle, desc: "Flag critical runway limits" },
    { label: "Brief Generated", icon: CheckCircle2, desc: "Create morning executive summary" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <section className="relative min-h-screen bg-[#0b0e11] flex flex-col justify-center items-center overflow-hidden px-6 py-20 select-none border-t border-[#2b3139]">
      {/* Title */}
      <div className="relative z-10 text-center max-w-2xl mx-auto space-y-4 mb-20">
        <h2 className="text-[#fcd535] uppercase text-xs tracking-widest font-bold">
          Chapter 8: End-to-End Automation
        </h2>
        <h3 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight">
          Automated Financial Workflows
        </h3>
        <p className="text-[#eaecef] text-sm md:text-base max-w-lg mx-auto">
          From the moment an invoice hits your inbox to the final executive dashboard updates—all synchronized.
        </p>
      </div>

      {/* Stepper Container */}
      <div className="relative w-full max-w-4xl flex flex-col gap-6 z-10">
        {/* Timeline Path Line */}
        <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-[2px] bg-[#2b3139] md:-translate-x-1/2 pointer-events-none" />

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === activeStep;

          return (
            <motion.div
              key={idx}
              animate={{
                opacity: isActive ? 1 : 0.4,
              }}
              className="relative flex items-center md:justify-between gap-6 md:gap-0 w-full"
            >
              {/* Left Spacer (Desktop only) */}
              <div className="w-[45%] hidden md:block text-right pr-8">
                {idx % 2 === 0 && (
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white tracking-wide">{step.label}</h4>
                    <p className="text-[10px] text-[#707a8a] leading-tight font-semibold uppercase">{step.desc}</p>
                  </div>
                )}
              </div>

              {/* Node Circle */}
              <div className="relative z-15 flex items-center justify-center w-20">
                <motion.div
                  animate={{
                    borderColor: isActive ? "#fcd535" : "#2b3139",
                    boxShadow: isActive ? "0 0 20px rgba(252,213,53,0.15)" : "none",
                  }}
                  className={`w-14 h-14 rounded-full border-2 bg-[#1e2329] flex items-center justify-center transition-all ${
                    isActive ? "text-[#fcd535]" : "text-[#444]"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </motion.div>
              </div>

              {/* Right Spacer (Desktop) / Info Block (Mobile) */}
              <div className="w-[45%] text-left pl-8 flex-1 md:flex-initial">
                {idx % 2 !== 0 ? (
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white tracking-wide">{step.label}</h4>
                    <p className="text-[10px] text-[#707a8a] leading-tight font-semibold uppercase">{step.desc}</p>
                  </div>
                ) : (
                  // Shown on mobile layout
                  <div className="md:hidden space-y-1">
                    <h4 className="text-sm font-bold text-white tracking-wide">{step.label}</h4>
                    <p className="text-[10px] text-[#707a8a] leading-tight font-semibold uppercase">{step.desc}</p>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
