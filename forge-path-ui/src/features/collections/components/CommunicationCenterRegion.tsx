"use client";

import React, { useState } from "react";
import { Mail, Send } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { Section } from "@/shared/components/layout/Section";
import { useDocumentStatusStore } from "@/shared/stores/document-status.store";

export function CommunicationCenterRegion() {
  const [activeChannel, setActiveChannel] = useState<"email" | "sms" | "whatsapp">("email");
  const { uploadedCount } = useDocumentStatusStore();
  const hasData = uploadedCount > 0;

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

          <div className="flex items-center gap-1 bg-[#1a1a1a] p-1 rounded border border-[#2a2a2a]">
            {(["email", "sms", "whatsapp"] as const).map((ch) => (
              <button
                key={ch}
                onClick={() => setActiveChannel(ch)}
                className={[
                  "px-2.5 py-1 text-[10px] font-bold rounded transition-all uppercase",
                  activeChannel === ch ? "bg-[#faff69] text-black" : "text-white/40 hover:text-white"
                ].join(" ")}
              >
                {ch === "email" ? "Brevo Email" : ch === "sms" ? "Twilio SMS" : "WhatsApp"}
              </button>
            ))}
          </div>
        </div>

        {hasData ? (
          <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#222] space-y-2 text-xs">
            <div className="flex justify-between items-center text-[10px] text-white/40 border-b border-[#222] pb-1.5">
              <span>Target: <strong className="text-white">Active Account</strong></span>
            </div>
            <button
              onClick={() => alert(`Dispatched ${activeChannel.toUpperCase()} notice.`)}
              className="px-3 py-1 rounded bg-[#faff69] hover:bg-[#e6eb52] text-black text-[10px] font-bold uppercase transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-3 h-3 fill-black" /> Dispatch Now
            </button>
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-white/40">
            No receivables imported.
          </div>
        )}
      </Panel>
    </Section>
  );
}
