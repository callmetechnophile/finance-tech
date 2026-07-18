"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { formatCurrency } from "@/lib/utils";
import { Search, Filter, ShieldAlert, Bot, Mail, MessageSquare, Send, Calendar, CheckSquare, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface InvoiceData {
  id: string;
  invoice_number: string;
  customer: string;
  amount: number;
  outstanding: number;
  days_overdue: number;
  priority: "Critical" | "High" | "Medium" | "Low";
  risk: "High" | "Medium" | "Low";
  status: string;
  emailDraft: string;
  smsDraft: string;
}

export default function CollectionsPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);

  const [invoices, setInvoices] = useState<InvoiceData[]>([
    {
      id: "inv-1",
      invoice_number: "INV-2024-089",
      customer: "Apex Steel Works",
      amount: 47500,
      outstanding: 47500,
      days_overdue: 45,
      priority: "Critical",
      risk: "High",
      status: "L3 Escalation",
      emailDraft: "Dear Apex Steel, Invoice INV-2024-089 is now 45 days overdue. Please settle the balance of $47,500.",
      smsDraft: "Reminder: Invoice INV-2024-089 of $47,500 is overdue. Pay immediately to avoid suspension."
    },
    {
      id: "inv-2",
      invoice_number: "INV-2024-094",
      customer: "Vanguard Machining",
      amount: 28000,
      outstanding: 28000,
      days_overdue: 18,
      priority: "High",
      risk: "Medium",
      status: "L1 Reminder",
      emailDraft: "Hi Vanguard, just a friendly reminder that Invoice INV-2024-094 ($28,000) is past due.",
      smsDraft: "Friendly reminder: Vanguard INV-2024-094 ($28,000) is past due."
    },
    {
      id: "inv-3",
      invoice_number: "INV-2024-102",
      customer: "Delta Fabrication",
      amount: 15600,
      outstanding: 8000,
      days_overdue: 5,
      priority: "Medium",
      risk: "Low",
      status: "Sent",
      emailDraft: "Hi Delta, outstanding balance on invoice INV-2024-102 is $8,000.",
      smsDraft: "Reminder: Delta invoice balance outstanding is $8,000."
    }
  ]);

  const dispatchReminder = (channel: "email" | "sms" | "whatsapp") => {
    if (!selectedInvoice) return;
    toast.success(`Dispatched ${channel.toUpperCase()} reminder for ${selectedInvoice.invoice_number} successfully.`);
  };

  return (
    <AppShell>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Collection Intelligence & Follow-up</h2>
            <p className="text-xs text-[#9CA3AF] mt-1">
              Priority scoring & automated communication escalation engine.
            </p>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="bg-[#111827] border border-[#1f2d44] rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-[#1f2d44] flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563]" />
              <input
                type="text"
                placeholder="Search by invoice number or customer..."
                className="w-full pl-9 pr-4 py-2 bg-[#0d1625] border border-[#1f2d44] rounded-xl text-xs text-white focus:outline-none"
              />
            </div>
            <button className="px-3 py-2 bg-[#0d1625] border border-[#1f2d44] rounded-xl text-xs text-white flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter
            </button>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1f2d44] text-[10px] uppercase font-bold text-[#6B7280]">
                <th className="p-4">Invoice #</th>
                <th className="p-4">Customer</th>
                <th className="p-4 text-right">Outstanding</th>
                <th className="p-4 text-right">Days Overdue</th>
                <th className="p-4 text-center">Priority</th>
                <th className="p-4 text-center">Risk</th>
                <th className="p-4">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2d44]/30 text-xs">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#1a2235]/40 transition-colors">
                  <td className="p-4 font-semibold text-white">{inv.invoice_number}</td>
                  <td className="p-4 text-[#9CA3AF]">{inv.customer}</td>
                  <td className="p-4 text-right text-white font-medium">{formatCurrency(inv.outstanding)}</td>
                  <td className="p-4 text-right text-red-400 font-semibold">{inv.days_overdue}d</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inv.priority === "Critical" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                    }`}>
                      {inv.priority}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inv.risk === "High" ? "bg-red-500/10 text-red-400" : "bg-yellow-500/10 text-yellow-400"
                    }`}>
                      {inv.risk}
                    </span>
                  </td>
                  <td className="p-4 text-[#9CA3AF]">{inv.status}</td>
                  <td className="p-4">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-3 py-1 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg text-[10px] font-bold transition-all"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Invoice Detail Drawer */}
        <AnimatePresence>
          {selectedInvoice && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-40"
                onClick={() => setSelectedInvoice(null)}
              />

              {/* Drawer Container */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed right-0 top-0 h-full w-full max-w-lg bg-[#111827] border-l border-[#1f2d44] shadow-2xl z-50 overflow-y-auto p-6 space-y-6"
              >
                <div className="flex justify-between items-center pb-4 border-b border-[#1f2d44]">
                  <div>
                    <h3 className="text-sm font-bold text-white">{selectedInvoice.invoice_number}</h3>
                    <p className="text-[10px] text-[#6B7280]">{selectedInvoice.customer}</p>
                  </div>
                  <button onClick={() => setSelectedInvoice(null)} className="text-[#6B7280] hover:text-white">Close</button>
                </div>

                {/* Gemma Explanation */}
                <div className="p-4 rounded-xl bg-violet-600/10 border border-violet-500/20 space-y-2">
                  <div className="flex items-center gap-1.5 text-violet-400">
                    <Bot className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Gemma AI Explanation</span>
                  </div>
                  <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
                    Invoice prioritized based on aging limit exceeding 45 days. Average delay from {selectedInvoice.customer} has spiked from 14 to 28 days over the last quarter. Cash runway metrics suggest immediate collection is required.
                  </p>
                </div>

                {/* Live Previews */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">Escalation Communications</h4>
                  
                  {/* Email */}
                  <div className="p-4 rounded-xl bg-[#0d1625] border border-[#1f2d44] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-blue-400" /> Brevo Email Draft</span>
                      <button onClick={() => dispatchReminder("email")} className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-[10px] font-bold text-white rounded-lg flex items-center gap-1">
                        <Send className="w-3 h-3" /> Send Email
                      </button>
                    </div>
                    <textarea
                      value={selectedInvoice.emailDraft}
                      onChange={(e) => setSelectedInvoice({ ...selectedInvoice, emailDraft: e.target.value })}
                      className="w-full h-24 bg-[#111827] border border-[#1f2d44] rounded-lg p-2.5 text-xs text-[#9CA3AF] focus:outline-none"
                    />
                  </div>

                  {/* SMS / WhatsApp */}
                  <div className="p-4 rounded-xl bg-[#0d1625] border border-[#1f2d44] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> Twilio SMS Draft</span>
                      <button onClick={() => dispatchReminder("sms")} className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-[10px] font-bold text-white rounded-lg flex items-center gap-1">
                        <Send className="w-3 h-3" /> Send SMS
                      </button>
                    </div>
                    <textarea
                      value={selectedInvoice.smsDraft}
                      onChange={(e) => setSelectedInvoice({ ...selectedInvoice, smsDraft: e.target.value })}
                      className="w-full h-20 bg-[#111827] border border-[#1f2d44] rounded-lg p-2.5 text-xs text-[#9CA3AF] focus:outline-none"
                    />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
