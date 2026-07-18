"use client";

import { AppShell } from "@/components/layout/AppShell";
import { formatCurrency } from "@/lib/utils";
import { Search, DollarSign, Calendar, Clock, Percent, AlertCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PayoutItem {
  id: string;
  vendor: string;
  amount: number;
  due_date: string;
  priority: "High" | "Medium" | "Low";
  discountOpportunity: string | null;
  penaltyRisk: string | null;
  status: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PayoutItem[]>([
    {
      id: "pay-1",
      vendor: "Iron Ore Supply Inc.",
      amount: 45000,
      due_date: "2026-07-22",
      priority: "High",
      discountOpportunity: "Save $900 if paid by tomorrow (2/10 Net 30)",
      penaltyRisk: null,
      status: "Queued"
    },
    {
      id: "pay-2",
      vendor: "Amada Machinery Leasing",
      amount: 12000,
      due_date: "2026-07-25",
      priority: "Medium",
      discountOpportunity: null,
      penaltyRisk: "1.5% late fee applies after July 25",
      status: "Needs Approval"
    },
    {
      id: "pay-3",
      vendor: "Precision Tooling Corp",
      amount: 8500,
      due_date: "2026-08-01",
      priority: "Low",
      discountOpportunity: "Save $170 if paid early",
      penaltyRisk: null,
      status: "Deferred"
    }
  ]);

  const executePay = (id: string, vendor: string) => {
    toast.success(`Initiated direct ACH payout of amount to ${vendor}.`);
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const executeDelay = (id: string) => {
    toast.info("Rescheduled payout date to safeguard current runway thresholds.");
    setPayments((prev) => prev.map((p) => p.id === id ? { ...p, status: "Deferred" } : p));
  };

  return (
    <AppShell>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div>
          <h2 className="text-xl font-bold text-white">Payment Optimization Engine</h2>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Analyze cash discount capture vs liquidity impact to schedule accounts payable dynamically.
          </p>
        </div>

        {/* Top Summary row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#111827] border border-[#1E253E]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Queued Payables</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xl font-bold text-white">{formatCurrency(65500)}</span>
            </div>
            <p className="text-[10px] text-[#6B7280] mt-1">3 upcoming vendor obligations</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#111827] border border-[#1E253E]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Discount Capture Potential</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xl font-bold text-emerald-400">{formatCurrency(1070)}</span>
            </div>
            <p className="text-[10px] text-emerald-400 mt-1 font-semibold">Active discounts available</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#111827] border border-[#1E253E]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Penalty Exposure</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xl font-bold text-red-400">{formatCurrency(180)}</span>
            </div>
            <p className="text-[10px] text-red-400 mt-1 font-semibold">Risk from past due deadlines</p>
          </div>
        </div>

        {/* Payables List */}
        <div className="bg-[#111827] border border-[#1E253E] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1E253E]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">Payment Optimizer Queue</h3>
          </div>

          <div className="divide-y divide-[#1f2d44]/30">
            {payments.map((p) => (
              <div key={p.id} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white">{p.vendor}</h4>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      p.priority === "High" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}>
                      {p.priority}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#6B7280] flex items-center gap-3">
                    <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {formatCurrency(p.amount)}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Due {p.due_date}</span>
                  </div>
                  
                  {p.discountOpportunity && (
                    <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-1.5">
                      <Percent className="w-3 h-3" /> {p.discountOpportunity}
                    </div>
                  )}

                  {p.penaltyRisk && (
                    <div className="text-[10px] text-red-400 font-semibold flex items-center gap-1 mt-1.5">
                      <AlertCircle className="w-3.5 h-3.5" /> {p.penaltyRisk}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => executePay(p.id, p.vendor)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-xl shadow-lg shadow-blue-600/10 transition-all cursor-pointer"
                  >
                    Pay Now
                  </button>
                  <button
                    onClick={() => executeDelay(p.id)}
                    className="px-3.5 py-1.5 bg-[#0d1625] hover:bg-[#1a2235] border border-[#1E253E] text-xs font-semibold text-white rounded-xl transition-all"
                  >
                    Delay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
