"use client";

import React, { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle2, ChevronRight } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { Section } from "@/shared/components/layout/Section";

export function CommunicationCenterRegion() {
  const [activeChannel, setActiveChannel] = useState<"email" | "sms" | "whatsapp">("email");

  return (
    <Section title="Communication Center &amp; Automated Outreach" compact>
      <Panel className="bg-[#111] border-[#222] space-y-3" padded>
        <div className="flex justify-between items-center border-b border-[#222] pb-2">
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-[#faff69]" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Multichannel Outreach Trigger
            </h3>
          </div>

          {/* Channel Selector */}
          <div className="flex items-center gap-1 bg-[#1a1a1a] p-1 rounded border border-[#2a2a2a]">
            <button
              onClick={() => setActiveChannel("email")}
              className={[
                "px-2.5 py-1 text-[10px] font-bold rounded transition-all uppercase",
                activeChannel === "email" ? "bg-[#faff69] text-black" : "text-white/40 hover:text-white"
              ].join(" ")}
            >
              Brevo Email
            </button>
            <button
              onClick={() => setActiveChannel("sms")}
              className={[
                "px-2.5 py-1 text-[10px] font-bold rounded transition-all uppercase",
                activeChannel === "sms" ? "bg-[#faff69] text-black" : "text-white/40 hover:text-white"
              ].join(" ")}
            >
              Twilio SMS
            </button>
            <button
              onClick={() => setActiveChannel("whatsapp")}
              className={[
                "px-2.5 py-1 text-[10px] font-bold rounded transition-all uppercase",
                activeChannel === "whatsapp" ? "bg-[#faff69] text-black" : "text-white/40 hover:text-white"
              ].join(" ")}
            >
              WhatsApp
            </button>
          </div>
        </div>

        {/* Message Preview Box */}
        <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#222] space-y-2 text-xs">
          <div className="flex justify-between items-center text-[10px] text-white/40 border-b border-[#222] pb-1.5">
            <span>Target: <strong className="text-white">Apex Steel Works (finance@apexsteel.com)</strong></span>
            <span className="text-[#faff69] font-mono">Template: L3_DEMAND_V2</span>
          </div>

          <div className="p-2.5 rounded bg-[#0d0d0d] font-mono text-[10px] text-white/80 leading-relaxed space-y-1">
            <p className="text-white font-bold">[URGENT DEMAND NOTICE] - Invoice INV-2024-089 Overdue ($47,500)</p>
            <p className="text-white/60">Dear Finance Team,</p>
            <p className="text-white/60">This is a formal notification regarding outstanding invoice INV-2024-089 ($47,500) which is currently 45 days past due. Please confirm wire remittance by 5:00 PM EST to avoid account credit hold.</p>
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-[9px] text-green-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Ready for automated dispatch via {activeChannel.toUpperCase()}
            </span>
            <button
              onClick={() => alert(`Dispatched ${activeChannel.toUpperCase()} notice to Apex Steel Works.`)}
              className="px-3 py-1 rounded bg-[#faff69] hover:bg-[#e6eb52] text-black text-[10px] font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-3 h-3 fill-black" /> Dispatch Now
            </button>
          </div>
        </div>
      </Panel>
    </Section>
  );
}
