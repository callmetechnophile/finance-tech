"use client";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/shared/utils/cn";

type BubbleRole = "user" | "assistant";

interface ConversationBubbleProps {
  role: BubbleRole;
  content: string;
  timestamp?: string;
  avatar?: React.ReactNode;
  className?: string;
  loading?: boolean;
}

export function ConversationBubble({
  role,
  content,
  timestamp,
  avatar,
  className,
  loading,
}: ConversationBubbleProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("flex gap-2.5", isUser && "flex-row-reverse", className)}
    >
      <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full mt-0.5">
        {avatar ??
          (isUser ? (
            <div className="w-7 h-7 rounded-full bg-[#faff69] text-black text-[10px] font-bold flex items-center justify-center">
              U
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#faff69]/10 text-[#faff69] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          ))}
      </div>
      <div className={cn("max-w-[85%] flex flex-col gap-1", isUser && "items-end")}>
        <div
          className={cn(
            "px-3 py-2.5 rounded-xl text-xs leading-relaxed",
            isUser
              ? "bg-[#faff69] text-black rounded-tr-sm font-medium"
              : "bg-[#1a1a1a] text-white/80 border border-[#2a2a2a] rounded-tl-sm"
          )}
        >
          {loading ? (
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, delay: i * 0.15, duration: 0.6 }}
                  className="w-1.5 h-1.5 rounded-full bg-white/30"
                />
              ))}
            </div>
          ) : (
            content
          )}
        </div>
        {timestamp && (
          <span className="text-[10px] text-white/20">{timestamp}</span>
        )}
      </div>
    </motion.div>
  );
}
