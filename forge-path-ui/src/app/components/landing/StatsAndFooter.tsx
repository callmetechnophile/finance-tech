"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Calendar } from "lucide-react";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function StatsAndFooter() {
  const stats = [
    { value: "95%", label: "Forecast Accuracy" },
    { value: "70%", label: "Manual Work Eliminated" },
    { value: "40%", label: "Collection Improvement" },
    { value: "3×", label: "Faster Financial Decisions" },
  ];

  return (
    <section className="relative min-h-screen bg-[#08080a] flex flex-col justify-between items-center overflow-hidden px-6 pt-20 pb-8 select-none border-t border-[#1a1a1a]">
      {/* Chapter 13: Social Proof Stats */}
      <div className="w-full max-w-5xl grid grid-cols-2 lg:grid-cols-4 gap-8 py-12 z-10">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="text-center space-y-1.5"
          >
            <h4 className="text-4xl md:text-5xl font-extrabold text-[#faff69] font-tabular tracking-tight">
              {stat.value}
            </h4>
            <p className="text-[10px] text-[#666] leading-tight font-bold uppercase tracking-wider">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Final CTA Container */}
      <div className="w-full max-w-4xl text-center space-y-8 my-auto z-10 py-16">
        <h3 className="text-white text-4xl md:text-6xl font-extrabold tracking-tight leading-none">
          The Future of Enterprise Finance <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#666666]">
            Starts Today.
          </span>
        </h3>

        {/* Buttons Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#faff69] hover:bg-[#f0f560] text-black font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#faff69]/10"
          >
            Launch Workspace <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#"
            className="w-full sm:w-auto px-6 py-4 rounded-xl border border-[#2a2a2a] bg-[#0f0f11] hover:border-[#faff69]/40 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4 text-[#666]" /> Book Live Demo
          </a>

          <a
            href="#"
            className="w-full sm:w-auto px-6 py-4 rounded-xl border border-[#2a2a2a] bg-[#0f0f11] hover:border-[#faff69]/40 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-[#666]" /> Documentation
          </a>

          <a
            href="https://github.com/callmetechnophile/finance-tech"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-4 rounded-xl border border-[#2a2a2a] bg-[#0f0f11] hover:border-[#faff69]/40 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <GithubIcon className="text-[#666]" /> GitHub
          </a>
        </div>
      </div>

      {/* Footer copyright and stack credits */}
      <div className="w-full max-w-5xl border-t border-[#1a1a1a] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 z-10 text-[10px] text-[#555] font-semibold uppercase tracking-wider">
        <span>© 2026 FORGE-PATH INC. ALL RIGHTS RESERVED.</span>
        <div className="flex items-center gap-4 text-[9px] text-[#444]">
          <span>Gemma 4</span>
          <span>Neon PostgreSQL</span>
          <span>ClickHouse</span>
          <span>Clerk</span>
          <span>Google AI Studio</span>
        </div>
      </div>
    </section>
  );
}
