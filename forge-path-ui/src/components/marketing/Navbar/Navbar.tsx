"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowRight, Menu, X, Briefcase, Check } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useSessionStore } from "@/shared/stores/session.store";

export default function Navbar() {
  const { isAuthenticated, user } = useSessionStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    jobTitle: "",
    teamSize: "",
    country: "",
    message: "",
    phone: "",
  });

  const pathname = usePathname();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/enterprise-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Form submission failed");
      }

      setIsSuccess(true);
      setFormData({
        name: "",
        email: "",
        companyName: "",
        jobTitle: "",
        teamSize: "",
        country: "",
        message: "",
        phone: "",
      });
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 grid grid-cols-2 md:grid-cols-3 items-center">

        {/* ── Left: Branding ── */}
        <div className="flex justify-start">
          <Link
            href="/"
            className="flex items-center gap-2 group select-none"
          >
            <Image
              src="/forge-path-logo.jpg"
              alt="FORGE-PATH"
              width={24}
              height={24}
              className="rounded-md object-contain"
            />
            <span className="text-[12px] font-semibold text-white tracking-wide uppercase transition-colors duration-200 group-hover:text-[#fcd535]">
              FORGE<span className="text-[#fcd535]">-PATH</span>
            </span>
          </Link>
        </div>

        {/* ── Center: Desktop Nav Links ── */}
        <nav className="hidden md:flex items-center justify-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative py-1 text-[11px] font-medium uppercase tracking-widest transition-colors duration-150 group ${
                  isActive ? "text-[#fcd535]" : "text-[#848e9c] hover:text-white"
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#fcd535] origin-left transition-transform duration-200 ${
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* ── Right: Desktop CTAs / Hamburger ── */}
        <div className="flex items-center justify-end">
          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="text-[11px] font-bold text-[#848e9c] hover:text-white uppercase tracking-wider transition-colors px-3 py-2 no-underline cursor-pointer"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="text-[11px] font-bold text-[#848e9c] hover:text-white uppercase tracking-wider transition-colors px-3 py-2 no-underline cursor-pointer"
                >
                  Sign Up
                </Link>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 h-8 px-4 rounded-md bg-[#fcd535] hover:bg-[#f0b90b] text-[#181a20] text-[11px] font-extrabold uppercase tracking-wider transition-all duration-150 shadow-md shadow-[#fcd535]/20 cursor-pointer border-none"
                >
                  Enterprise Contact <Briefcase className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <UserButton />
                  {user && user.email.endsWith("@forge-path.internal") && (
                    <button
                      onClick={() => {
                        useSessionStore.getState().clearSession();
                        window.location.href = "/";
                      }}
                      className="text-[11px] font-bold text-[#848e9c] hover:text-white uppercase tracking-wider transition-colors px-3 py-2 bg-transparent border-none cursor-pointer"
                    >
                      Sign Out
                    </button>
                  )}
                </div>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 h-8 px-4 rounded-md bg-[#fcd535] hover:bg-[#f0b90b] text-[#181a20] text-[11px] font-extrabold uppercase tracking-wider transition-all duration-150 shadow-md shadow-[#fcd535]/20 cursor-pointer no-underline border-none"
                >
                  Launch Workspace <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-[#848e9c] hover:text-white hover:bg-[#1e2329] transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
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
          <div className="flex flex-col gap-3 pt-2">
            {!isAuthenticated ? (
              <>
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center text-[11px] font-bold text-[#848e9c] hover:text-white uppercase tracking-wider py-2 border border-[#2b3139] rounded-md transition-colors bg-transparent no-underline cursor-pointer"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center text-[11px] font-bold text-[#848e9c] hover:text-white uppercase tracking-wider py-2 border border-[#2b3139] rounded-md transition-colors bg-transparent no-underline cursor-pointer"
                  >
                    Sign Up
                  </Link>
                </div>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="flex-grow inline-flex items-center justify-center gap-1.5 h-9 rounded-md bg-[#fcd535] hover:bg-[#f0b90b] text-[#181a20] text-[11px] font-extrabold uppercase tracking-wider transition-all border-none cursor-pointer"
                >
                  Contact <Briefcase className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between py-2 border-b border-[#2b3139]/30">
                  <UserButton />
                  {user && user.email.endsWith("@forge-path.internal") && (
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        useSessionStore.getState().clearSession();
                        window.location.href = "/";
                      }}
                      className="text-[11px] font-bold text-[#848e9c] hover:text-white uppercase tracking-wider transition-colors bg-transparent border-none cursor-pointer"
                    >
                      Sign Out
                    </button>
                  )}
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex-grow inline-flex items-center justify-center gap-1.5 h-9 rounded-md bg-[#fcd535] hover:bg-[#f0b90b] text-[#181a20] text-[11px] font-extrabold uppercase tracking-wider transition-all no-underline border-none cursor-pointer"
                >
                  Launch Workspace <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* ── Enterprise Inquiry Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/75 backdrop-blur-md flex justify-center items-start py-8 md:py-16 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-[700px] bg-[#181a20]/95 border border-[#2b3139] p-6 md:p-8 rounded-2xl shadow-2xl relative my-auto"
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setIsSuccess(false);
                setErrorMsg("");
              }}
              className="absolute top-4 right-4 p-2 text-[#848e9c] hover:text-white hover:bg-[#2b3139] rounded-lg transition-colors border-none cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSuccess ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">Enterprise Inquiry</h2>
                  <p className="text-xs text-[#848e9c] mt-1 leading-relaxed">
                    Tell us about your organization and we'll arrange a technical consultation.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-[#848e9c] uppercase tracking-wider mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0b0e11] border border-[#2b3139] rounded-lg text-xs focus:outline-none focus:border-[#fcd535] focus:ring-1 focus:ring-[#fcd535]/35 transition-all text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#848e9c] uppercase tracking-wider mb-1.5">Work Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0b0e11] border border-[#2b3139] rounded-lg text-xs focus:outline-none focus:border-[#fcd535] focus:ring-1 focus:ring-[#fcd535]/35 transition-all text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-[#848e9c] uppercase tracking-wider mb-1.5">Company Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0b0e11] border border-[#2b3139] rounded-lg text-xs focus:outline-none focus:border-[#fcd535] focus:ring-1 focus:ring-[#fcd535]/35 transition-all text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#848e9c] uppercase tracking-wider mb-1.5">Job Title *</label>
                      <input
                        type="text"
                        required
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0b0e11] border border-[#2b3139] rounded-lg text-xs focus:outline-none focus:border-[#fcd535] focus:ring-1 focus:ring-[#fcd535]/35 transition-all text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-[#848e9c] uppercase tracking-wider mb-1.5">Company Size *</label>
                      <select
                        required
                        value={formData.teamSize}
                        onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0b0e11] border border-[#2b3139] rounded-lg text-xs focus:outline-none focus:border-[#fcd535] focus:ring-1 focus:ring-[#fcd535]/35 transition-all text-[#848e9c] [&>option]:bg-[#181a20] [&>option]:text-white"
                      >
                        <option value="">Select Size</option>
                        <option value="1-50">1–50</option>
                        <option value="51-200">51–200</option>
                        <option value="201-1000">201–1000</option>
                        <option value="1000+">1000+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#848e9c] uppercase tracking-wider mb-1.5">Country *</label>
                      <input
                        type="text"
                        required
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0b0e11] border border-[#2b3139] rounded-lg text-xs focus:outline-none focus:border-[#fcd535] focus:ring-1 focus:ring-[#fcd535]/35 transition-all text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#848e9c] uppercase tracking-wider mb-1.5">Phone (Optional)</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0b0e11] border border-[#2b3139] rounded-lg text-xs focus:outline-none focus:border-[#fcd535] focus:ring-1 focus:ring-[#fcd535]/35 transition-all text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#848e9c] uppercase tracking-wider mb-1.5">Enterprise Requirements *</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Security, compliance, volume, target systems..."
                      className="w-full px-3 py-2 bg-[#0b0e11] border border-[#2b3139] rounded-lg text-xs focus:outline-none focus:border-[#fcd535] focus:ring-1 focus:ring-[#fcd535]/35 transition-all text-white placeholder-white/20 resize-none"
                    />
                  </div>

                  {errorMsg && (
                    <p className="text-xs text-[#f6465d] bg-[#f6465d]/10 border border-[#f6465d]/20 px-3 py-2 rounded-lg">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-10 rounded-md bg-[#fcd535] hover:bg-[#f0b90b] disabled:bg-[#fcd535]/50 text-[#181a20] text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-[#fcd535]/20 cursor-pointer disabled:cursor-not-allowed border-none"
                  >
                    {isSubmitting ? (
                      <span className="w-4 h-4 border-2 border-[#181a20]/30 border-t-[#181a20] rounded-full animate-spin" />
                    ) : (
                      "Submit Enterprise Request"
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 bg-[#0ecb81]/15 border border-[#0ecb81]/30 rounded-full flex items-center justify-center text-[#0ecb81] mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight uppercase">✓ Request Submitted</h2>
                  <p className="text-xs md:text-sm text-[#848e9c] max-w-md mx-auto leading-relaxed">
                    Thank you for contacting FORGE-PATH. One of our enterprise solution architects will contact you within one business day.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                  <Link
                    href="/docs"
                    onClick={() => {
                      setIsModalOpen(false);
                      setIsSuccess(false);
                    }}
                    className="w-full sm:w-auto h-10 px-6 rounded-md bg-[#fcd535] hover:bg-[#f0b90b] text-[#181a20] text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center"
                  >
                    View Documentation
                  </Link>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setIsSuccess(false);
                    }}
                    className="w-full sm:w-auto h-10 px-6 rounded-md border border-[#2b3139] hover:bg-[#1e2329] text-white text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center cursor-pointer bg-transparent"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </motion.header>
  );
}
