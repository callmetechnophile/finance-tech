"use client";

import { AppShell } from "@/components/layout/AppShell";
import { formatCurrency } from "@/lib/utils";
import { Search, DollarSign, Calendar, AlertCircle } from "lucide-react";
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
    { id: "pay-1", vendor: "Iron Ore Supply Inc.", amount: 45000, due_date: "2026-07-22", priority: "High", discountOpportunity: "Save $900 if paid by tomorrow (2/10 Net 30)", penaltyRisk: null, status: "Queued" },
    { id: "pay-2", vendor: "Amada Machinery Leasing", amount: 12000, due_date: "2026-07-25", priority: "Medium", discountOpportunity: null, penaltyRisk: "1.5% late fee applies after July 25", status: "Needs Approval" }
  ]);

  const executePay = (id: string, vendor: string) => {
    toast.success(`Initiated direct ACH payout to ${vendor}.`);
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <AppShell>
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <div>
          <h2 className="text-xl font-bold text-white">Payment Optimization Engine</h2>
          <p className="text-xs text-[#888888] mt-1">
            Analyze cash discount capture vs liquidity impact to schedule accounts payable dynamically.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#888888]">Queued Payables</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xl font-bold text-white font-tabular">{formatCurrency(57000)}</span>
            </div>
            <p className="text-[10px] text-[#888888] mt-1">2 upcoming vendor obligations</p>
          </div>

          <div className="p-5 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#888888]">Discount Capture</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xl font-bold text-[#22c55e] font-tabular">{formatCurrency(900)}</span>
            </div>
            <p className="text-[10px] text-[#22c55e] mt-1 font-semibold">Active discounts available</p>
          </div>

          <div className="p-5 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#888888]">Penalty Exposure</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xl font-bold text-[#ef4444] font-tabular">{formatCurrency(180)}</span>
            </div>
            <p className="text-[10px] text-[#ef4444] mt-1 font-semibold">Risk from past due deadlines</p>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-[#2a2a2a]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Payment Optimizer Queue</h3>
          </div>

          <div className="divide-y divide-[#2a2a2a]">
            {payments.map((p) => (
              <div key={p.id} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white">{p.vendor}</h4>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      p.priority === "High" ? "bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/25" : "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/25"
                    }`}>
                      {p.priority}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#888888] flex items-center gap-3">
                    <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {formatCurrency(p.amount)}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Due {p.due_date}</span>
                  </div>
                  
                  {p.discountOpportunity && (
                    <div className="text-[10px] text-[#22c55e] font-semibold mt-1.5">
                      {p.discountOpportunity}
                    </div>
                  )}

                  {p.penaltyRisk && (
                    <div className="text-[10px] text-[#ef4444] font-semibold mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {p.penaltyRisk}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button onClick={() => executePay(p.id, p.vendor)} className="btn-primary text-xs h-8 py-0 px-3.5">
                    Pay Now
                  </button>
                  <button className="btn-secondary text-xs h-8 py-0 px-3.5">
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
