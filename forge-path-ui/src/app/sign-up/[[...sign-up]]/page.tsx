"use client";

import { useState } from "react";
import { SignUp } from "@clerk/nextjs";
import PhoneSignUp from "@/components/auth/PhoneSignUp";
import { Mail, Phone } from "lucide-react";

export default function SignUpPage() {
  const [activeTab, setActiveTab] = useState<"email" | "phone">("email");

  return (
    <div className="min-h-screen bg-[#0B1220] flex flex-col justify-between relative overflow-hidden px-4 py-8">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#2563EB]/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#7C3AED]/10 rounded-full blur-[150px]" />

      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="w-full max-w-[450px] p-6 rounded-2xl bg-[#0e1218]/90 border border-[#2b3139] shadow-2xl backdrop-blur-md">
          {/* Tab Selector */}
          <div className="flex bg-[#0b0e11] p-1 rounded-xl border border-[#1f2d44] mb-6">
            <button
              onClick={() => setActiveTab("email")}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "email"
                  ? "bg-[#1e2329] text-white shadow-sm border border-[#2b3139]"
                  : "text-[#848e9c] hover:text-white bg-transparent border border-transparent"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Corporate Email
            </button>
            <button
              onClick={() => setActiveTab("phone")}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "phone"
                  ? "bg-[#fcd535] text-black shadow-sm"
                  : "text-[#848e9c] hover:text-white bg-transparent border border-transparent"
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              Phone SMS OTP
            </button>
          </div>

          {/* Render Active Tab */}
          <div className="transition-all duration-300">
            {activeTab === "email" ? (
              <div className="flex justify-center cl-override-wrapper">
                <SignUp path="/sign-up" />
              </div>
            ) : (
              <PhoneSignUp />
            )}
          </div>
        </div>
      </div>

      {/* Footer Stack */}
      <div className="w-full max-w-[450px] mx-auto text-center relative z-10 mt-8">
        <p className="text-[10px] text-[#4b5563] uppercase tracking-widest font-semibold mb-2">Security Standard</p>
        <div className="flex items-center justify-center gap-5 text-[11px] text-[#6b7280] font-medium">
          <span>AES-256</span>
          <span>Twilio Secure</span>
          <span>Clerk Verified</span>
        </div>
      </div>
    </div>
  );
}
