"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Bot, Sparkles } from "lucide-react";

export function FloatingCopilotButton() {
  return (
    <Link href="/copilot">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 pl-4 pr-5 py-3 rounded-2xl cursor-pointer select-none"
        style={{
          background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
          boxShadow: "0 8px 32px rgba(37, 99, 235, 0.4), 0 2px 8px rgba(0,0,0,0.4)",
        }}
      >
        {/* Pulse ring */}
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute inset-0 rounded-2xl bg-blue-600"
        />
        <div className="relative z-10 flex items-center gap-2">
          <div className="relative">
            <Bot className="w-4 h-4 text-white" />
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="absolute -top-1 -right-1 w-2 h-2 text-yellow-300" />
            </motion.div>
          </div>
          <span className="text-sm font-semibold text-white">Ask FORGE-PATH</span>
        </div>
      </motion.div>
    </Link>
  );
}
