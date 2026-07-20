"use client";
import React from "react";
import { motion } from "framer-motion";
import { Check, X, Clock } from "lucide-react";
import { cn } from "@/shared/utils/cn";

type ApprovalStatus = "pending" | "approved" | "rejected";

interface ApprovalCardProps {
  title: string;
  description?: string;
  requestedBy?: string;
  requestedAt?: string;
  amount?: string;
  status?: ApprovalStatus;
  onApprove?: () => void;
  onReject?: () => void;
  loading?: boolean;
  className?: string;
}

const statusConfig: Record<ApprovalStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "text-amber-400" },
  approved: { label: "Approved", color: "text-green-400" },
  rejected: { label: "Rejected", color: "text-red-400" },
};

export function ApprovalCard({
  title,
  description,
  requestedBy,
  requestedAt,
  amount,
  status = "pending",
  onApprove,
  onReject,
  loading,
  className,
}: ApprovalCardProps) {
  const sc = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("p-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a]", className)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
            <span className="text-xs font-medium text-white/90 truncate">{title}</span>
          </div>
          {description && <p className="text-xs text-white/50 mt-1">{description}</p>}
          <div className="flex items-center gap-3 mt-2">
            {requestedBy && (
              <span className="text-[10px] text-white/30">by {requestedBy}</span>
            )}
            {requestedAt && (
              <span className="text-[10px] text-white/30">{requestedAt}</span>
            )}
            {amount && (
              <span className="text-xs font-semibold text-white/70">{amount}</span>
            )}
          </div>
        </div>
        <span className={cn("text-[10px] font-semibold flex-shrink-0", sc.color)}>
          {sc.label}
        </span>
      </div>

      {status === "pending" && (onApprove || onReject) && (
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#2a2a2a]">
          {onApprove && (
            <button
              onClick={onApprove}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium hover:bg-green-500/20 transition-colors disabled:opacity-40"
            >
              <Check className="w-3 h-3" /> Approve
            </button>
          )}
          {onReject && (
            <button
              onClick={onReject}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors disabled:opacity-40"
            >
              <X className="w-3 h-3" /> Reject
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
