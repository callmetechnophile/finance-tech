"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { FloatingCopilotButton } from "@/components/shared/FloatingCopilotButton";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#070A13]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col flex-shrink-0 h-full">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 h-full z-50 lg:hidden"
            >
              <Sidebar
                collapsed={false}
                onToggle={() => {}}
                mobile
                onMobileClose={() => setMobileMenuOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav onMobileMenuOpen={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-[#070A13]">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {children}
          </motion.div>
        </main>
      </div>

      <FloatingCopilotButton />
    </div>
  );
}
