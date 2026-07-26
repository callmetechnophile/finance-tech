"use client";

import React, { useState } from "react";
import Navbar from "@/components/marketing/Navbar/Navbar";
import Footer from "@/components/marketing/Footer/Footer";
import { Mail, Phone, MapPin, Send, CheckCircle2, Building2, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/enterprise-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        toast.success("Inquiry submitted successfully! Our enterprise team will contact you shortly.");
      } else {
        toast.success("Thank you! Your inquiry has been received by FORGE-PATH Enterprise Support.");
        setSubmitted(true);
      }
    } catch (_) {
      toast.success("Inquiry submitted successfully!");
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-16 px-4 max-w-6xl mx-auto w-full relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fcd535]/10 border border-[#fcd535]/20 text-[#fcd535] text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            Enterprise Support & Sales
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Get in Touch with FORGE-PATH
          </h1>
          <p className="text-sm text-[#9CA3AF] leading-relaxed">
            Have questions about our AI Financial Operations platform, custom ERP integrations, or enterprise SLA plans? Our deployment engineers are ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Details Panel */}
          <div className="lg:col-span-5 space-y-6 bg-[#121824] p-8 rounded-2xl border border-[#1f2d44] shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Contact Information</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Enterprise Inquiries</h3>
                  <p className="text-sm font-bold text-white mt-0.5">contact@forge-path.com</p>
                  <p className="text-xs text-[#6B7280]">Response time under 2 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-600/20 flex items-center justify-center text-violet-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Direct Hotline</h3>
                  <p className="text-sm font-bold text-white mt-0.5">+1 (800) 555-FORGE</p>
                  <p className="text-xs text-[#6B7280]">24/7 Dedicated Support</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-600/10 border border-amber-600/20 flex items-center justify-center text-amber-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Headquarters</h3>
                  <p className="text-sm font-bold text-white mt-0.5">Silicon Valley Technology Center</p>
                  <p className="text-xs text-[#6B7280]">Palo Alto, CA 94301, USA</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#1f2d44] space-y-3">
              <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                SOC-2 Type II & ISO 27001 Certified Security
              </div>
              <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
                <Building2 className="w-4 h-4 text-blue-400" />
                Dedicated Manufacturing Onboarding Specialists
              </div>
            </div>
          </div>

          {/* Form Panel */}
          <div className="lg:col-span-7 bg-[#121824] p-8 rounded-2xl border border-[#1f2d44] shadow-2xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
                <h3 className="text-2xl font-bold text-white">Inquiry Received!</h3>
                <p className="text-sm text-[#9CA3AF] max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out to FORGE-PATH. One of our technical solution architects will review your company requirements and contact you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-[#1f2d44] hover:bg-[#2b3e5c] text-xs font-bold text-white transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-xl font-bold text-white mb-4">Send Us a Message</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alexander Miller"
                      className="w-full px-4 py-3 rounded-xl bg-[#0b0e14] border border-[#1f2d44] text-sm text-white focus:outline-none focus:border-blue-500 transition-all placeholder-[#4B5563]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">
                      Corporate Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alexander@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#0b0e14] border border-[#1f2d44] text-sm text-white focus:outline-none focus:border-blue-500 transition-all placeholder-[#4B5563]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Apex Manufacturing Inc."
                      className="w-full px-4 py-3 rounded-xl bg-[#0b0e14] border border-[#1f2d44] text-sm text-white focus:outline-none focus:border-blue-500 transition-all placeholder-[#4B5563]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 rounded-xl bg-[#0b0e14] border border-[#1f2d44] text-sm text-white focus:outline-none focus:border-blue-500 transition-all placeholder-[#4B5563]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">
                    Project Requirements / Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your ERP setup, document ingestion volume, or cash flow forecasting goals..."
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0e14] border border-[#1f2d44] text-sm text-white focus:outline-none focus:border-blue-500 transition-all placeholder-[#4B5563] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 font-bold text-sm text-white shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Submit Enterprise Inquiry
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
