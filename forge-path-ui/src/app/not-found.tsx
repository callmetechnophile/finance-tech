"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpCircle, ChevronLeft } from "lucide-react";

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

  if (isPublicRoute) {
    return (
      <main className="min-h-screen bg-[#0b0e11] text-white flex items-center justify-center p-6 select-none relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#fcd535]/5 rounded-full blur-[100px]" />
        
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#1e2329] border border-[#2b3139] text-center space-y-6 relative z-10 shadow-xl">
          <div className="w-14 h-14 rounded-xl bg-[#fcd535]/10 border border-[#fcd535]/20 flex items-center justify-center mx-auto text-[#fcd535]">
            <HelpCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Page Not Found</h1>
            <p className="text-xs text-[#707a8a] leading-relaxed">
              The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#fcd535] hover:bg-[#e2be28] text-[#181a20] text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Workspace default 404
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-8">
      <div className="max-w-md w-full p-8 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-center space-y-6">
        <div className="w-12 h-12 rounded-md bg-[#faff69]/10 border border-[#faff69]/20 flex items-center justify-center mx-auto text-[#faff69] font-bold text-xl">
          ?
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-white tracking-tight">Workspace Not Found</h1>
          <p className="text-xs text-[#cccccc]">
            The requested module route does not exist or has been archived.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="block w-full py-2 bg-[#faff69] hover:bg-[#e6eb52] text-[#0a0a0a] text-xs font-bold rounded-md transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
