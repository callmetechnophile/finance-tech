"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#2b3139] bg-[#0b0e11] py-16 px-6 lg:px-12 relative z-10 text-left select-none">
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
            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/architecture" className="hover:text-white transition-colors">Architecture</Link></li>
            <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
          </ul>
        </div>

        {/* Resources Links */}
        <div className="space-y-3">
          <h5 className="text-[10px] font-bold text-white uppercase tracking-wider">Resources</h5>
          <ul className="space-y-2 text-[11px] text-[#707a8a] font-semibold">
            <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
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
    </footer>
  );
}
