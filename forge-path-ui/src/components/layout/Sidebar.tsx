"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "flex flex-col h-full relative",
        "border-r border-[#1E253E]",
        "bg-[#070A13] shadow-lg",
        mobile && "w-[280px]"
      )}
      style={{ width: mobile ? 280 : undefined }}
    >
      {/* Logo Header */}
      <div className="flex items-center gap-3 px-5 h-20 border-b border-[#1E253E] flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/10">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {(!collapsed || mobile) && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="font-bold text-[#F8FAFC] text-sm tracking-wide leading-none">FORGE-PATH</div>
              <div className="text-[10px] text-[#94A3B8] mt-1 font-semibold leading-none">AI CFO Command Center</div>
            </motion.div>
          )}
        </AnimatePresence>
        {mobile && (
          <button onClick={onMobileClose} className="ml-auto text-[#64748B] hover:text-[#F8FAFC] transition-colors">
            <X className="w-4.5 h-4.5" />
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
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#475569]">
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
                        "flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-[13px] font-semibold transition-all duration-200 group relative",
                        isActive
                          ? "text-[#3B82F6]"
                          : "text-[#94A3B8] hover:bg-[#111625] hover:text-[#F8FAFC]"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 rounded-xl bg-blue-500/5 border border-blue-500/10"
                          transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                        />
                      )}
                      <Icon className={cn("w-[18px] h-[18px] flex-shrink-0 relative z-10", isActive ? "text-[#3B82F6]" : "text-[#475569] group-hover:text-[#F8FAFC]")} />
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

      {/* Collapse Trigger */}
      {!mobile && (
        <div className="p-3 border-t border-[#1E253E]">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center h-10 rounded-xl text-[#475569] hover:text-[#F8FAFC] hover:bg-[#111625] transition-all"
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
            className="p-4 border-t border-[#1E253E]"
          >
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[#0F1322] border border-[#1E253E]">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-md">
                A
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-[#F8FAFC] truncate">Apex Manufacturing</div>
                <div className="text-[9px] font-semibold text-[#94A3B8] mt-0.5 uppercase tracking-wider">CNC & Fabrication</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
