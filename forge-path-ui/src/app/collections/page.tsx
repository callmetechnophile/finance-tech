"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { formatCurrency } from "@/lib/utils";
import { Search, Filter, Bot, Mail, MessageSquare, Send } from "lucide-react";
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
    }
  ]);

  const dispatchReminder = (channel: "email" | "sms") => {
    if (!selectedInvoice) return;
    toast.success(`Dispatched ${channel.toUpperCase()} reminder successfully.`);
  };

  return (
    <AppShell>
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <div>
          <h2 className="text-xl font-bold text-white">Collection Intelligence & Follow-up</h2>
          <p className="text-xs text-[#888888] mt-1">
            Priority scoring & automated communication escalation engine.
          </p>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[#2a2a2a] flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
              <input
                type="text"
                placeholder="Search by invoice number or customer..."
                className="w-full pl-9 pr-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-md text-xs text-white focus:outline-none"
              />
            </div>
            <button className="px-3 py-2 btn-secondary rounded-md text-xs flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter
            </button>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2a2a2a] text-[10px] uppercase font-bold text-[#888888]">
                <th className="p-4">Invoice #</th>
                <th className="p-4">Customer</th>
                <th className="p-4 text-right">Outstanding</th>
                <th className="p-4 text-right">Days Overdue</th>
                <th className="p-4 text-center">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a] text-xs">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#242424]/40 transition-colors">
                  <td className="p-4 font-semibold text-white">{inv.invoice_number}</td>
                  <td className="p-4 text-[#cccccc]">{inv.customer}</td>
                  <td className="p-4 text-right text-white font-medium font-tabular">{formatCurrency(inv.outstanding)}</td>
                  <td className="p-4 text-right text-[#ef4444] font-semibold">{inv.days_overdue}d</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inv.priority === "Critical" ? "bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/25" : "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/25"
                    }`}>
                      {inv.priority}
                    </span>
                  </td>
                  <td className="p-4 text-[#cccccc]">{inv.status}</td>
                  <td className="p-4">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-3 py-1 bg-[#faff69]/10 text-[#faff69] hover:bg-[#faff69] hover:text-[#0a0a0a] rounded-md text-[10px] font-bold transition-all"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail Drawer */}
        <AnimatePresence>
          {selectedInvoice && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-40"
                onClick={() => setSelectedInvoice(null)}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed right-0 top-0 h-full w-full max-w-lg bg-[#1a1a1a] border-l border-[#2a2a2a] shadow-2xl z-50 overflow-y-auto p-6 space-y-6"
              >
                <div className="flex justify-between items-center pb-4 border-b border-[#2a2a2a]">
                  <div>
                    <h3 className="text-sm font-bold text-white">{selectedInvoice.invoice_number}</h3>
                    <p className="text-[10px] text-[#888888]">{selectedInvoice.customer}</p>
                  </div>
                  <button onClick={() => setSelectedInvoice(null)} className="text-[#888888] hover:text-white">Close</button>
                </div>

                <div className="p-4 rounded-md bg-[#faff69]/5 border border-[#faff69]/10 space-y-2">
                  <div className="flex items-center gap-1.5 text-[#faff69]">
                    <Bot className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Gemma AI Explanation</span>
                  </div>
                  <p className="text-[11px] text-[#cccccc] leading-relaxed">
                    Invoice prioritized based on aging limit exceeding 45 days. Average delay from {selectedInvoice.customer} has spiked from 14 to 28 days over the last quarter.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Escalation Communications</h4>
                  
                  {/* Email */}
                  <div className="p-4 rounded-md bg-[#0a0a0a] border border-[#2a2a2a] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-[#faff69]" /> Brevo Email Draft</span>
                      <button onClick={() => dispatchReminder("email")} className="px-2.5 py-1 bg-[#faff69] text-[#0a0a0a] text-[10px] font-bold rounded-md flex items-center gap-1 hover:bg-[#e6eb52]">
                        <Send className="w-3 h-3" /> Send Email
                      </button>
                    </div>
                    <textarea
                      value={selectedInvoice.emailDraft}
                      onChange={(e) => setSelectedInvoice({ ...selectedInvoice, emailDraft: e.target.value })}
                      className="w-full h-24 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md p-2.5 text-xs text-[#cccccc] focus:outline-none"
                    />
                  </div>

                  {/* SMS */}
                  <div className="p-4 rounded-md bg-[#0a0a0a] border border-[#2a2a2a] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5 text-[#22c55e]" /> Twilio SMS Draft</span>
                      <button onClick={() => dispatchReminder("sms")} className="px-2.5 py-1 btn-secondary text-[10px] font-bold rounded-md flex items-center gap-1">
                        <Send className="w-3 h-3" /> Send SMS
                      </button>
                    </div>
                    <textarea
                      value={selectedInvoice.smsDraft}
                      onChange={(e) => setSelectedInvoice({ ...selectedInvoice, smsDraft: e.target.value })}
                      className="w-full h-20 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md p-2.5 text-xs text-[#cccccc] focus:outline-none"
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
