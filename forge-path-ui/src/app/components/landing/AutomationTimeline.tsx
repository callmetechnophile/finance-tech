"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Upload, Cpu, BarChart2, Bell, AlertCircle, FileText, CheckCircle2 } from "lucide-react";

export default function AutomationTimeline() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { label: "Invoice Uploaded", icon: Upload, desc: "Auto-ingest via email/portal" },
    { label: "OCR Extraction", icon: FileText, desc: "Verify fields & totals" },
    { label: "AI Analysis", icon: Cpu, desc: "Compute payment risk score" },
    { label: "Forecast Updated", icon: BarChart2, desc: "Recalculate 90-day cash projection" },
    { label: "Reminder Scheduled", icon: Bell, desc: "Prepare SMS/Email notification queue" },
    { label: "Treasury Alert", icon: AlertCircle, desc: "Flag critical cash runway limits" },
    { label: "Brief Generated", icon: CheckCircle2, desc: "Generate morning overview executive summary" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <section className="relative min-h-screen bg-[#08080a] flex flex-col justify-center items-center overflow-hidden px-6 py-20 select-none border-t border-[#1a1a1a]">
      {/* Title */}
      <div className="relative z-10 text-center max-w-2xl mx-auto space-y-4 mb-20">
        <h2 className="text-[#faff69] uppercase text-xs tracking-widest font-bold">
          Chapter 8: End-to-End Automation
        </h2>
        <h3 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight">
          Automated Financial Workflows
        </h3>
        <p className="text-[#888888] text-sm md:text-base font-medium max-w-lg mx-auto">
          From the moment an invoice hits your inbox to the final executive dashboard updates—all synchronized.
        </p>
      </div>

      {/* Horizontal / Vertical Stepper */}
      <div className="relative w-full max-w-4xl flex flex-col gap-6 z-10">
        {/* Timeline Path Line */}
        <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-[2px] bg-[#2a2a2a] md:-translate-x-1/2 pointer-events-none" />

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === activeStep;
          const isDone = idx < activeStep;

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
                    <p className="text-[10px] text-[#666] leading-tight font-semibold uppercase">{step.desc}</p>
                  </div>
                )}
              </div>

              {/* Node Circle */}
              <div className="relative z-15 flex items-center justify-center w-20">
                <motion.div
                  animate={{
                    borderColor: isActive ? "#faff69" : "#2a2a2a",
                    boxShadow: isActive ? "0 0 20px rgba(250,255,105,0.15)" : "none",
                  }}
                  className={`w-14 h-14 rounded-full border-2 bg-[#0f0f11] flex items-center justify-center transition-all ${
                    isActive ? "text-[#faff69]" : "text-[#444]"
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
                    <p className="text-[10px] text-[#666] leading-tight font-semibold uppercase">{step.desc}</p>
                  </div>
                ) : (
                  // Shown on mobile layout
                  <div className="md:hidden space-y-1">
                    <h4 className="text-sm font-bold text-white tracking-wide">{step.label}</h4>
                    <p className="text-[10px] text-[#666] leading-tight font-semibold uppercase">{step.desc}</p>
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
