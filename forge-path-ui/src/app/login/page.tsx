"use client";

import React, { useState } from "react";
import { Mail, Lock, ArrowRight, Zap, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";

export default function LoginPage() {
  const [email, setEmail] = useState("finance@apex.com");
  const [password, setPassword] = useState("••••••••");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (userEmail: string) => {
    setLoading(true);
    setError("");

    useAuthStore.getState().setAuth(
      {
        id: `usr-${Date.now()}`,
        email: userEmail || "finance@apex.com",
        name: userEmail ? userEmail.split("@")[0] : "Alexander Miller",
        role: "admin",
        company_id: "apex-manufacturing",
      },
      {
        id: "apex-manufacturing",
        name: "Apex Manufacturing Inc.",
        industry: "CNC & Fabrication",
        currency: "USD",
      },
      "forge-token-jwt-session"
    );

    if (typeof window !== "undefined") {
      localStorage.setItem("forge_token", "forge-token-jwt-session");
      localStorage.setItem("forge_company_id", "apex-manufacturing");
      window.location.href = "/dashboard";
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0e11] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background styling elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#2563EB]/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#7C3AED]/10 rounded-full blur-[150px]" />

      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-[#121824] border border-[#1f2d44] shadow-2xl space-y-6">
        <div className="flex flex-col items-center mb-2">
          <img
            src="/icon.jpg"
            alt="FORGE-PATH Logo"
            className="w-12 h-12 rounded-xl shadow-lg mb-3 object-cover border border-[#1f2d44]"
          />
          <h1 className="text-2xl font-bold text-white tracking-tight">Sign in to FORGE-PATH</h1>
          <p className="text-xs text-[#9CA3AF] mt-1 text-center font-medium">
            AI Financial Copilot for Manufacturing SMEs
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={() => handleLogin("google.user@apex-manufacturing.com")}
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-[#0b0e14] hover:bg-[#151c2a] border border-[#1f2d44] text-sm font-semibold text-white flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm hover:border-[#2b3139]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z" />
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z" />
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-[#1f2d44] w-full" />
          <span className="bg-[#121824] px-3 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap absolute">
            or sign in with email
          </span>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin(email);
          }}
          className="space-y-4 pt-1"
        >
          <div>
            <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">
              Corporate Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0b0e14] border border-[#1f2d44] text-sm text-white focus:outline-none focus:border-blue-500 transition-all placeholder-[#4B5563]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0b0e14] border border-[#1f2d44] text-sm text-white focus:outline-none focus:border-blue-500 transition-all placeholder-[#4B5563]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#fcd535] hover:bg-[#e2be28] font-bold text-sm text-[#181a20] shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#181a20]/30 border-t-[#181a20] rounded-full animate-spin" />
            ) : (
              <>
                Sign In to Workspace
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Instant Demo Login */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => handleLogin("alexander@apex-manufacturing.com")}
            className="w-full py-2.5 rounded-xl bg-[#0b0e14] hover:bg-[#151c2a] border border-[#1f2d44] text-xs font-bold text-[#fcd535] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-[#fcd535]" />
            Instant Demo Access (1-Click)
          </button>
        </div>

        <div className="text-center pt-1">
          <p className="text-xs text-[#9CA3AF]">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-[#fcd535] font-semibold hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
