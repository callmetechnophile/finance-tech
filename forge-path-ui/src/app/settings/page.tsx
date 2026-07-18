"use client";

import { AppShell } from "@/components/layout/AppShell";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [dbStatus, setDbStatus] = useState("Connected");

  const saveSettings = () => {
    toast.success("Settings updated successfully.");
  };

  return (
    <AppShell>
      <div className="p-8 space-y-8 max-w-4xl mx-auto">
        <div>
          <h2 className="text-xl font-bold text-white">System Settings Console</h2>
          <p className="text-xs text-[#888888] mt-1">
            Configure Neon database connections, Twilio notification profiles, and Brevo mail endpoints.
          </p>
        </div>

        <div className="p-6 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-[#2a2a2a] pb-2">Neon Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-2">Primary Database URI</label>
                <input
                  type="password"
                  disabled
                  value="postgresql://neondb_owner:••••••••••••••••@ep-delicate-moon-awljaoz4-pooler.c-12.us-east-1.aws.neon.tech/neondb"
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-md text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-2">Connection Status</label>
                <div className="h-[38px] flex items-center px-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-md text-xs text-[#22c55e] font-semibold">
                  <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full mr-2" /> {dbStatus}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-[#2a2a2a] pb-2">Notification Gateways</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-2">Twilio virtual phone</label>
                <input
                  type="text"
                  defaultValue="+1 201 555 0199"
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-md text-xs text-white focus:outline-none focus:border-[#faff69]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-2">Brevo Mailer Account</label>
                <input
                  type="email"
                  defaultValue="billing@apex-manufacturing.com"
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-md text-xs text-white focus:outline-none focus:border-[#faff69]"
                />
              </div>
            </div>
          </div>

          <button onClick={saveSettings} className="btn-primary">
            Save System Changes
          </button>
        </div>
      </div>
    </AppShell>
  );
}
