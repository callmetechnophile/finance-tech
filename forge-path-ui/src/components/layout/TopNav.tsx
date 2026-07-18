"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Search, Settings, Moon, HelpCircle, ChevronDown, Sparkles, X, History, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotificationsStore } from "@/store/notifications.store";
import { cn } from "@/lib/utils";
import Link from "next/link";

const recentSearches = [
  { text: "Apex Steel invoice INV-2024-089", type: "invoice" },
  { text: "CNC Machine lease terms", type: "document" },
  { text: "Q3 cash flow projection scenarios", type: "forecast" }
];

interface TopNavProps {
  onMobileMenuOpen?: () => void;
}

export function TopNav({ onMobileMenuOpen }: TopNavProps) {
  const { alerts, unreadCount, markAllRead, dismissAlert } = useNotificationsStore();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showAITooltip, setShowAITooltip] = useState(false);

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
    <header className="h-[72px] border-b border-[#2a2a2a] bg-[#0a0a0a]/90 backdrop-blur-xl flex items-center px-6 gap-6 sticky top-0 z-40 shadow-md">
      
      {/* Brand logo details for mobile */}
      <button onClick={onMobileMenuOpen} className="lg:hidden p-2 text-[#cccccc] hover:text-white">
        <Sparkles className="w-5 h-5" />
      </button>

      {/* SECTION 2: Centered Global Search (40% - 50% width) */}
      <div ref={searchRef} className="flex-1 max-w-[45%] mx-auto relative z-50">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888] pointer-events-none" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Search invoices, vendors, customers, transactions, forecasts..."
            value={searchValue}
            onFocus={() => setShowRecentSearches(true)}
            onChange={(e) => setSearchValue(e.target.value)}
            className={cn(
              "w-full pl-10 pr-20 h-[46px] rounded-md bg-[#1a1a1a] border border-[#2a2a2a]",
              "text-[13px] text-white placeholder-[#888888] transition-all",
              "focus:outline-none focus:border-[#faff69] focus:ring-2 focus:ring-[#faff69]/15 focus:bg-[#0a0a0a]"
            )}
          />
          
          {/* Ctrl+K Indicator / Clear Input */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {searchValue ? (
              <button onClick={() => setSearchValue("")} className="text-[#888888] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            ) : (
              <span className="px-2 py-0.5 rounded bg-[#2a2a2a] border border-white/5 text-[9px] font-bold text-[#888888] uppercase">
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
              className="absolute left-0 right-0 top-[52px] rounded-md bg-[#1a1a1a] border border-[#2a2a2a] shadow-2xl p-4 space-y-3"
            >
              <div className="text-[10px] font-bold text-[#888888] uppercase tracking-wider flex items-center gap-1.5">
                Recent Queries
              </div>
              <div className="space-y-1">
                {recentSearches.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSearchValue(item.text);
                      setShowRecentSearches(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md text-left hover:bg-[#242424] text-xs text-white group transition-colors"
                  >
                    <span className="truncate">{item.text}</span>
                    <span className="text-[9px] text-[#888888] group-hover:text-[#faff69] flex items-center gap-0.5 uppercase tracking-wider font-bold">
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
        className="flex items-center gap-3 px-4 py-2 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] cursor-help relative"
        onMouseEnter={() => setShowAITooltip(true)}
        onMouseLeave={() => setShowAITooltip(false)}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]"></span>
        </span>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-white leading-none">Gemma 4</span>
          <span className="text-[9px] font-semibold text-[#22c55e] leading-none mt-1">NVIDIA NIM • 145ms</span>
        </div>

        {/* Status Tooltip */}
        <AnimatePresence>
          {showAITooltip && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute left-1/2 -translate-x-1/2 top-11 w-48 p-3 rounded-md bg-[#121212] border border-[#2a2a2a] shadow-2xl z-50 text-[10px] text-[#cccccc] space-y-1"
            >
              <div className="font-bold text-white uppercase tracking-wider">System Indicators</div>
              <div>Model: <strong className="text-white">Gemma-4-9B-NIM</strong></div>
              <div>Status: <strong className="text-[#22c55e]">Operational</strong></div>
              <div>Latency: <strong className="text-white">145 ms (optimal)</strong></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION 4: Utility Area */}
      <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
        
        <button className="flex items-center justify-center w-10 h-10 rounded-md text-[#888888] hover:text-white hover:bg-[#242424] transition-all">
          <HelpCircle className="w-4 h-4" />
        </button>

        <button className="flex items-center justify-center w-10 h-10 rounded-md text-[#888888] hover:text-white hover:bg-[#242424] transition-all">
          <Moon className="w-4 h-4" />
        </button>

        <Link
          href="/settings"
          className="flex items-center justify-center w-10 h-10 rounded-md text-[#888888] hover:text-white hover:bg-[#242424] transition-all"
        >
          <Settings className="w-4 h-4" />
        </Link>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) markAllRead();
            }}
            className="relative flex items-center justify-center w-10 h-10 rounded-md text-[#888888] hover:text-white hover:bg-[#242424] transition-all"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ef4444] shadow-md" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-80 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] shadow-2xl overflow-hidden z-50"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2a2a]">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">Notifications</span>
                  <span className="text-[9px] font-semibold text-[#888888] bg-[#242424] px-2 py-0.5 rounded-md">
                    {alerts.length} Active Alerts
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-[#2a2a2a]">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex gap-3 px-4 py-3.5 hover:bg-[#242424]/30 transition-colors group">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444] mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-white leading-snug">{alert.title}</div>
                        <div className="text-[10px] text-[#cccccc] mt-0.5 leading-snug line-clamp-2">{alert.message}</div>
                      </div>
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="opacity-0 group-hover:opacity-100 text-[#888888] hover:text-white transition-all self-start"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 bg-[#1a1a1a] border-t border-[#2a2a2a] text-center">
                  <Link href="/settings" className="text-[10px] font-bold text-[#faff69] hover:text-yellow-300 transition-colors">
                    View Configuration Console →
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-[#2a2a2a] mx-1" />

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-[#242424] transition-all text-left"
          >
            <div className="w-[30px] h-[30px] rounded-md bg-[#faff69] flex items-center justify-center text-xs font-bold text-[#0a0a0a] shadow-md">
              AM
            </div>
            <div className="hidden xl:flex flex-col">
              <span className="text-xs font-semibold text-white leading-none">Alexander Miller</span>
              <span className="text-[9px] text-[#888888] leading-none mt-1">Apex Manufacturing</span>
            </div>
            <ChevronDown className="w-4 h-4 text-[#888888]" />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-48 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] shadow-2xl p-2 z-50 space-y-1"
              >
                <div className="px-3 py-2 text-[10px] font-bold text-[#888888] uppercase tracking-wider border-b border-[#2a2a2a] mb-1">
                  My Profile
                </div>
                <Link href="/settings" className="block px-3 py-2 rounded-md text-xs text-white hover:bg-[#242424] transition-colors">
                  System Settings
                </Link>
                <button
                  onClick={() => window.location.href = "/login"}
                  className="w-full text-left block px-3 py-2 rounded-md text-xs text-red-400 hover:bg-red-500/10 transition-colors"
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
