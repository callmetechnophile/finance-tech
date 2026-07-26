"use client";

import React, { useState, useRef } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Zap, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function CustomSignUp() {
  const clerkSignUp = useSignUp();
  const signUp = (clerkSignUp as any)?.signUp;
  const setActive = (clerkSignUp as any)?.setActive;

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Handle Google OAuth Sign Up
  const handleGoogleSignUp = async () => {
    setError("");
    if (!signUp) return;

    try {
      if (typeof signUp.authenticateWithRedirect === "function") {
        await signUp.authenticateWithRedirect({
          strategy: "oauth_google",
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/dashboard",
        });
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage || err?.message || "Failed to initialize Google sign up.");
    }
  };

  // Handle Initial Sign Up Submission
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (signUp) {
        await signUp.create({
          emailAddress: email,
          password: password,
        });

        if (typeof signUp.prepareEmailAddressVerification === "function") {
          await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        } else if (typeof signUp.prepareVerification === "function") {
          await signUp.prepareVerification({ strategy: "email_code" });
        }
      }
      setVerifying(true);
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage || err?.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Input Box Change
  const handleOtpChange = (index: number, value: string) => {
    const char = value.slice(-1);
    const newCode = [...code];
    newCode[index] = char;
    setCode(newCode);

    if (char && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  // Handle Verification Submission
  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length < 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let result: any = null;

      if (signUp) {
        if (typeof signUp.attemptEmailAddressVerification === "function") {
          result = await signUp.attemptEmailAddressVerification({ code: fullCode });
        } else if (typeof signUp.attemptVerification === "function") {
          result = await signUp.attemptVerification({ code: fullCode, strategy: "email_code" });
        }
      }

      if (result?.status === "complete" || !signUp) {
        if (result?.createdSessionId && setActive) {
          await setActive({ session: result.createdSessionId });
        }
        router.push("/dashboard");
      } else {
        setError("Verification status incomplete. Please check your code.");
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage || err?.message || "Invalid verification code. Please check your email.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      if (signUp) {
        if (typeof signUp.prepareEmailAddressVerification === "function") {
          await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        } else if (typeof signUp.prepareVerification === "function") {
          await signUp.prepareVerification({ strategy: "email_code" });
        }
      }
      setError("A new verification code has been sent to your email.");
    } catch (err: any) {
      setError(err?.message || "Failed to resend code.");
    }
  };

  if (verifying) {
    return (
      <div className="w-full max-w-md p-8 rounded-2xl bg-[#121824] border border-[#1f2d44] shadow-2xl space-y-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-[#fcd535]/10 border border-[#fcd535]/20 flex items-center justify-center mx-auto text-[#fcd535]">
          <Mail className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Verify your email</h2>
          <p className="text-xs text-[#9CA3AF]">
            Enter the 6-digit verification code sent to <br />
            <span className="text-white font-semibold">{email}</span>
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleVerifySubmit} className="space-y-6">
          {/* 6 Custom Blank Input Boxes */}
          <div className="flex justify-center gap-2.5">
            {code.map((digit, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-12 text-center text-lg font-bold text-white bg-[#0b0e14] border border-[#1f2d44] rounded-xl focus:outline-none focus:border-[#fcd535] focus:ring-1 focus:ring-[#fcd535]/30 transition-all font-mono"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#fcd535] hover:bg-[#e2be28] font-bold text-sm text-[#181a20] shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#181a20]/30 border-t-[#181a20] rounded-full animate-spin" />
            ) : (
              <>
                Verify & Continue
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-xs text-[#6B7280]">
          Didn't receive a code?{" "}
          <button
            onClick={handleResend}
            className="text-[#fcd535] font-semibold hover:underline bg-transparent border-0 cursor-pointer"
          >
            Resend Code
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-[#121824] border border-[#1f2d44] shadow-2xl space-y-6">
      <div className="flex flex-col items-center mb-2">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg mb-3">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Create your account</h1>
        <p className="text-xs text-[#9CA3AF] mt-1 text-center font-medium">
          Welcome to FORGE-PATH AI Financial Operations
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
        onClick={handleGoogleSignUp}
        className="w-full py-3 px-4 rounded-xl bg-[#0b0e14] hover:bg-[#151c2a] border border-[#1f2d44] text-sm font-semibold text-white flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm hover:border-[#2b3139]"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-[#1f2d44] w-full" />
        <span className="bg-[#121824] px-3 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider whitespace-nowrap absolute">
          or continue with email
        </span>
      </div>

      <form onSubmit={handleSignUpSubmit} className="space-y-4 pt-1">
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
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
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
              Continue with Email
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs text-[#9CA3AF]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#fcd535] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
