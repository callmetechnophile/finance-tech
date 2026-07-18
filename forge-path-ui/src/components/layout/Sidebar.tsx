"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FileText, TrendingUp, Droplets, CreditCard,
  Banknote, Bot, BarChart3, Settings, ChevronLeft, ChevronRight,
  Zap, X
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    group: "Core Systems",
    items: [
      { href: "/dashboard", label: "CFO Dashboard", icon: LayoutDashboard },
      { href: "/documents", label: "Document Registry", icon: FileText },
    ],
  },
  {
    group: "Decision Modules",
    items: [
      { href: "/cashflow", label: "Cash Flow Forecasting", icon: TrendingUp },
      { href: "/liquidity", label: "Liquidity Intelligence", icon: Droplets },
      { href: "/collections", label: "Receivables Collections", icon: CreditCard },
      { href: "/payments", label: "Payment Optimization", icon: Banknote },
    ],
  },
  {
    group: "AI Capabilities",
    items: [
      { href: "/copilot", label: "Financial Copilot", icon: Bot },
      { href: "/analytics", label: "Interactive Analytics", icon: BarChart3 },
      { href: "/settings", label: "Command Settings", icon: Settings },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobile?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ collapsed, onToggle, mobile, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 280 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "flex flex-col h-full relative border-r border-[#2a2a2a] bg-[#1a1a1a] shadow-lg",
        mobile && "w-[280px]"
      )}
      style={{ width: mobile ? 280 : undefined }}
    >
      {/* Brand Logo Header */}
      <div className="flex items-center gap-3 px-5 h-20 border-b border-[#2a2a2a] flex-shrink-0">
        <div className="w-9 h-9 rounded-md bg-[#faff69] flex items-center justify-center flex-shrink-0 shadow-md">
          <Zap className="w-5 h-5 text-[#0a0a0a]" />
        </div>
        <AnimatePresence>
          {(!collapsed || mobile) && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div className="font-bold text-white text-sm tracking-wide leading-none">FORGE-PATH</div>
              <div className="text-[10px] text-[#cccccc] mt-1 font-semibold leading-none">AI CFO Command Center</div>
            </motion.div>
          )}
        </AnimatePresence>
        {mobile && (
          <button onClick={onMobileClose} className="ml-auto text-[#888888] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
        {NAV_ITEMS.map((group) => (
          <div key={group.group}>
            <AnimatePresence>
              {(!collapsed || mobile) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 pb-3 pt-1"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#888888]">
                    {group.group}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <ul className="space-y-1.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onMobileClose}
                      className={cn(
                        "flex items-center gap-3.5 rounded-md px-4 py-3 text-[13px] font-semibold transition-all duration-150 group relative",
                        isActive
                          ? "text-[#faff69]"
                          : "text-[#cccccc] hover:bg-[#242424] hover:text-white"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 rounded-md bg-[#faff69]/5 border border-[#faff69]/10"
                          transition={{ type: "spring", bounce: 0.15, duration: 0.3 }}
                        />
                      )}
                      <Icon className={cn("w-[18px] h-[18px] flex-shrink-0 relative z-10", isActive ? "text-[#faff69]" : "text-[#888888] group-hover:text-white")} />
                      <AnimatePresence>
                        {(!collapsed || mobile) && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative z-10 whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      {!mobile && (
        <div className="p-3 border-t border-[#2a2a2a]">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center h-10 rounded-md text-[#888888] hover:text-white hover:bg-[#242424] transition-all"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      )}

      {/* Company Bottom Profile Info */}
      <AnimatePresence>
        {(!collapsed || mobile) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 border-t border-[#2a2a2a]"
          >
            <div className="flex items-center gap-3 px-3 py-3 rounded-md bg-[#0a0a0a] border border-[#2a2a2a]">
              <div className="w-8 h-8 rounded-md bg-[#faff69] flex items-center justify-center text-xs font-bold text-[#0a0a0a] flex-shrink-0 shadow-md">
                AM
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">Apex Manufacturing</div>
                <div className="text-[9px] font-semibold text-[#888888] mt-0.5 uppercase tracking-wider">CNC & Fabrication</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
