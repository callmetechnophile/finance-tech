"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

export default function CTA() {
  return (
    <section className="relative bg-[#0b0e11] select-none border-t border-[#2b3139] overflow-hidden">
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-24 text-center space-y-8">
        {/* Glow behind final CTA */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#fcd535]/5 rounded-full blur-[120px] pointer-events-none" />

        <h3 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight">
          Ready to Modernize Your <br />Financial Operations?
        </h3>
        <p className="text-[#eaecef] text-sm md:text-base max-w-lg mx-auto leading-relaxed">
          Unlock low-latency document intelligence, 90-day cash forecasting, and conversational AI risk models today.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/login"
            className="h-10 px-6 rounded-md bg-[#fcd535] hover:bg-[#f0b90b] text-[#181a20] font-bold text-xs transition-all flex items-center justify-center shadow-lg"
          >
            Launch Workspace
          </Link>

          <a
            href="https://github.com/callmetechnophile/SME-FINANCE-SOLUTION"
            target="_blank"
            rel="noreferrer"
            className="h-10 px-6 rounded-md border border-[#3a3a3a] hover:bg-[#242424] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <GithubIcon className="w-4 h-4 text-white" /> View Source
          </a>
        </div>
      </div>
    </section>
  );
}
