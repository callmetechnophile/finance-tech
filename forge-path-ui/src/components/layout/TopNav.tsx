"use client";

import { useState } from "react";
import { Search, Bell, Menu, User } from "lucide-react";
import Link from "next/link";
import { useSessionStore } from "@/shared/stores/session.store";

interface TopNavProps {
  onMobileMenuOpen?: () => void;
}

export function TopNav({ onMobileMenuOpen }: TopNavProps) {
  const [searchValue, setSearchValue] = useState("");
  const { user, isAuthenticated } = useSessionStore();

  // Derive display values from live session — never cached or hardcoded
  const firstName = isAuthenticated && user?.name
    ? user.name.split(" ")[0]
    : "User";
  const initials = isAuthenticated && user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : null;

  return (
    <header className="h-[48px] border-b border-[#1a1a1a] bg-[#0a0a0a] flex items-center px-4 gap-4 sticky top-0 z-40 select-none">
      {/* Mobile Toggle */}
      <button onClick={onMobileMenuOpen} className="lg:hidden text-white/50 hover:text-white">
        <Menu className="w-4 h-4" />
      </button>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-[480px] mx-auto relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
        <input
          type="text"
          placeholder="Search across documents, customers, invoices..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full pl-9 pr-12 h-[32px] rounded bg-[#121212] border border-[#222] text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#faff69] transition-all font-mono"
        />
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold text-white/30 bg-[#1a1a1a] px-1.5 py-0.5 rounded border border-white/5">
          36 K
        </span>
      </div>

      {/* Right Probes & User */}
      <div className="flex items-center gap-3 ml-auto shrink-0 text-xs">
        <div className="hidden sm:flex items-center gap-2 px-2 py-1 rounded bg-[#121212] border border-[#222] text-[10px] text-white/50 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Gemma 4 • NIM • 145ms</span>
        </div>

        <button className="relative p-1.5 rounded text-white/60 hover:text-white hover:bg-[#161616]">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#faff69]" />
        </button>

        {/* Avatar & name — derived from live session store */}
        <Link href={isAuthenticated ? "/settings" : "/login"} className="flex items-center gap-2 hover:opacity-80">
          <div className="w-6 h-6 rounded bg-[#faff69] text-black font-bold flex items-center justify-center text-[10px]">
            {initials ?? <User className="w-3.5 h-3.5" />}
          </div>
          <span className="hidden md:inline text-xs text-white/80 font-bold">
            {firstName}
          </span>
        </Link>
      </div>
    </header>
  );
}
