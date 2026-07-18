"use client";

import { useState } from "react";
import { Zap, Shield, KeyRound, Building2, Bot } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";

export default function LoginPage() {
  const [companyId, setCompanyId] = useState("apex-manufacturing-uuid");
  const [email, setEmail] = useState("finance@apex.com");
  const [password, setPassword] = useState("••••••••");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      useAuthStore.getState().setAuth(
        { id: "usr-1", email, name: "Alexander Miller", role: "admin", company_id: companyId },
        { id: companyId, name: "Apex Manufacturing Inc.", industry: "CNC & Fabrication", currency: "USD" },
        "mock-jwt-token"
      );
      toast.success("Authenticated successfully.");
      window.location.href = "/dashboard";
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-between relative overflow-hidden px-4 py-8">
      {/* Subtle Yellow Gradient Spotlight */}
      <div className="absolute top-[-30%] left-[25%] w-[50%] h-[50%] bg-[#faff69]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] shadow-2xl relative z-10"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-md bg-[#faff69] flex items-center justify-center shadow-lg mb-3">
              <Zap className="w-6 h-6 text-[#0a0a0a]" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">FORGE-PATH</h1>
            <p className="text-xs text-[#888888] mt-1 text-center font-medium">
              AI Financial Operating System for Manufacturing SMEs
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-2">Company ID</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a5a5a]" />
                <input
                  type="text"
                  required
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-md bg-[#0a0a0a] border border-[#2a2a2a] text-sm text-white focus:outline-none focus:border-[#faff69] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Bot className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a5a5a]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-md bg-[#0a0a0a] border border-[#2a2a2a] text-sm text-white focus:outline-none focus:border-[#faff69] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-bold text-[#888888] uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs text-[#faff69] hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a5a5a]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-md bg-[#0a0a0a] border border-[#2a2a2a] text-sm text-white focus:outline-none focus:border-[#faff69] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-md bg-[#faff69] hover:bg-[#e6eb52] font-semibold text-sm text-[#0a0a0a] shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Access Command Console
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Footer Creds */}
      <div className="w-full max-w-md mx-auto text-center relative z-10 mt-8">
        <p className="text-[10px] text-[#5a5a5a] uppercase tracking-widest font-semibold mb-3">Enterprise Infrastructure Stack</p>
        <div className="flex items-center justify-center gap-5 text-xs text-[#888888] font-medium opacity-70">
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
