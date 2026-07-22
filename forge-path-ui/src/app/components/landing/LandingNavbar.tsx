"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "Features", href: "/features" },
    { label: "Architecture", href: "/architecture" },
    { label: "Docs", href: "/docs" },
    { label: "About", href: "/about" },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0b0e11]/90 backdrop-blur-md border-b border-[#2b3139]/60 shadow-lg shadow-black/40"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 group select-none">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden ring-1 ring-[#fcd535]/20 group-hover:ring-[#fcd535]/60 transition-all duration-200 shadow-lg shadow-[#fcd535]/10">
            <Image
              src="/forge-path-logo.jpg"
              alt="FORGE-PATH Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <span className="text-sm font-extrabold text-white tracking-wide group-hover:text-[#fcd535] transition-colors duration-200">
            FORGE<span className="text-[#fcd535]">-PATH</span>
          </span>
        </Link>

        {/* ── Desktop Nav Links ── */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[11px] font-semibold text-[#848e9c] hover:text-white uppercase tracking-widest transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ── Desktop CTAs ── */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-[11px] font-bold text-[#848e9c] hover:text-white uppercase tracking-wider transition-colors px-3 py-2"
          >
            Sign In
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 h-8 px-4 rounded-md bg-[#fcd535] hover:bg-[#f0b90b] text-[#181a20] text-[11px] font-extrabold uppercase tracking-wider transition-all duration-150 shadow-md shadow-[#fcd535]/20"
          >
            Launch Workspace <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* ── Mobile Hamburger ── */}
        <button
          className="md:hidden p-2 rounded-lg text-[#848e9c] hover:text-white hover:bg-[#1e2329] transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-[#0b0e11]/95 backdrop-blur-md border-t border-[#2b3139] px-6 pb-6 pt-4 flex flex-col gap-4"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[12px] font-semibold text-[#848e9c] hover:text-white uppercase tracking-widest py-2 border-b border-[#2b3139]/40 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/login"
              className="flex-1 text-center text-[11px] font-bold text-[#848e9c] hover:text-white uppercase tracking-wider py-2 border border-[#2b3139] rounded-md transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-md bg-[#fcd535] hover:bg-[#f0b90b] text-[#181a20] text-[11px] font-extrabold uppercase tracking-wider transition-all"
              onClick={() => setMobileOpen(false)}
            >
              Launch <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
