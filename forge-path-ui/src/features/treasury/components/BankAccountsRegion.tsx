"use client";

import React from "react";
import { Landmark, ArrowUpRight, ShieldCheck, RefreshCw } from "lucide-react";
import { Panel } from "@/shared/components/layout/Panel";
import { Section } from "@/shared/components/layout/Section";

export function BankAccountsRegion() {
  const accounts = [
    {
      name: "Chase Operating Checking",
      accountNo: "...0192",
      balance: "$242,000",
      type: "Primary Operating",
      status: "Synced (1 min ago)",
      apy: "0.5% APY",
    },
    {
      name: "Neon Treasury Yield Reserve",
      accountNo: "...8841",
      balance: "$100,000",
      type: "Yield Reserve",
      status: "Synced (2 min ago)",
      apy: "4.8% APY",
    },
    {
      name: "SVB Revolving Credit Facility",
      accountNo: "...5512",
      balance: "$250,000 Limit",
      type: "Credit Line ($0 Drawn)",
      status: "Active",
      apy: "Prime + 1.2%",
    },
  ];

  return (
    <Section title="Connected Banking Infrastructure &amp; Accounts" compact>
      <Panel className="bg-[#111] border-[#222] space-y-3" padded>
        <div className="flex justify-between items-center border-b border-[#222] pb-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5 text-[#faff69]" /> Bank Accounts Telemetry
          </h3>
          <span className="text-[10px] text-white/40 font-mono">3 Accounts Connected</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {accounts.map((acc) => (
            <div key={acc.accountNo} className="p-3 rounded-lg bg-[#1a1a1a] border border-[#222] space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-white text-xs">{acc.name}</h4>
                  <span className="text-[9px] text-white/40 font-mono">{acc.accountNo} · {acc.type}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                  {acc.apy}
                </span>
              </div>

              <div className="border-t border-[#222] pt-2 flex justify-between items-center">
                <span className="text-base font-bold text-white font-mono">{acc.balance}</span>
                <span className="text-[9px] text-white/30">{acc.status}</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </Section>
  );
}
