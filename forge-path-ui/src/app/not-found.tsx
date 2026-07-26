"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpCircle, ChevronLeft, LayoutDashboard } from "lucide-react";

export default function GlobalNotFound() {
  const pathname = usePathname();

  // Check if it's a public route
  const isPublicRoute =
    pathname === "/" ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/signup") ||
    pathname?.startsWith("/sign-up") ||
    pathname?.startsWith("/features") ||
    pathname?.startsWith("/architecture") ||
    pathname?.startsWith("/technology") ||
    pathname?.startsWith("/docs") ||
    pathname?.startsWith("/about") ||
    pathname?.startsWith("/contact");

  return (
    <main className="min-h-screen bg-[#0b0e11] text-white flex items-center justify-center p-6 select-none relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#fcd535]/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#2563EB]/10 rounded-full blur-[100px]" />

      <div className="max-w-md w-full p-8 rounded-2xl bg-[#121824] border border-[#1f2d44] text-center space-y-6 relative z-10 shadow-2xl">
        <div className="w-14 h-14 rounded-xl bg-[#fcd535]/10 border border-[#fcd535]/20 flex items-center justify-center mx-auto text-[#fcd535]">
          <HelpCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">Page Not Found</h1>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            The page <span className="text-white font-mono font-semibold">{pathname || "requested"}</span> doesn't exist, has been moved, or is temporarily unavailable.
          </p>
        </div>
        <div className="pt-2 flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#fcd535] hover:bg-[#e2be28] text-[#181a20] text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            <LayoutDashboard className="w-4 h-4" />
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-[#1f2d44] hover:bg-[#2b3e5c] text-white text-xs font-bold rounded-xl transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home Page
          </Link>
        </div>
      </div>
    </main>
  );
}
