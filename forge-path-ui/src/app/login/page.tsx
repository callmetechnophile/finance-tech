"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { Zap, Bot, Shield, KeyRound, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";

export default function LoginPage() {
  const [companyId, setCompanyId] = useState("apex-manufacturing-uuid");
  const [email, setEmail] = useState("finance@apex.com");
  const [password, setPassword] = useState("••••••••");
  const [isLoading, setIsLoading] = useState(false);
  
  // Custom router bypass for Next.js App router
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      useAuthStore.getState().setAuth(
        { id: "usr-1", email, name: "Alexander Miller", role: "admin", company_id: companyId },
        { id: companyId, name: "Apex Manufacturing Inc.", industry: "CNC & Fabrication", currency: "USD" },
        "mock-jwt-token"
      );
      toast.success("Successfully authenticated. Welcome back!");
      window.location.href = "/dashboard";
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0B1220] flex flex-col justify-between relative overflow-hidden px-4 py-8">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#2563EB]/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#7C3AED]/10 rounded-full blur-[150px]" />

      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 rounded-2xl glass border border-[#1f2d44] shadow-2xl relative z-10"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg mb-3">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">FORGE-PATH</h1>
            <p className="text-xs text-[#9CA3AF] mt-1 text-center font-medium">
              AI Financial Copilot for Manufacturing SMEs
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Company ID</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563]" />
                <input
                  type="text"
                  required
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  placeholder="e.g. apex-manufacturing"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0d1625] border border-[#1f2d44] text-sm text-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 transition-all placeholder-[#4B5563]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Bot className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0d1625] border border-[#1f2d44] text-sm text-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 transition-all placeholder-[#4B5563]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Forgot Password?</a>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0d1625] border border-[#1f2d44] text-sm text-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 transition-all placeholder-[#4B5563]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-sm text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Secure Sign In
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Footer Creds */}
      <div className="w-full max-w-md mx-auto text-center relative z-10 mt-8">
        <p className="text-[10px] text-[#4B5563] uppercase tracking-widest font-semibold mb-3">Enterprise Stack</p>
        <div className="flex items-center justify-center gap-5 text-xs text-[#6B7280] font-medium opacity-70">
          <span>Gemma 4</span>
          <span>NVIDIA NIM</span>
          <span>NeonDB</span>
          <span>Twilio</span>
          <span>Brevo</span>
        </div>
      </div>
    </div>
  );
}
