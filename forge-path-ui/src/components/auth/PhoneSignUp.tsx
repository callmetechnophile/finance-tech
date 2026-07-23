"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { Phone, ShieldAlert, CheckCircle2, Lock, ArrowRight, RefreshCw, KeyRound } from "lucide-react";
import { toast } from "sonner";

export default function PhoneSignUp() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  
  // Loading states
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Expiry / Rate limit states
  const [attempts, setAttempts] = useState(0);
  const [remainingTries, setRemainingTries] = useState(3);
  const [isLocked, setIsLocked] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Timer logic for resend button
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 8) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const data = await res.json();
      if (data.success) {
        setStep("otp");
        setAttempts(0);
        setRemainingTries(3);
        setIsLocked(false);
        setResendTimer(60);
        toast.success(data.message || "OTP code sent successfully!");
      } else {
        toast.error(data.error || "Failed to send code. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while sending the OTP.");
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      toast.error("Please enter a 6-digit verification code.");
      return;
    }

    if (isLocked) {
      toast.error("OTP limit exceeded. Please request a new code.");
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber, code: otpCode }),
      });

      const data = await res.json();
      if (data.success) {
        // Authenticate user in the store
        useAuthStore.getState().setAuth(data.user, data.company, data.token);
        toast.success("Phone registration successful! Welcome to FORGE-PATH.");
        
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 800);
      } else {
        // Handle failure attempts count
        const newAttempts = (data.attempts || attempts + 1);
        setAttempts(newAttempts);
        setRemainingTries(Math.max(0, 3 - newAttempts));
        
        if (data.locked || newAttempts >= 3) {
          setIsLocked(true);
          toast.error("Security Lockout: OTP limit exceeded (3 attempts max).");
        } else {
          toast.error(data.error || "Incorrect code. Please try again.");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during verification.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBackToPhone = () => {
    setStep("phone");
    setOtpCode("");
    setIsLocked(false);
  };

  return (
    <div className="w-full">
      {step === "phone" ? (
        <form onSubmit={handleSendOtp} className="space-y-5">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-white tracking-tight">Register with Phone</h2>
            <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed">
              Enter your mobile number to receive a secure login OTP code.
            </p>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#848e9c] uppercase tracking-wider mb-2">
              Phone Number
            </label>
            <div className="relative flex">
              <div className="flex items-center justify-center bg-[#0d1625] border border-[#1f2d44] border-r-0 rounded-l-xl px-3 text-xs text-[#848e9c] select-none font-bold">
                +91
              </div>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="7892060478"
                className="w-full pl-3 pr-4 py-3 rounded-r-xl bg-[#0d1625] border border-[#1f2d44] text-sm text-white focus:outline-none focus:border-[#fcd535] focus:ring-1 focus:ring-[#fcd535]/30 transition-all placeholder-[#4B5563]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="w-full py-3 rounded-xl bg-[#fcd535] hover:bg-[#e6bf2e] font-bold text-sm text-black shadow-lg shadow-[#fcd535]/10 hover:shadow-[#fcd535]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                Send Verification SMS
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center justify-center gap-1.5">
              <KeyRound className="w-4 h-4 text-[#fcd535]" />
              Enter Verification Code
            </h2>
            <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed">
              We sent a 6-digit code to <span className="text-white font-bold font-mono">+91 {phoneNumber}</span>
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] font-bold text-[#848e9c] uppercase tracking-wider">
                6-Digit OTP Code
              </label>
              <button
                type="button"
                onClick={handleBackToPhone}
                className="text-[10px] text-[#fcd535] hover:underline font-bold"
              >
                Change Number
              </button>
            </div>
            
            <input
              type="text"
              required
              maxLength={6}
              disabled={isLocked}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="e.g. 123456"
              className="w-full py-3 text-center tracking-[0.5em] text-lg font-bold rounded-xl bg-[#0d1625] border border-[#1f2d44] text-white focus:outline-none focus:border-[#fcd535] focus:ring-1 focus:ring-[#fcd535]/30 transition-all placeholder-[#4B5563] disabled:opacity-40 disabled:cursor-not-allowed"
            />
          </div>

          {/* Attempts Status Indicator */}
          <div className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
            isLocked
              ? "bg-red-500/10 border-red-500/20 text-red-400"
              : remainingTries === 1
              ? "bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse"
              : "bg-[#0d1625] border-[#1f2d44] text-[#848e9c]"
          }`}>
            {isLocked ? (
              <>
                <Lock className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold">Security Lockout Active</p>
                  <p className="text-[10px] text-red-400/80 mt-0.5">
                    OTP verification limit (3 attempts) exceeded. Please change your number or click resend below.
                  </p>
                </div>
              </>
            ) : remainingTries === 1 ? (
              <>
                <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold">Final Attempt Remaining</p>
                  <p className="text-[10px] text-amber-400/80 mt-0.5">
                    Entering another incorrect code will permanently invalidate this code for security.
                  </p>
                </div>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-[#fcd535]" />
                <div>
                  <p className="font-bold text-white/90">OTP Rate Limiting Enabled</p>
                  <p className="text-[10px] text-[#848e9c] mt-0.5">
                    You have <span className="text-white font-bold">{remainingTries} of 3</span> verification attempts left.
                  </p>
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={isVerifying || isLocked || otpCode.length !== 6}
            className="w-full py-3 rounded-xl bg-[#fcd535] hover:bg-[#e6bf2e] font-bold text-sm text-black shadow-lg shadow-[#fcd535]/10 hover:shadow-[#fcd535]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              "Verify OTP & Register"
            )}
          </button>

          {/* Resend Action */}
          <div className="text-center pt-2">
            <button
              type="button"
              disabled={resendTimer > 0}
              onClick={handleSendOtp}
              className="inline-flex items-center gap-1 text-xs text-[#848e9c] hover:text-white disabled:text-[#4b5563] disabled:no-underline transition-colors font-bold disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSending ? "animate-spin" : ""}`} />
              {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend OTP Code"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
