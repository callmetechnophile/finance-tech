"use client";

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative">
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#faff69 1px, transparent 1px), linear-gradient(90deg, #faff69 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#faff69] rounded-lg flex items-center justify-center">
              <span className="text-black text-xs font-black">FP</span>
            </div>
            <span className="text-white font-bold tracking-tight text-lg">FORGE-PATH</span>
          </div>
          <p className="text-[11px] text-[#555555] uppercase tracking-widest">
            AI Financial Operating System
          </p>
        </div>

        {/* Clerk SignIn */}
        <SignIn routing="hash" />
        
        <p className="text-center mt-6 text-[10px] text-[#444444]">
          FORGE-PATH · Enterprise Financial OS · v1.0.0 PROD
        </p>
      </div>
    </div>
  );
}
