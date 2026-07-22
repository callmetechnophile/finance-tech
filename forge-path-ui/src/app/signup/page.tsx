"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignUpPage() {
  return (
    <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[14px] flex items-center justify-center p-4 overflow-y-auto">
      {/* Background grid behind blur for enhanced depth */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(#faff69 1px, transparent 1px), linear-gradient(90deg, #faff69 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[520px] bg-[#171717] border border-[#303030] rounded-[24px] shadow-[0_25px_80px_rgba(0,0,0,0.65)] p-[40px] flex flex-col items-center"
      >
        {/* Logo / Brand */}
        <div className="mb-6 text-center select-none">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-[#F7F15A] rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-black text-xs font-black">FP</span>
            </div>
            <span className="text-white font-bold tracking-tight text-lg">FORGE-PATH</span>
          </div>
          <p className="text-[11px] text-[#8B8B8B] uppercase tracking-widest font-semibold">
            AI Financial Operating System
          </p>
        </div>

        {/* Clerk SignUp */}
        <div className="w-full flex justify-center">
          <SignUp routing="hash" signInUrl="/login" />
        </div>
        
        <div className="text-center mt-6 text-xs text-[#8B8B8B] select-none">
          Already have an account?{" "}
          <Link href="/login" className="text-[#F7F15A] font-bold hover:underline transition-all">
            Sign In
          </Link>
        </div>

        <p className="text-center mt-4 text-[10px] text-[#8B8B8B] select-none">
          FORGE-PATH · Enterprise Financial OS · v1.0.0 PROD
        </p>
      </motion.div>
    </div>
  );
}
