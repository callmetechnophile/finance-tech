"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Zap } from "lucide-react";

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

export default function StatsAndFooter() {
  return (
    <section className="relative bg-[#0b0e11] select-none border-t border-[#2b3139] overflow-hidden">
      {/* Final CTA Container */}
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
          <a
            href="/login"
            className="h-10 px-6 rounded-md bg-[#fcd535] hover:bg-[#f0b90b] text-[#181a20] font-bold text-xs transition-all flex items-center justify-center shadow-lg"
          >
            Launch Workspace
          </a>

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

      {/* Footer Column Grid */}
      <div className="w-full border-t border-[#2b3139] bg-[#0b0e11] py-16 px-6 lg:px-12 relative z-10 text-left">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo / Brand Info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2 select-none">
              <div className="w-6 h-6 rounded bg-[#fcd535] flex items-center justify-center shadow-sm">
                <span className="text-[#181a20] text-[10px] font-black">FP</span>
              </div>
              <span className="text-white font-bold tracking-tight text-sm">FORGE-PATH</span>
            </div>
            <p className="text-[11px] text-[#707a8a] leading-relaxed max-w-xs font-semibold">
              Enterprise Financial Operating System for AI-Powered SMEs. Automated ledger intelligence, forecasting, and risk tracking.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h5 className="text-[10px] font-bold text-white uppercase tracking-wider">Product</h5>
            <ul className="space-y-2 text-[11px] text-[#707a8a] font-semibold">
              <li><Link href="/login" className="hover:text-white transition-colors">Workspace</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">OCR Parser</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Forecasting</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <h5 className="text-[10px] font-bold text-white uppercase tracking-wider">Company</h5>
            <ul className="space-y-2 text-[11px] text-[#707a8a] font-semibold">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-3">
            <h5 className="text-[10px] font-bold text-white uppercase tracking-wider">Resources</h5>
            <ul className="space-y-2 text-[11px] text-[#707a8a] font-semibold">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="max-w-6xl mx-auto border-t border-[#2b3139] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#707a8a] font-semibold">
          <span>&copy; {new Date().getFullYear()} FORGE-PATH Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </section>
  );
}
