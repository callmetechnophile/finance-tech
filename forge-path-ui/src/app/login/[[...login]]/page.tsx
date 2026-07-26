"use client";

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0B1220] flex flex-col justify-between relative overflow-hidden px-4 py-8">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#2563EB]/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#7C3AED]/10 rounded-full blur-[150px]" />

      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="w-full max-w-[450px] p-6 rounded-2xl bg-[#0e1218]/90 border border-[#2b3139] shadow-2xl backdrop-blur-md flex justify-center">
          <SignIn path="/login" signUpUrl="/sign-up" forceRedirectUrl="/dashboard" />
        </div>
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
