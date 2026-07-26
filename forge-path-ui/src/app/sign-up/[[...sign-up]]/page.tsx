"use client";

import CustomSignUp from "@/components/auth/CustomSignUp";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0B1220] flex flex-col justify-between relative overflow-hidden px-4 py-8">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#2563EB]/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#7C3AED]/10 rounded-full blur-[150px]" />

      <div className="flex-1 flex items-center justify-center relative z-10">
        <CustomSignUp />
      </div>

      {/* Footer Stack */}
      <div className="w-full max-w-[450px] mx-auto text-center relative z-10 mt-8">
        <p className="text-[10px] text-[#4b5563] uppercase tracking-widest font-semibold mb-2">Enterprise Security Standard</p>
        <div className="flex items-center justify-center gap-5 text-[11px] text-[#6b7280] font-medium">
          <span>AES-256</span>
          <span>SSO Ready</span>
          <span>Clerk Verified</span>
        </div>
      </div>
    </div>
  );
}
