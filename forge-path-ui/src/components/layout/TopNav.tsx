"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Search, Settings, Sun, Moon, HelpCircle, ChevronDown, Sparkles, X, History, FileText, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotificationsStore } from "@/store/notifications.store";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface TopNavProps {
  onMobileMenuOpen?: () => void;
}

const recentSearches = [
  { text: "Apex Steel invoice INV-2024-089", type: "invoice" },
  { text: "CNC Machine lease terms", type: "document" },
  { text: "Q3 cash flow projection scenarios", type: "forecast" }
];

export function TopNav({ onMobileMenuOpen }: TopNavProps) {
  const { alerts, unreadCount, markAllRead, dismissAlert } = useNotificationsStore();
  
  // State managers
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showAITooltip, setShowAITooltip] = useState(false);

  // Refs for click-outside detection
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowRecentSearches(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Ctrl + K listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const input = document.getElementById("global-search-input");
        input?.focus();
        setShowRecentSearches(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="h-[72px] border-b border-[#1E253E] bg-[#0B1220]/90 backdrop-blur-xl flex items-center px-6 gap-6 sticky top-0 z-40 shadow-lg">
      
      {/* SECTION 1: Brand & Logo area */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#2563EB]/15">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-[#F9FAFB] text-sm tracking-wide leading-none">FORGE-PATH</span>
          <span className="text-[9px] text-[#9CA3AF] mt-1 font-semibold leading-none uppercase tracking-wider">
            AI Financial Operating System
          </span>
        </div>
      </div>

      {/* SECTION 2: Centered Global Search (40% - 50% width) */}
      <div ref={searchRef} className="flex-1 max-w-[45%] mx-auto relative z-50">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9CA3AF]" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Search invoices, vendors, customers, transactions, forecasts..."
            value={searchValue}
            onFocus={() => setShowRecentSearches(true)}
            onChange={(e) => setSearchValue(e.target.value)}
            className={cn(
              "w-full pl-11 pr-16 h-[46px] rounded-2xl bg-[#111827] border border-[#1E253E]",
              "text-xs text-[#F9FAFB] placeholder-[#9CA3AF] transition-all",
              "focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/15 focus:bg-[#070A13]"
            )}
          />
          
          {/* Ctrl+K Indicator / Clear Input */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {searchValue ? (
              <button onClick={() => setSearchValue("")} className="text-[#9CA3AF] hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="px-2 py-0.5 rounded bg-[#1E253E] border border-white/5 text-[9px] font-bold text-[#9CA3AF] uppercase">
                Ctrl + K
              </span>
            )}
          </div>
        </div>

        {/* Recent Searches Dropdown */}
        <AnimatePresence>
          {showRecentSearches && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 top-[52px] rounded-2xl bg-[#111827] border border-[#1E253E] shadow-2xl p-4 space-y-3"
            >
              <div className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" /> Recent Queries
              </div>
              <div className="space-y-1">
                {recentSearches.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSearchValue(item.text);
                      setShowRecentSearches(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-[#1E253E] text-xs text-[#F9FAFB] group transition-colors"
                  >
                    <span className="truncate">{item.text}</span>
                    <span className="text-[9px] text-[#9CA3AF] group-hover:text-[#2563EB] flex items-center gap-0.5 uppercase tracking-wider font-bold">
                      {item.type} <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION 3: Live AI Status Indicator */}
      <div 
        className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#111827] border border-[#1E253E] cursor-help relative"
        onMouseEnter={() => setShowAITooltip(true)}
        onMouseLeave={() => setShowAITooltip(false)}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
        </span>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-[#F9FAFB] leading-none">Gemma 4</span>
          <span className="text-[9px] font-semibold text-[#10B981] leading-none mt-1">NVIDIA NIM • 145ms</span>
        </div>

        {/* Status Tooltip */}
        <AnimatePresence>
          {showAITooltip && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute left-1/2 -translate-x-1/2 top-11 w-48 p-3 rounded-xl bg-[#0F1322] border border-[#1E253E] shadow-2xl z-50 text-[10px] text-[#9CA3AF] space-y-1"
            >
              <div className="font-bold text-white uppercase tracking-wider">System Indicators</div>
              <div>Model: <strong className="text-white">Gemma-4-9B-NIM</strong></div>
              <div>Status: <strong className="text-[#10B981]">Fully Operational</strong></div>
              <div>Latency: <strong className="text-white">145 ms (optimal)</strong></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION 4: Utility Area */}
      <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
        
        {/* Help button */}
        <button className="flex items-center justify-center w-10 h-10 rounded-xl text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#1E253E] transition-all">
          <HelpCircle className="w-4.5 h-4.5" />
        </button>

        {/* Theme Toggle (Optional UI) */}
        <button className="flex items-center justify-center w-10 h-10 rounded-xl text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#1E253E] transition-all">
          <Moon className="w-4.5 h-4.5" />
        </button>

        {/* Settings Button */}
        <Link
          href="/settings"
          className="flex items-center justify-center w-10 h-10 rounded-xl text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#1E253E] transition-all"
        >
          <Settings className="w-4.5 h-4.5" />
        </Link>

        {/* Notifications Icon with small badge */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) markAllRead();
            }}
            className="relative flex items-center justify-center w-10 h-10 rounded-xl text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#1E253E] transition-all"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EF4444] shadow-md shadow-red-500/50" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-80 rounded-2xl bg-[#111827] border border-[#1E253E] shadow-2xl overflow-hidden z-50"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E253E]">
                  <span className="text-[10px] font-bold text-[#F9FAFB] uppercase tracking-wider">Notifications</span>
                  <span className="text-[9px] font-semibold text-[#9CA3AF] bg-[#1E253E] px-2 py-0.5 rounded-md">
                    {alerts.length} Active Alerts
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-[#1E253E]/50">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex gap-3 px-4 py-3.5 hover:bg-[#1E253E]/30 transition-colors group">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444] mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-[#F9FAFB] leading-snug">{alert.title}</div>
                        <div className="text-[10px] text-[#9CA3AF] mt-0.5 leading-snug line-clamp-2">{alert.message}</div>
                      </div>
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="opacity-0 group-hover:opacity-100 text-[#9CA3AF] hover:text-white transition-all self-start"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 bg-[#111827] border-t border-[#1E253E] text-center">
                  <Link href="/settings" className="text-[10px] font-bold text-[#2563EB] hover:text-blue-400 transition-colors">
                    View Configuration Console →
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-[#1E253E] mx-1" />

        {/* User Profile Dropdown Component */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-[#1E253E] transition-all text-left"
          >
            <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-br from-[#2563EB] to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-blue-500/10">
              AM
            </div>
            <div className="hidden xl:flex flex-col">
              <span className="text-xs font-semibold text-[#F9FAFB] leading-none">Alexander Miller</span>
              <span className="text-[9px] text-[#9CA3AF] leading-none mt-1">Apex Manufacturing</span>
            </div>
            <ChevronDown className="w-4 h-4 text-[#9CA3AF]" />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-48 rounded-xl bg-[#111827] border border-[#1E253E] shadow-2xl p-2 z-50 space-y-1"
              >
                <div className="px-3 py-2 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider border-b border-[#1E253E]/50 mb-1">
                  My Profile Settings
                </div>
                <Link href="/settings" className="block px-3 py-2 rounded-lg text-xs text-[#F9FAFB] hover:bg-[#1E253E] transition-colors">
                  System Settings
                </Link>
                <button
                  onClick={() => window.location.href = "/login"}
                  className="w-full text-left block px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Log Out Session
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
}
